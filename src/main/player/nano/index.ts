import { BilibiliPlayer } from "..";
import { pgcAppSeason } from "../../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { pugvSeason } from "../../../io/com/bilibili/api/pugv/view/web/season";
import { cards } from "../../../io/com/bilibili/api/x/article/cards";
import { pagelist } from "../../../io/com/bilibili/api/x/player/pagelist";
import { toastr } from "../../../toastr";
import { AV } from "../../../utils/av";
import { ProxyHook } from "../../../utils/hook/Proxy";
import { ChannelKind } from "./ChannelKind";
import { EventType } from "./EventType";
import { FetcherKind } from "./FetcherKind";
import { GroupKind } from "./GroupKind";
import { HandoffKind } from "./HandoffKind";
import { InternalKind } from "./InternalKind";
import { ScreenKind } from "./ScreenKind";

/** nano 播放器兼容 */
export class Nano {

    #player?: BilibiliPlayer;

    #aid = 0;

    #cid = 0;

    #ssid = 0;

    #epid = 0;

    /** nano播放器兼容 */
    ChannelKind = ChannelKind;

    /** nano播放器兼容 */
    EventType = EventType;

    /** nano播放器兼容 */
    FetcherKind = FetcherKind;

    /** nano播放器兼容 */
    GroupKind = GroupKind;

    /** nano播放器兼容 */
    HandoffKind = HandoffKind;

    /** nano播放器兼容 */
    InternalKind = InternalKind;

    /** nano播放器兼容 */
    ScreenKind = ScreenKind;

    /** nano播放器兼容 */
    metadata = {};

    /** nano播放器兼容 */
    #kind = GroupKind.Ugc;

    /** nano播放器兼容 */
    #danmaku = {
        close() { },
        isOpen() { return true }
    };

    /** nano播放器兼容 */
    #mediaElement = document.createElement('div');

    /** nano播放器兼容 */
    #element = new Proxy(<Record<string, HTMLElement>>{}, {
        get: (target) => {
            return this.#mediaElement;
        },
    });

    constructor() {

        ProxyHook.property(self, 'nano', this);
        ProxyHook.property(self, 'EmbedPlayer', this.#EmbedPlayer);
    }

    #identify() {
        this.#player?.identify();
        this.#aid = this.#cid = this.#ssid = this.#epid = 0;
        this.#kind = GroupKind.Ugc;
    }

    /** 2.0 启用入口 */
    #EmbedPlayer = (
        type: string,
        player: any,
        playerParamsArg: string,
        playerType: string,
        upgrade: boolean,
        callbackFn: Function,
        isIframe: boolean,
    ) => {
        this.#identify();
        const bofqi = document.querySelector('#bilibili-player') || document.querySelector('#bofqi');
        if (bofqi) {
            bofqi.replaceWith(this.#player || (this.#player = new BilibiliPlayer()));
            const params = this.searchParams(playerParamsArg || location.search);
            params.aid && (this.#aid = +params.aid);
            params.cid && (this.#cid = +params.cid);
            this.#aid || (params.bvid && (this.#aid = +AV.fromBV(params.bvid)));
            this.#player?.classList.add('screen-wide'); // 默认以宽屏模式启动
            this.connect();
        } else {
            console.error('未找到播放器~');
        }
    }

    /** 3.0 启动入口 */
    createPlayer(initData: NanoInitData, theme?: Record<string, string>) {
        this.#identify();
        initData.kind && (this.#kind = initData.kind);
        initData.aid && (this.#aid = +initData.aid);
        initData.cid && (this.#cid = +initData.cid);
        this.#aid || (initData.bvid && (this.#aid = +AV.fromBV(initData.bvid)));
        if (!this.#aid) {
            const { aid } = this.searchParams();
            aid && (this.#aid = aid.startsWith('BV') ? +AV.fromBV(aid) : +aid); // 诡异的写作 aid 读作 bvid ！
        }
        initData.seasonId && (this.#ssid = +initData.seasonId);
        initData.episodeId && (this.#epid = +initData.episodeId);
        initData.element?.replaceChildren(this.#player || (this.#player = new BilibiliPlayer()));
        this.#player?.classList.add('screen-wide'); // 默认以宽屏模式启动

        return this;
    }

    connect() {
        if (this.#kind === GroupKind.Pugv) {
            if (this.#ssid || this.#epid) {
                pugvSeason(this.#ssid ? { season_id: this.#ssid } : { ep_id: this.#epid })
                    .then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        this.#epid || (this.#epid = data.episodes[0]?.id);
                        const ep = data.episodes.find(d => d.id === this.#epid);
                        if (ep) {
                            this.#aid = ep.aid;
                            this.#cid = ep.cid;
                            navigator.mediaSession.metadata = new MediaMetadata({
                                album: this.#player!.$title = `${data.title}：${isNaN(+ep.title) ? ep.title : `第${ep.title}话`} ${ep.subtitle}`,
                                artist: data.title,
                                artwork: [{
                                    src: ep.cover
                                }],
                                title: ep.title,
                            });
                        }
                        if (this.#epid && this.#cid) {
                            this.#player?.$connect(this.#aid, this.#cid, this.#epid, GroupKind.Pugv);
                        } else {
                            throw new ReferenceError(`cid 无效`, { cause: data });
                        }
                    })
                    .catch(e => {
                        toastr.error('请求课程数据错误~', `ssid: ${this.#ssid}`, `epid: ${this.#epid}`, e);
                        console.error(e);
                    })
            } else {
                toastr.error('播放器不支持的课程类型~').$delay = 0;
            }
        } else if (this.#ssid || this.#epid) {
            pgcAppSeason(this.#ssid ? { season_id: this.#ssid } : { ep_id: this.#epid })
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    this.#ssid || (this.#ssid = data.season_id);
                    this.#epid || (data.user_status.progress?.last_ep_id && (this.#epid = data.user_status.progress?.last_ep_id));
                    data.modules.forEach(d => {
                        switch (d.style) {
                            case "positive":
                            case "section": {
                                this.#epid || (this.#epid = d.data.episodes[0]?.ep_id);
                                if (this.#epid) {
                                    const ep = d.data.episodes.find(d => d.ep_id === this.#epid);
                                    if (ep) {
                                        this.#aid = ep.aid;
                                        this.#cid = ep.cid;
                                        navigator.mediaSession.metadata = new MediaMetadata({
                                            album: this.#player!.$title = `${data.title}：${isNaN(+ep.title) ? ep.title : `第${ep.title}话`} ${ep.long_title}`,
                                            artist: data.title,
                                            artwork: [{
                                                src: ep.cover
                                            }],
                                            title: ep.title,
                                        });
                                    }
                                }
                                break;
                            }
                        }
                    });
                    if (this.#cid && this.#epid) {
                        this.#player?.$connect(this.#aid, this.#cid, this.#epid);
                    } else if (this.#ssid) {
                        toastr.warn('番剧信息里未包含有效分集列表？', '尝试单独获~');
                        pgcSection(this.#ssid)
                            .then(({ code, message, result }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                                const eps = (<IEpisode[]>[]).concat(...(result.main_section?.episodes || []), ...result.section.map(d => d.episodes));
                                const ep = this.#epid ? eps.find(d => d.id === this.#epid) : eps[0];
                                if (ep) {
                                    this.#epid = ep.id;
                                    this.#aid = ep.aid;
                                    this.#cid = ep.cid;
                                    this.#player?.$connect(this.#aid, this.#cid, this.#epid);
                                    navigator.mediaSession.metadata = new MediaMetadata({
                                        album: this.#player!.$title = `${data.title}：${isNaN(+ep.title) ? ep.title : `第${ep.title}话`} ${ep.long_title}`,
                                        artist: data.title,
                                        artwork: [{
                                            src: ep.cover
                                        }],
                                        title: ep.title,
                                    });
                                }
                            })
                            .catch(e => {
                                toastr.error('获取分集列表失败~', e);
                                console.error(e);
                            });
                    } else {
                        throw new ReferenceError(`cid 无效`, { cause: data });
                    }
                })
                .catch(e => {
                    toastr.error('请求 Bangumi 信息错误~', `ssid: ${this.#ssid}`, `epid: ${this.#epid}`, e);
                    console.error(e);
                });
        } else if (this.#aid) {
            Promise.allSettled([cards({ av: this.#aid }), pagelist(this.#aid)])
                .then(([cards, pagelist]) => {
                    const card = cards.status === "fulfilled" && cards.value;
                    const page = pagelist.status === "fulfilled" && pagelist.value;
                    if (page) {
                        const p = Number(new URLSearchParams(location.search).get('p')) || 1;
                        this.#cid = page.data[p - 1].cid;
                    }
                    if (card) {
                        const d = card.data[`av${this.#aid}`];
                        this.#cid || (this.#cid = d.cid);
                        if (d.redirect_url) {
                            const path = d.redirect_url.split('/');
                            /^ep\d+$/i.test(path[5]) && (this.#epid = +path[5].slice(2));
                        }
                        navigator.mediaSession.metadata = new MediaMetadata({
                            album: this.#player!.$title = d.title,
                            artist: d.owner.name,
                            artwork: [{
                                src: d.pic
                            }],
                            title: d.title,
                        });
                    }
                    if (!this.#cid) throw new ReferenceError(`cid 无效`, { cause: [cards, pagelist] });
                    this.#player?.$connect(this.#aid, this.#cid, this.#epid);
                })
                .catch(e => {
                    toastr.error('请求 aid 数据错误~', `aid: ${this.#aid}`, e);
                    console.error(e);
                });
        } else {
            toastr.error('播放器不支持的视频类型~').$delay = 0;
        }
    }

    /** nano播放器兼容 */
    async reload(initData: NanoInitData) {
        this.#identify();
        this.createPlayer(initData);
        this.connect();
    }

    /** 提取启动参数 */
    searchParams(url = location.search) {
        return Object.fromEntries([...new URLSearchParams(url).entries()]);
    }

    /** nano播放器兼容 */
    aspectRatio({ width }: { width: number }) {
        return { width, height: width / 16 * 9 + 68 - (self.innerWidth > 1680 ? 56 : 46) };
    }

    /** nano播放器兼容 */
    getStates() {
        return { mainScreen: ScreenKind.Wide };
    }

    /** nano播放器兼容 */
    setState() { }

    /** nano播放器兼容 */
    setHandoff() { }

    /** nano播放器兼容 */
    on(event: EventType, callback: () => void) {
        switch (event) {
            case EventType.Player_Initialized:
            case EventType.Player_Connected: {
                Promise.resolve().finally(callback)
                break;
            }
        }
    }

    /** nano播放器兼容 */
    off(event: EventType, callback: () => void) { }

    /** nano播放器兼容 */
    fetch(url: string) {
        return Promise.reject(url);
    }

    /** nano播放器兼容 */
    mediaElement() {
        return this.#mediaElement;
    }

    /** nano播放器兼容 */
    isMuted() {
        return this.#player?.$video.muted;
    }

    /** nano播放器兼容 */
    getVolume() {
        return this.#player?.$video.volume;
    }

    /** nano播放器兼容 */
    getDuration() {
        return this.#player?.$video.duration;
    }

    /** nano播放器兼容 */
    play() {
        return Promise.resolve();
    }

    /** nano播放器兼容 */
    pause() { }

    /** nano播放器兼容 */
    getCurrentTime() {
        return this.#player?.$video.currentTime;
    }

    /** nano播放器兼容 */
    getManifest() {
        return Object.create(null);
    }

    /** nano播放器兼容 */
    isInitialized() {
        return true;
    }

    /** nano播放器兼容 */
    getElements() {
        return this.#element;
    }

    /** nano播放器兼容 */
    isPaused() {
        return this.#player?.$video.paused;
    }

    /** nano播放器兼容 */
    getLightOff() {
        return false;
    }
}

interface NanoInitData {
    aid?: number | string;
    cid?: number | string;
    bvid?: string;
    episodeId?: number | string;
    seasonId?: number | string;
    revision?: number
    featureList?: Set<string>,
    enableAV1?: boolean;
    enableWMP?: boolean;
    enableHEVC?: boolean;
    hideBoxShadow?: boolean;
    t?: number;
    kind?: GroupKind;
    element?: HTMLDivElement;
    auxiliary?: HTMLDivElement;
}