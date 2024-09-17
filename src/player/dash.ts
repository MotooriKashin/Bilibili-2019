import DashPlayer, { IDashPlayerOption, IMPDJsonData, IQualityChangeRendered, IQualityChangeRequested, IVideoInfoEvent } from "../dash-player";
import { Video } from "./area/wrap/video";
import { ev, PLAYER_EVENT } from "./event";

/** flv.js播放器内核管理 */
export class DashAgent {

    dashPlayer: DashPlayer;

    constructor(
        video: Video,
        mpd: IMPDJsonData,
        options?: IDashPlayerOption,
        videoQuality = 0,
        seekTime = 0,
    ) {
        ev.trigger(PLAYER_EVENT.VIDEO_DESTORY, void 0);
        this.dashPlayer = new DashPlayer(video, {
            defaultAudioQuality: 30280,
            defaultVideoQuality: 80,
            enableHEVC: false,
            enableAV1: false,
            isAutoPlay: false,
            isDynamic: false,
            enableMultiAudioTracks: false,
            abrStrategy: DashPlayer.STRING.ABR_BOLA,
            stableBufferTime: 20,
            ...options,
        });
        this.dashPlayer.initialize(mpd)
            .then(() => {
                if (videoQuality === 0) {
                    this.dashPlayer?.setAutoSwitchQualityFor('audio', false);
                    this.dashPlayer?.setAutoSwitchQualityFor('video', true);
                }
                seekTime && video.$seek(seekTime);
            });
        ev.one(PLAYER_EVENT.VIDEO_DESTORY, () => {
            ev.unbind(PLAYER_EVENT.QUALITY_SET_FOR, this.setQualityFor);
            this.dashPlayer?.destroy();
        });
        ev.bind(PLAYER_EVENT.QUALITY_SET_FOR, this.setQualityFor);
        this.dashPlayer.on(DashPlayer.EVENTS.QUALITY_CHANGE_REQUESTED, (e: IQualityChangeRequested) => {
            ev.trigger(PLAYER_EVENT.QUALITY_CHANGE_REQUESTED, e);
        });
        this.dashPlayer.on(DashPlayer.EVENTS.QUALITY_CHANGE_RENDERED, (e: IQualityChangeRendered) => {
            ev.trigger(PLAYER_EVENT.QUALITY_CHANGE_RENDERED, e);
        });
        this.dashPlayer.on(DashPlayer.EVENTS.VIDEO_INFO, (e: IVideoInfoEvent) => {
            ev.trigger(PLAYER_EVENT.VIDEO_INFO_DASH, e);
        });
        this.dashPlayer.on(DashPlayer.EVENTS.ERROR, () => {
            ev.trigger(PLAYER_EVENT.MEDIA_ERROR, void 0);
        });

    }

    setQualityFor = ({ detail }: CustomEvent<number>) => {
        if (detail === 0) {
            this.dashPlayer.setAutoSwitchQualityFor('video', true);
        } else {
            this.dashPlayer.setAutoSwitchQualityFor('video', false);
            this.dashPlayer.setQualityFor('video', detail);
        }
    }
}