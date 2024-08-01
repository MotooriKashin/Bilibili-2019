import { IDanmaku } from "../../../danmaku";
import DashPlayer from "../../../dash-player";
import { pgcPlayurl } from "../../../io/com/bilibili/api/pgc/player/web/playurl";
import { recommend } from "../../../io/com/bilibili/api/pgc/season/web/related/recommend";
import { pgcAppSeason } from "../../../io/com/bilibili/api/pgc/view/v2/app/season";
import { pugvPlayurl } from "../../../io/com/bilibili/api/pugv/player/web/playurl";
import { HEARTBEAT_PLAY_TYPE, HEARTBEAT_TYPE, heartbeat } from "../../../io/com/bilibili/api/x/click-interface/web/heartbeat";
import { total } from "../../../io/com/bilibili/api/x/player/online/total";
import { pagelist } from "../../../io/com/bilibili/api/x/player/pagelist";
import { playurl } from "../../../io/com/bilibili/api/x/player/playurl";
import { IViewPoint, v2 } from "../../../io/com/bilibili/api/x/player/v2";
import { videoshot } from "../../../io/com/bilibili/api/x/player/videoshot";
import { segSo } from "../../../io/com/bilibili/api/x/v2/dm/web/seg.so";
import { view } from "../../../io/com/bilibili/api/x/v2/dm/web/view";
import { toviewWeb } from "../../../io/com/bilibili/api/x/v2/history/toview/web";
import { favResourceList } from "../../../io/com/bilibili/api/x/v3/fav/resource/list";
import { related } from "../../../io/com/bilibili/api/x/web-interface/archive/related";
import { detail } from "../../../io/com/bilibili/api/x/web-interface/view/detail";
import { DmSegMobileReply } from "../../../io/protobuf/DmSegMobileReply";
import { QUALITY_DESCRIBE } from "../../../io/quality";
import { Player } from "../../../player";
import { video } from "../../../player/area/wrap/video";
import { IRecommend } from "../../../player/auxiliary/recommend";
import { PLAYER_EVENT, ev } from "../../../player/event-target";
import { options } from "../../../player/option";
import { POLICY } from "../../../player/policy";
import { customElement } from "../../../utils/Decorator/customElement";
import { cookie } from "../../../utils/cookie";
import { https } from "../../../utils/https";
import { ClosedCaption } from "./closed-caption";
import { RealTime } from "./danmaku/real-time";
import { GroupKind } from "./nano/GroupKind";
import { Part } from "./part";

@customElement('figure')
export class BilibiliPlayer extends Player {

    /**
     * 需要监听变动的属性。
     * 与实例方法`attributeChangedCallback`配合使用。
     * 此字符串序列定义了`attributeChangedCallback`回调时的第一个参数的可能值。
     */
    // static observedAttributes = [];

    /**
     * 在属性更改、添加、移除或替换时调用。
     * 需要与静态属性`observedAttributes`配合使用。
     * 此回调的第一个参数在`observedAttributes`数组中定义。
     */
    // attributeChangedCallback(name: IobservedAttributes, oldValue: string, newValue: string) {}

    /** 每当元素添加到文档中时调用。 */
    connectedCallback() {
        this.insertAdjacentElement('beforebegin', this.#part);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.#part.remove();
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    aid = 0;

    cid = 0;

    ssid = 0;

    epid = 0;

    /** 默认清晰度 */
    qn = 0;

    /** 实际的视频清晰度（实时更新） */
    videoRealQuality = 0;

    /** 正在更新画质，延时：/s */
    updateSourceing = 0;

    /** 允许心跳 */
    heartbeat = true;

    /** 允许seek心跳 */
    heartbeatSeek = false;

    #part = new Part();

    /** 缩略图信息 */
    pvData?: Awaited<ReturnType<typeof videoshot>>;

    /** 视频看点 */
    viewPoints?: IViewPoint[];

    playurl?: Awaited<ReturnType<typeof pgcPlayurl>> | Awaited<ReturnType<typeof playurl>> | Awaited<ReturnType<typeof pugvPlayurl>>;

    dmView?: Awaited<ReturnType<typeof view>>;

    realDm = new RealTime(this);

    /** 在线数据延时请求句柄 */
    onlineTimer?: number;

    /**
     * buffer 策略
     * | 0 | 1 | 2 | 3 | 4 | 5 |
     * | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 初始 buffer 长度 | 变更 buffer 时间(s) | 中间 buffer 长度 | 变更 buffer 时间(s) | 最终 buffer 长度 | 向前保留长度 |
     */
    get dynamicBuffer() {
        if (this.videoRealQuality >= 120) {
            // 4K 以上用 buffer 长度
            return [20, 5, 25, 20, 30, 10];
        }
        return [20, 5, 40, 20, 70, 20];
    }

    #csrf = '';

    get $csrf() {
        return this.#csrf || (this.#csrf = cookie.get('bili_jct'))
    }

    constructor() {
        super();

        this.insertAdjacentHTML('beforeend', `<style>${__BILI_PLAYER_STYLE__}</style>`);


        video.addEventListener('progress', () => {
            // buffer policy
            // http://info.bilibili.co/pages/viewpage.action?pageId=12877158
            if (this.dashPlayer) {
                const { currentTime } = video
                const dynamicBufferArray = this.dynamicBuffer;
                if (this.dashPlayer.getStableBufferTime() < dynamicBufferArray[4]) {
                    if (currentTime > dynamicBufferArray[3]) {
                        this.dashPlayer.setStableBufferTime(dynamicBufferArray[4]);
                        this.dashPlayer.getCorePlayer().setBufferToKeep(dynamicBufferArray[5]);
                    } else if (currentTime > dynamicBufferArray[1] && this.dashPlayer.getStableBufferTime() < dynamicBufferArray[2]) {
                        this.dashPlayer.setStableBufferTime(dynamicBufferArray[2]);
                        this.dashPlayer.getCorePlayer().setBufferToKeep(dynamicBufferArray[5]);
                    }
                }
            }
        });
        video.addEventListener('play', () => {
            this.heartbeatSeek = true;
            this.heartbeat && this.$csrf && heartbeat(
                this.$csrf,
                this.aid,
                this.cid,
                video.currentTime,
                HEARTBEAT_PLAY_TYPE.CONTINUE,
                this.epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
            )
        });
        video.addEventListener('pause', () => {
            this.heartbeat && this.$csrf && heartbeat(
                this.$csrf,
                this.aid,
                this.cid,
                video.currentTime,
                HEARTBEAT_PLAY_TYPE.PAUSE,
                this.epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
            )
        });
        video.addEventListener('seeking', () => {
            this.heartbeat && this.heartbeatSeek && this.$csrf && heartbeat(
                this.$csrf,
                this.aid,
                this.cid,
                video.currentTime,
                HEARTBEAT_PLAY_TYPE.START,
                this.epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
            )
        });
        video.addEventListener('seeked', () => {
            this.heartbeat && this.heartbeatSeek && this.$csrf && heartbeat(
                this.$csrf,
                this.aid,
                this.cid,
                video.currentTime,
                HEARTBEAT_PLAY_TYPE.PLAYING,
                this.epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
            )
        });
        video.addEventListener('ended', () => {
            this.heartbeat && this.$csrf && heartbeat(
                this.$csrf,
                this.aid,
                this.cid,
                -1,
                HEARTBEAT_PLAY_TYPE.ENDED,
                this.epid ? HEARTBEAT_TYPE.BANGUMI : HEARTBEAT_TYPE.AV
            )
        });

        ev.bind(PLAYER_EVENT.MEDIA_ERROR, () => {
            if (!this.updateSourceing) {
                const updateSource = () => {
                    this.updateSource(undefined, () => {
                        this.updateSourceing = 0;
                        ev.trigger(PLAYER_EVENT.TOAST, '重新连接至服务器成功');
                    }, () => {
                        this.updateSourceing < 30e3 && (this.updateSourceing += 3e3);
                        setTimeout(updateSource, this.updateSourceing);
                        ev.trigger(PLAYER_EVENT.TOAST, '重新连接服务器失败');
                    })
                }
                updateSource();
                this.updateSourceing += 3e3;
            }
        });
        ev.bind(PLAYER_EVENT.QUALITY_CHANGE, ({ detail }) => {
            cookie.set('CURRENT_QUALITY', this.qn = detail);
            if (detail === 0) {
                // 自动画质无须切换
                this.setQualityFor(detail);
                ev.trigger(PLAYER_EVENT.TOAST, `已经切换至${QUALITY_DESCRIBE[detail]}画质`);
            } else {
                if (this.playurl?.dash?.video.find(d => d.id === detail)) {
                    // 无需联网请求的DASH画质
                    this.setQualityFor(detail);
                    ev.trigger(PLAYER_EVENT.TOAST, `已经切换至${QUALITY_DESCRIBE[detail]}画质`);
                } else {
                    ev.trigger(PLAYER_EVENT.TOAST, `正在为您切换到${QUALITY_DESCRIBE[detail]}画质,请稍候...`);
                    this.updateSource(detail, () => {
                        ev.trigger(PLAYER_EVENT.TOAST, `已经切换至${QUALITY_DESCRIBE[detail]}画质`);
                        this.setQualityFor(detail);
                    }, () => {
                        ev.trigger(PLAYER_EVENT.TOAST, `切换画质失败，已回滚~`);
                    })
                }
            }
        });
        ev.bind(PLAYER_EVENT.QUALITY_CHANGE_RENDERED, ({ detail }) => {
            if (detail.mediaType === 'video') {
                this.videoRealQuality = detail.newQualityNumber;
            }
        });
        ev.bind(PLAYER_EVENT.LOCAL_MEDIA_LOAD, () => {
            this.heartbeat = false;
        });
        ev.bind(PLAYER_EVENT.DANMAKU_ADD, () => {
            clearTimeout(this.onlineTimer);
            this.onlineTimer = setTimeout(() => {
                total(this.aid, this.cid)
                    .then(({ count }) => {
                        this.$auxiliary.$info.$number.$count = <any>count;
                    });
            }, 1e3);
        });
        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { incognito } = detail.player;
            this.heartbeat = !incognito;
        });
        ev.bind(PLAYER_EVENT.PROGRESS_VIDEOSHOT, ({ detail }) => {
            this.progressVideoshot(...detail);
        });
        ev.bind(PLAYER_EVENT.CALL_NEXT_PAGE, ({ detail }) => {
            navigation?.navigate(detail);
        });
    }

    connect(
        aid: number,
        cid: number,
        ssid?: number,
        epid?: number,
        force = false,
        kind?: GroupKind,
    ) {
        if (this.cid !== cid || force) {
            this.identify();
            Reflect.set(self, 'aid', this.aid = aid);
            Reflect.set(self, 'cid', this.cid = cid);
            ssid && (this.ssid = ssid);
            epid && (this.epid = epid);
            this.qn = +cookie.get('CURRENT_QUALITY') || 0;
            if (kind === GroupKind.Pugv && epid) {
                pugvPlayurl(aid, cid, epid, this.qn)
                    .then(d => {
                        this.attachMedia(d);
                        d.is_preview && ev.trigger(PLAYER_EVENT.TOAST, '正在观看预览');
                    })
                    .finally(() => {
                        video.addEventListener('canplay', () => {
                            this.getDanmaku();
                            this.getUser();
                            this.getVideoShot();
                        }, { once: true });
                    });
            } else if (epid) {
                pgcPlayurl(aid, cid, epid, this.qn).then(d => {
                    this.attachMedia(d);
                    d.record_info?.record && this.$area.$wrap.$record.addRecord(d.record_info.record);
                    d.is_preview && ev.trigger(PLAYER_EVENT.TOAST, '正在观看预览');
                }).finally(() => {
                    video.addEventListener('canplay', () => {
                        this.getDanmaku();
                        this.getUser();
                        this.getVideoShot();
                    }, { once: true });
                });
            } else {
                playurl(aid, cid, this.qn)
                    .then(this.attachMedia)
                    .finally(() => {
                        video.addEventListener('canplay', () => {
                            this.getDanmaku();
                            this.getUser();
                            this.getVideoShot();
                        }, { once: true });
                    });
            }
        }
    }

    private attachMedia = (
        d: Awaited<ReturnType<typeof pgcPlayurl>> | Awaited<ReturnType<typeof playurl>> | Awaited<ReturnType<typeof pugvPlayurl>>,
        seekTime?: number,
    ) => {
        if (d) {
            this.videoRealQuality = d.quality;
            this.playurl = d;
            if (d.dash) {
                /** Hires或者杜比全景声 */
                const defaultAudioQuality = Number(d.dash.audio?.[0]?.id) || 30280;
                const highAudioQuality = d.dash.flac?.audio?.id;
                this.dashjs(d.dash, {
                    defaultAudioQuality: highAudioQuality || defaultAudioQuality,
                    defaultVideoQuality: this.qn,
                    enableHEVC: options.player.policy === POLICY.HEVC,
                    enableAV1: options.player.policy === POLICY.AV1,
                    isAutoPlay: false,
                    isDynamic: false,
                    enableMultiAudioTracks: false,
                    abrStrategy: DashPlayer.STRING.ABR_BOLA,
                    stableBufferTime: this.dynamicBuffer[0] || 20,
                    // DRM fields
                    // protectionDataSet: d.protection?.protectionData,
                    // ignoreEmeEncryptedEvent:d.protection?.ignoreEmeEncryptedEvent
                }, this.qn, seekTime);
            } else {
                let seekType = 'range';
                let duration = 0;
                const type = d.format.indexOf('mp4') > -1 ? 'mp4' : 'flv'
                this.flvjs(d.durl ? type === "mp4" ? {
                    type,
                    url: d.durl[0].url,
                } : {
                    segments: d.durl.map(d => {
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
                } : {
                    type: 'mp4',
                    url: '//s1.hdslb.com/bfs/static/player/media/error.mp4',
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
            }
            this.$area.$control.$quality.update(d.accept_quality.map((s, i) => { return <[number, string]>[s, d.accept_description[i]] }).reverse());
            this.qn && (this.$area.$control.$quality.$value = d.quality);
        } else {
            this.flvjs({
                type: 'mp4',
                url: '//s1.hdslb.com/bfs/static/player/media/error.mp4',
            });
        }
    }

    private async getDanmaku() {
        this.realDm.getSevers();
        const d = this.dmView = await view(this.cid, this.aid);
        if (d.dmSge) {
            const { total } = d.dmSge;
            for (let i = 1; i <= total; i++) {
                segSo(this.cid, this.aid, i)
                    .then(d => {
                        this.danmaku.add(d.elems);
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
                    this.danmaku.add(d.elems);
                })
                .catch(() => { })
        });
        // TODO: 指令弹幕
    }

    addDanmaku(dms: IDanmaku[]) {
        this.danmaku.add(dms);
    }

    setOnline(num: number) {
        this.$auxiliary.$info.$number.$count = num;
    }

    /**
     * 更新播放源
     * 
     * @param qn 指定画质，用于画质切换
     * @param success 成功获取对应画质的回调
     * @param fail 获取对应画质失败回调
     */
    updateSource(qn?: number, success?: Function, fail?: Function) {
        const ajax = this.epid ? pgcPlayurl(this.aid, this.cid, this.epid, this.qn) : playurl(this.aid, this.cid, this.qn);
        ajax.then(d => {
            if (d) {
                this.playurl = d;
                if (d.dash && this.dashPlayer) {
                    this.dashPlayer.updateSource(d.dash!);
                    if (qn === 0) {
                        this.dashPlayer.setAutoSwitchQualityFor('video', true);
                        success?.();
                    } else if (d.quality === qn) {
                        this.dashPlayer.setAutoSwitchQualityFor('video', false);
                        this.dashPlayer.setQualityFor('video', qn);
                        success?.();
                    } else if (qn !== undefined) {
                        fail?.();
                    } else {
                        success?.();
                    }
                } else {
                    this.attachMedia(d, video.currentTime);
                    if (d.quality === qn) {
                        success?.();
                    } else if (qn !== undefined) {
                        fail?.();
                    } else {
                        success?.();
                    }
                }
                this.$area.$control.$quality.update(d.accept_quality.map((s, i) => { return <[number, string]>[s, d.accept_description[i]] }).reverse());
                this.qn && (this.$area.$control.$quality.$value = d.quality);
            } else {
                fail?.();
            }
        }).catch(() => {
            fail?.();
        })
    }

    /** 选择画质 */
    setQualityFor(qn = 0) {
        if (qn === 0) {
            this.dashPlayer?.setAutoSwitchQualityFor('video', true);
        } else {
            this.dashPlayer?.setAutoSwitchQualityFor('video', false);
            this.dashPlayer?.setQualityFor('video', qn);
        }
        this.$area.$control.$quality.$value = qn;
    }

    /** 获取视频缩略图 */
    private async getVideoShot() {
        this.pvData = await videoshot(this.cid, this.aid);
    }

    /**
     * 实时更新缩略图
     * 
     * @param element 缩略图所在节点
     * @param value 缩略图对应的时间
     */
    private progressVideoshot(element: HTMLElement, value: number) {
        if (this.pvData) {
            const {
                pv_index,
                pv_img,
                pv_x_len = 10,
                pv_y_len = 10,
                pv_x_size = 160,
                pv_y_size = 90,
            } = this.pvData;
            if (pv_index && pv_img) {
                const p = pv_index.findIndex((d, i) => value >= pv_index[i - 1] && value < d);
                if (p >= 0 && pv_img[Math.floor(p / 100)]) {
                    element.style.inlineSize = pv_x_size + 'px';
                    element.style.blockSize = pv_y_size + 'px';
                    element.style.transform = `scale(${160 / pv_x_size})`;
                    element.style.transformOrigin = 'bottom';
                    element.style.backgroundImage = `url(${pv_img[Math.floor(p / 100)]})`;
                    element.style.backgroundPosition = pv_x_size * -(p % 100 % pv_x_len) + "px " + pv_y_size * -Math.floor(p % 100 / pv_y_len) + "px";

                }
            }
            if (this.viewPoints) {
                const d = this.viewPoints.find(d => d.from <= value && d.to > value);
                element.textContent = d ? d.content : '';
            }
        }
    }

    /** 获取用户数据 */
    private async getUser() {
        const user = await v2(this.cid, this.aid, this.ssid);
        if (user.subtitle) {
            user.subtitle.subtitles.forEach(d => {
                fetch(https(d.subtitle_url))
                    .then(e => e.json())
                    .then(f => {
                        const cc = new ClosedCaption();
                        cc.addCue(...f.body);
                        const file = new File([cc.toWebVTT().toJSON()], `${d.lan_doc}.vtt`);
                        this.$area.$control.$closedCaption.load(file);
                    })
            });
        }
        user.view_points && (this.viewPoints = user.view_points);
        // 视频看点
        // 高级弹幕、代码弹幕、BAS弹幕发送面板
        // 功能窗口
        // 历史弹幕
        // 指令弹幕
        // TODO：杜比全景声，等待vip和设备支持
        this.$area.$wrap.$panel.userLoad();
    }

    getRelated(items?: IRecommend[]) {
        if (items) {
            this.$auxiliary.$recommend.add(items);
        } else if (this.ssid) {
            recommend(this.ssid).then(d => {
                this.$auxiliary.$recommend.add(d.map(d => {
                    return {
                        src: d.cover + '@.webp',
                        title: d.title,
                        view: d.stat.view,
                        danmaku: d.stat.danmaku,
                        callback() {
                            navigation?.navigate(d.url);
                        },
                    }
                }));
            })
        } else {
            related(this.aid).then(d => {
                this.$auxiliary.$recommend.add(d.map(d => {
                    return {
                        src: d.pic + '@.webp',
                        title: d.title,
                        duration: d.duration,
                        view: d.stat.view,
                        danmaku: d.stat.danmaku,
                        author: d.owner.name,
                        callback() {
                            navigation?.navigate(`/video/av${d.aid}`);
                        },
                    }
                }));
            });
        }
    }

    /**
     * av页分p管理
     * 
     * @param page 分P数据
     * @param toview 是否稍后再看页面
     */
    partAv(page: Awaited<ReturnType<typeof pagelist>>) {
        this.$area.$control.$next.update(page.map((d, i) => `/video/av${this.aid}?p=${i + 1}`), page.findIndex(d => d.cid === this.cid) || 0);
        this.#part.update(page, this.aid, this.cid);
    }

    /**
     * Bangumi分p管理
     * 
     * @param page Bangumi数据
     */
    async partBangumi(page: Awaited<ReturnType<typeof pgcAppSeason>>) {
        page.modules.forEach(d => {
            switch (d.style) {
                case "positive": {
                    this.$area.$control.$next.update(d.data.episodes.map(d => `/bangumi/play/ep${d.ep_id}`), d.data.episodes.findIndex(d => d.cid === this.cid) || 0);
                    break;
                }
            }
        });

        if (page.bkg_cover) {
            this.style.backgroundImage = `url(${https(page.bkg_cover)}@.webp)`;
            this.style.backgroundSize = `cover`;
        }
    }

    /**
     * 合集分P管理
     * 
     * @param page 合集数据
     */
    partUgcSeason(page: Awaited<ReturnType<typeof detail>>) {
        if (page.View.ugc_season) {
            this.$auxiliary.$recommend.add(page.View.ugc_season.sections[0].episodes.map(d => {
                return {
                    src: d.arc.pic + '@.webp',
                    title: d.title,
                    duration: d.arc.duration,
                    view: d.arc.stat.view,
                    danmaku: d.arc.stat.danmaku,
                    callback() {
                        navigation?.navigate(`/video/av${d.aid}`);
                    },
                    selected: d.cid === this.cid,
                }
            }));
            this.$auxiliary.$filter.$recommend.textContent = '视频合集';
        }
    }

    /** 稍后再看分P管理 */
    partToView(page: Awaited<ReturnType<typeof toviewWeb>>, part?: Awaited<ReturnType<typeof pagelist>>) {
        const ids: string[] = [];
        let ci = 0;
        this.$auxiliary.$recommend.add(page.map(d => {
            if (d.videos === 1) {
                d.aid === this.aid && (ci = ids.length);
                ids.push(`/watchlater/#/av${d.aid}`);
            } else {
                d.pages.forEach(e => {
                    e.cid === this.cid && (ci = ids.length);
                    ids.push(`/watchlater/#/av${d.aid}/p${e.page}`);
                });
            }
            return {
                src: d.pic + '@.webp',
                title: d.title,
                duration: d.duration,
                view: d.stat.view,
                danmaku: d.stat.danmaku,
                callback() {
                    navigation?.navigate(`/watchlater/#/av${d.aid}`);
                },
                selected: d.aid === this.aid,
            }
        }));
        this.$auxiliary.$filter.$recommend.textContent = '稍后再看';
        part && this.#part.updateToview(part, this.aid, this.cid);
        this.$area.$control.$next.update(ids, ci);
    }

    /** 播放列表分P管理 */
    partMedialist(page: Awaited<ReturnType<typeof favResourceList>>['medias'], part?: Awaited<ReturnType<typeof pagelist>>) {
        const ids: string[] = [];
        let ci = 0;
        this.$auxiliary.$recommend.add(page.map(d => {
            d.id === this.aid && (ci = ids.length);
            if (d.page === 1) {
                const url = new URL(location.href);
                url.searchParams.set('aid', <any>d.id);
                ids.push(url.href);
            } else {
                // 暂时没有分p列表
                for (let i = 0; i > d.page; i++) {
                    const url = new URL(location.href);
                    url.searchParams.set('aid', <any>d.id);
                    url.searchParams.set('p', <any>i + 1);
                    ids.push(url.href);
                }
            }
            return {
                src: d.cover + '@.webp',
                title: d.title,
                duration: d.duration,
                view: d.cnt_info.play,
                danmaku: d.cnt_info.danmaku,
                callback() {
                    const url = new URL(location.href);
                    url.searchParams.set('aid', <any>d.id)
                    navigation?.navigate(url.href);
                },
                selected: d.id === this.aid,
            }
        }));
        this.$auxiliary.$filter.$recommend.textContent = '播放列表';
        part && this.#part.updateMedialist(part, this.aid, this.cid);
        this.$area.$control.$next.update(ids, ci);
    }

    identify = () => {
        this.aid = 0;
        this.cid = 0;
        this.ssid = 0;
        this.epid = 0;
        this.heartbeat = !options.player.incognito;
        this.heartbeatSeek = false;
        delete this.playurl;
        delete this.pvData;
        delete this.dmView;
        delete this.viewPoints;
        super.identify();
        this.#part.identify();
        this.realDm.identify();
        this.style.backgroundImage = '';
        this.style.backgroundSize = '';
        this.$auxiliary.$filter.$recommend.textContent = '推荐视频';
    }
}

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_PLAYER_STYLE__: string;
}