import { IDanmaku } from "../../danmaku";
import DashPlayer from "../../dash-player";
import { pgcPlayurl } from "../../io/com/bilibili/api/pgc/player/web/playurl";
import { pgcAppSeason } from "../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { pugvPlayurl } from "../../io/com/bilibili/api/pugv/player/web/playurl";
import { cards } from "../../io/com/bilibili/api/x/article/cards";
import { total } from "../../io/com/bilibili/api/x/player/online/total";
import { pagelist } from "../../io/com/bilibili/api/x/player/pagelist";
import { playurl } from "../../io/com/bilibili/api/x/player/playurl";
import { dmPost } from "../../io/com/bilibili/api/x/v2/dm/post";
import { segSo } from "../../io/com/bilibili/api/x/v2/dm/web/seg.so";
import { view } from "../../io/com/bilibili/api/x/v2/dm/web/view";
import { toviewWeb } from "../../io/com/bilibili/api/x/v2/history/toview/web";
import { DmSegMobileReply } from "../../io/protobuf/DmSegMobileReply";
import { Player } from "../../player";
import { DashAgent } from "../../player/dash";
import { ev, PLAYER_EVENT } from "../../player/event";
import { FlvAgent } from "../../player/flv";
import { toastr } from "../../toastr";
import { AV } from "../../utils/av";
import { cookie } from "../../utils/cookie";
import { customElement } from "../../utils/Decorator/customElement";
import { https } from "../../utils/https";
import { MAIN_EVENT, mainEv } from "../event";
import { mainOptions } from "../option";
import { POLICY } from "../policy";
import { ROUTER } from "../router";
import { Danmaku } from "./danmaku";
import { HeartBeat } from "./heartbeat";
import { GroupKind } from "./nano/GroupKind";
import { Progress } from "./progress";
import { Quality } from "./quality";
import { Recommend } from "./recommend";
import { V2 } from "./v2";

/** 播放器IO核心 */
@customElement(undefined, `bilibili-player-${Date.now()}`)
export class BilibiliPlayer extends Player {

    aid = 0;

    cid = 0;

    ssid = 0;

    epid = 0;

    kind = GroupKind.Ugc;

    // 视频推荐组件
    #recommend = new Recommend(this);

    constructor() {
        super();

        // 心跳组件
        new HeartBeat(this);
        // 画质组件
        new Quality(this);
        // 缩略图组件
        new Progress(this);
        // v2 接口
        new V2(this);
        mainEv.trigger(MAIN_EVENT.OPTINOS_CHANGE, mainOptions);
        ev.bind(PLAYER_EVENT.LOAD_VIDEO_FILE, () => {
            this.aid = this.cid = this.ssid = this.epid = 0;
            this.kind = GroupKind.Ugc;
        });
        ev.bind(PLAYER_EVENT.DANMAKU_INPUT, ({ detail }) => {
            const csrf = cookie.get('bili_jct');
            if (csrf) {
                dmPost({
                    csrf,
                    aid: this.aid,
                    oid: this.cid,
                    ...detail,
                })
                    .then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data, ...detail } });
                    })
                    .catch(e => {
                        toastr.error('发送弹幕失败', e);
                        console.error(e);
                    })
            } else {
                toastr.warn('请先登录！')
            }
        });
        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        this.identify();
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        this.aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        this.aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                if (this.aid) {
                    Promise.allSettled([cards({ av: this.aid }), pagelist(this.aid)])
                        .then(([cards, pagelist]) => {
                            const card = cards.status === "fulfilled" && cards.value;
                            const page = pagelist.status === "fulfilled" && pagelist.value;
                            if (page) {
                                const p = Number(new URLSearchParams(url.search).get('p')) || 1;
                                this.cid = page.data[p - 1].cid;
                            }
                            if (card) {
                                const d = card.data[`av${this.aid}`];
                                this.cid || (this.cid = d.cid);
                                if (d.redirect_url) {
                                    const path = d.redirect_url.split('/');
                                    /^ep\d+$/i.test(path[5]) && (this.epid = +path[5].slice(2));
                                }
                                navigator.mediaSession.metadata = new MediaMetadata({
                                    album: d.title,
                                    artist: d.owner.name,
                                    artwork: [{
                                        src: d.pic
                                    }],
                                    title: d.title,
                                });
                            }
                            if (!this.cid) throw new ReferenceError(`cid 无效`, { cause: [cards, pagelist] });
                            this.$connect();
                            this.#recommend.av();
                        })
                        .catch(e => {
                            toastr.error('请求 aid 数据错误~', `aid: ${this.aid}`, e);
                            console.error(e);
                        });
                } else {
                    toastr.error('识别 aid 信息错误~', `aid: ${this.aid}`);
                }
                break;
            }
            case ROUTER.BANGUMI: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^ss\d+$/i.test(path[3]): {
                        this.ssid = +path[3].slice(2);
                        break;
                    }
                    case /^ep\d+$/i.test(path[3]): {
                        this.epid = +path[3].slice(2);
                        break;
                    }
                }
                if (this.ssid || this.epid) {
                    pgcAppSeason(this.ssid ? { season_id: this.ssid } : { ep_id: this.epid })
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            this.ssid || (this.ssid = data.season_id);
                            this.epid || (data.user_status.progress?.last_ep_id && (this.epid = data.user_status.progress?.last_ep_id));
                            data.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        this.epid || (this.epid = d.data.episodes[0]?.ep_id);
                                        if (this.epid) {
                                            const ep = d.data.episodes.find(d => d.ep_id === this.epid);
                                            if (ep) {
                                                this.aid = ep.aid;
                                                this.cid = ep.cid;
                                            }
                                        }
                                        break;
                                    }
                                }
                            });
                            if (this.cid && this.epid) {
                                this.$connect();
                                this.#recommend.bangumi();
                            } else if (this.ssid) {
                                pgcSection(this.ssid)
                                    .then(({ code, message, result }) => {
                                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                                        const eps = (<IEpisode[]>[]).concat(...(result.main_section?.episodes || []), ...result.section.map(d => d.episodes));
                                        const ep = this.epid ? eps.find(d => d.id === this.epid) : eps[0];
                                        if (ep) {
                                            this.epid = ep.id;
                                            this.aid = ep.aid;
                                            this.cid = ep.cid;
                                            this.$connect();
                                            this.#recommend.bangumi();
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
                            toastr.error('请求 Bangumi 信息错误~', `ssid: ${this.ssid}`, `epid: ${this.epid}`, e);
                            console.error(e);
                        });
                } else {
                    toastr.error('识别 Bangumi 信息错误~', `ssid: ${this.ssid}`, `epid: ${this.epid}`);
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        this.aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        this.aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                const p = +path[2]?.slice(1) || 1;
                toviewWeb()
                    .then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        this.aid || (this.aid = data.list[0].aid);
                        const { cid, redirect_url, pages } = data.list.find(d => d.aid === this.aid) || data.list[0];
                        this.cid = pages[p - 1].cid || cid;
                        if (redirect_url) {
                            const path = redirect_url.split('/');
                            /^ep\d+$/i.test(path[5]) && (this.epid = +path[5].slice(2));
                        }
                        if (!cid) throw new ReferenceError(`cid 无效`, { cause: data });
                        this.$connect();
                        this.#recommend.toview(data.list);
                    })
                    .catch(e => {
                        toastr.error('请求稍后再看信息错误~', e);
                        console.error(e);
                    });
                break;
            }
        }
    }

    /** 请求媒体信息  */
    async $connect(
        aid?: number,
        cid?: number,
        epid?: number,
        kind?: GroupKind,
    ) {
        aid && (this.aid = aid);
        cid && (this.cid = cid);
        epid && (this.epid = epid);
        kind && (this.kind = kind);
        // 请求 playurl
        const qn = +cookie.get('CURRENT_QUALITY') || 0;
        if (this.kind === GroupKind.Pugv && this.epid) {
            pugvPlayurl(this.aid, this.cid, this.epid, qn)
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    data.is_preview && toastr.warn('正在观看预览片段~', '可能需要开通大会员或者付费才能观看全片');
                    this.#attachMedia(data);
                })
                .catch(e => {
                    toastr.error('请求 playurl 数据错误~', e);
                    console.error(e);
                    new FlvAgent(this.$video, { type: 'mp4', url: '//s1.hdslb.com/bfs/static/player/media/error.mp4' });
                })
        } else if (this.epid) {
            pgcPlayurl(this.aid, this.cid, this.epid, qn)
                .then(({ code, message, result }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                    result.is_preview && toastr.warn('正在观看预览片段~', '可能需要开通大会员或者付费才能观看全片');
                    this.#attachMedia(result);
                })
                .catch(e => {
                    toastr.error('请求 playurl 数据错误~', e);
                    console.error(e);
                    new FlvAgent(this.$video, { type: 'mp4', url: '//s1.hdslb.com/bfs/static/player/media/error.mp4' });
                });
        } else {
            playurl(this.aid, this.cid, qn)
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    this.#attachMedia(data);
                })
                .catch(e => {
                    toastr.error('请求 playurl 数据错误~', e);
                    console.error(e);
                    new FlvAgent(this.$video, { type: 'mp4', url: '//s1.hdslb.com/bfs/static/player/media/error.mp4' });
                });
        }
        // 请求弹幕
        const d = await view(this.cid, this.aid);
        if (d.dmSge) {
            const { total } = d.dmSge;
            for (let i = 1; i <= total; i++) {
                segSo(this.cid, this.aid, i)
                    .then(d => {
                        this.addDanmaku(d.elems);
                    })
                    .catch(() => { })
            }
        }
        // 获取弹幕弹幕专包
        d?.specialDms?.forEach(d => {
            fetch(https(d)) // 此处不能携带cookie
                .then(d => d.arrayBuffer())
                .then(d => DmSegMobileReply.decode(d))
                .then(d => {
                    this.addDanmaku(d.elems);
                })
                .catch(() => { })
        });
        // 实时弹幕
        new Danmaku(this, [`video://${this.aid}/${this.cid}${this.ssid ? `?sid=${this.ssid}&epid=${this.epid}` : ''}`]);
        // 观看人数
        total(this.aid, this.cid)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                ev.trigger(PLAYER_EVENT.ONLINE_NUMBER, data);
            })
            .catch(e => {
                console.error('更新在线人数失败', e);
            });
        mainEv.trigger(MAIN_EVENT.CONNECT, void 0);
        // TODO: 指令弹幕
    }

    /** 启动视频播放 */
    #attachMedia = (
        result: Awaited<ReturnType<typeof pgcPlayurl>>['result'] | Awaited<ReturnType<typeof playurl>>['data'] | Awaited<ReturnType<typeof pugvPlayurl>>['data'],
        seekTime?: number,
    ) => {
        const qn = +cookie.get('CURRENT_QUALITY') || 0;
        if (result.dash) {
            /** Hires或者杜比全景声 */
            const defaultAudioQuality = Number(result.dash.audio?.[0]?.id) || 30280;
            const highAudioQuality = result.dash.flac?.audio?.id;
            new DashAgent(this.$video, result.dash, {
                defaultAudioQuality: highAudioQuality || defaultAudioQuality,
                defaultVideoQuality: result.dash.video.find(d => d.id === qn) ? qn : result.dash.video[0].id, // DASH 播放器碧油鸡，可获得的qn才能使播放策略正常生效
                enableHEVC: mainOptions.policy === POLICY.HEVC,
                enableAV1: mainOptions.policy === POLICY.AV1,
                isAutoPlay: false,
                isDynamic: false,
                enableMultiAudioTracks: false,
                abrStrategy: DashPlayer.STRING.ABR_BOLA,
                stableBufferTime: 20,
                // DRM fields
                // protectionDataSet: d.protection?.protectionData,
                // ignoreEmeEncryptedEvent:d.protection?.ignoreEmeEncryptedEvent
            }, qn, seekTime);
            this.$area.$control.$quality.update(result.accept_quality.map((s, i) => { return <[number, string]>[s, result.accept_description[i]] }).reverse());
            qn && (this.$area.$control.$quality.$value = result.quality);
        } else if (result.durl) {
            let seekType = 'range';
            let duration = 0;
            const type = result.format.indexOf('mp4') > -1 ? 'mp4' : 'flv';
            new FlvAgent(this.$video, type === "mp4" ? {
                type,
                url: result.durl[0].url,
            } : {
                segments: result.durl.map(d => {
                    d.length && (duration = d.length);
                    /\/ws\.acgvideo\.com\//.test(d.url) && (seekType = 'param');
                    return {
                        duration: d.length,
                        filesize: d.size,
                        url: d.url,
                        backupURL: d.backup_url
                    }
                }),
                type,
                duration,
            }, {
                enableWorker: false,
                stashInitialSize: 1024 * 64,
                accurateSeek: true,
                seekType: <'range'>seekType,
                rangeLoadZeroStart: false,
                lazyLoadMaxDuration: 100,
                lazyLoadRecoverDuration: 50,
                deferLoadAfterSourceOpen: false,
                fixAudioTimestampGap: false,
                reuseRedirectedURL: true,
            }, seekTime);
            this.$area.$control.$quality.update(result.accept_quality.map((s, i) => { return <[number, string]>[s, result.accept_description[i]] }).reverse());
            qn && (this.$area.$control.$quality.$value = result.quality);
        } else {
            throw new ReferenceError('未获取到任何播放数据', { cause: result });
        }
        mainEv.trigger(MAIN_EVENT.PLAYURL, result);
    }

    /** 添加弹幕 */
    addDanmaku(dms: IDanmaku[]) {
        this.$danmaku.$add(dms);
    }

    /**
     * 更新播放源
     * 
     * @param qn 指定画质，用于画质切换
     * @param success 成功获取对应画质的回调
     * @param fail 获取对应画质失败回调
     */
    updateSource(qn?: number, success?: Function, fail?: Function) {
        if (this.kind === GroupKind.Pugv && this.epid) {
            pugvPlayurl(this.aid, this.cid, this.epid, qn)
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result: data } });
                    this.#attachMedia(data, this.$video.currentTime);
                    if (data.quality === qn) {
                        success?.();
                    } else if (qn !== undefined) {
                        fail?.();
                    } else {
                        success?.();
                    }
                })
                .catch(e => {
                    toastr.error('请求更新画质失败~', e)
                    fail?.();
                });
        } else if (this.epid) {
            pgcPlayurl(this.aid, this.cid, this.epid, qn)
                .then(({ code, message, result }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                    this.#attachMedia(result, this.$video.currentTime);
                    if (result.quality === qn) {
                        success?.();
                    } else if (qn !== undefined) {
                        fail?.();
                    } else {
                        success?.();
                    }
                })
                .catch(e => {
                    toastr.error('请求更新画质失败~', e)
                    fail?.();
                });
        } else {
            playurl(this.aid, this.cid, qn)
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result: data } });
                    this.#attachMedia(data, this.$video.currentTime);
                    if (data.quality === qn) {
                        success?.();
                    } else if (qn !== undefined) {
                        fail?.();
                    } else {
                        success?.();
                    }
                })
                .catch(e => {
                    toastr.error('请求更新画质失败~', e)
                    fail?.();
                });
        }
    }

    /** 重置媒体信息 */
    identify() {
        this.aid = this.cid = this.ssid = this.epid = 0;
        this.kind = GroupKind.Ugc;
        super.identify();
        mainEv.trigger(MAIN_EVENT.IDENTIFY, void 0);
        ev.trigger(PLAYER_EVENT.CALL_NEXT_REGISTER, void 0);
    }
}