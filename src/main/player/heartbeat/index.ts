import { BilibiliPlayer } from "..";
import { heartbeat, HEARTBEAT_PLAY_TYPE, HEARTBEAT_TYPE } from "../../../io/com/bilibili/api/x/click-interface/web/heartbeat";
import { ev, PLAYER_EVENT } from "../../../player/event";
import { Checkbox } from "../../../player/widget/checkbox";
import { cookie } from "../../../utils/cookie";
import { Element } from "../../../utils/element";
import { MAIN_EVENT, mainEv } from "../../event";
import { mainOptions } from "../../option";
import { POLICY } from "../../policy";

export class HeartBeat {

    /** 允许心跳 */
    private heartbeat = true;

    /** 允许seek心跳 */
    private heartbeatSeek = false;

    private $csrf = cookie.get('bili_jct');

    constructor(
        private player: BilibiliPlayer,
    ) {
        player.$video.addEventListener('play', this.onPlay);
        player.$video.addEventListener('pause', this.onPause);
        player.$video.addEventListener('seeking', this.onSeeking);
        player.$video.addEventListener('seeked', this.onSeeked);
        player.$video.addEventListener('ended', this.onEnded);

        ev.bind(PLAYER_EVENT.LOAD_VIDEO_FILE, () => {
            this.heartbeat = false;
        });

        const $policyContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.player.$auxiliary.$info.$setting.$list, data: { label: '播放策略' } });
        const $incognitoContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.player.$auxiliary.$info.$setting.$list });
        /** 播放策略 */
        const $policy = Element.add('select', { class: 'bpui-select', appendTo: $policyContent });
        /** 无痕模式 */
        const $incognito = $incognitoContent.appendChild(new Checkbox());
        $policy.innerHTML = `<option value="${POLICY.AVC}">AVC</option><option value="${POLICY.HEVC}">HEVC</option><option value="${POLICY.AV1}">AV1</option>`;
        $incognito.$text = '无痕模式';

        mainEv.bind(MAIN_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { incognito, policy } = detail;

            $incognito.$value = incognito;
            this.heartbeat = !incognito;
            $policy.value = <any>policy;
        });
        $policy.addEventListener('change', () => {
            mainOptions.policy = +$policy.value;
        });
        $incognito.addEventListener('change', () => {
            mainOptions.incognito = $incognito.$value;
        });
    }

    private onPlay = () => {
        this.heartbeatSeek = true;
        this.player.$cid && this.heartbeat && this.$csrf && heartbeat(
            this.$csrf,
            this.player.$aid,
            this.player.$cid,
            this.player.$video.currentTime,
            HEARTBEAT_PLAY_TYPE.CONTINUE,
            this.player.$epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
        );
    }

    private onPause = () => {
        this.player.$cid && this.heartbeat && this.$csrf && heartbeat(
            this.$csrf,
            this.player.$aid,
            this.player.$cid,
            this.player.$video.currentTime,
            HEARTBEAT_PLAY_TYPE.PAUSE,
            this.player.$epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
        );
    }

    private onSeeking = () => {
        this.player.$cid && this.heartbeat && this.heartbeatSeek && this.$csrf && heartbeat(
            this.$csrf,
            this.player.$aid,
            this.player.$cid,
            this.player.$video.currentTime,
            HEARTBEAT_PLAY_TYPE.START,
            this.player.$epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
        );
    }

    private onSeeked = () => {
        this.player.$cid && this.heartbeat && this.heartbeatSeek && this.$csrf && heartbeat(
            this.$csrf,
            this.player.$aid,
            this.player.$cid,
            this.player.$video.currentTime,
            HEARTBEAT_PLAY_TYPE.PLAYING,
            this.player.$epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
        );
    }

    private onEnded = () => {
        this.player.$cid && this.heartbeat && this.$csrf && heartbeat(
            this.$csrf,
            this.player.$aid,
            this.player.$cid,
            -1,
            HEARTBEAT_PLAY_TYPE.ENDED,
            this.player.$epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
        );
    }
}