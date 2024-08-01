import { season } from "../../io/com/bilibili/api/pgc/view/web/season";
import { pugvSeason } from "../../io/com/bilibili/api/pugv/view/web/season";
import { cards } from "../../io/com/bilibili/api/x/article/cards";
import { pagelist } from "../../io/com/bilibili/api/x/player/pagelist";
import { toviewWeb } from "../../io/com/bilibili/api/x/v2/history/toview/web";
import { favResourceList } from "../../io/com/bilibili/api/x/v3/fav/resource/list";
import { detail } from "../../io/com/bilibili/api/x/web-interface/view/detail";
import { video } from "../../player/area/wrap/video";
import { ev, PLAYER_EVENT } from "../../player/event-target";
import { PLAYER_MODE, PLAYER_STATE } from "../../player/state";
import { AV } from "../../utils/av";
import { ProxyHook } from "../../utils/hook/Proxy";
import { Comment } from "./comment";
import { InitComment } from "./comment/initComment";
import { Desc } from "./desc";
import { Footer } from "./footer";
import { Header } from "./header";
import { BiliHeader } from "./header/BiliHeader";
import { Home } from "./home";
import { Html } from "./html";
import { Info } from "./info";
import { BilibiliPlayer } from "./player";
import { NanoInitData } from "./player/nano";
import { ChannelKind } from "./player/nano/ChannelKind";
import { EventType } from "./player/nano/EventType";
import { FetcherKind } from "./player/nano/FetcherKind";
import { GroupKind } from "./player/nano/GroupKind";
import { HandoffKind } from "./player/nano/HandoffKind";
import { InternalKind } from "./player/nano/InternalKind";
import { ScreenKind } from "./player/nano/ScreenKind";

/** Bilibili SPA 路由守护 */
export class Router {

    aid = 0;

    cid = 0;

    ssid = 0;

    epid = 0;

    #header?: Header;

    /** 顶栏 */
    private get $header() {
        return this.#header || (this.#header = new Header());
    }

    #info?: Info;

    /** 视频信息 */
    private get $info() {
        return this.#info || (this.#info = new Info());
    }

    #player?: BilibiliPlayer;


    /** 播放器组件 */
    private get $player() {
        return this.#player || (this.#player = new BilibiliPlayer());
    }

    #desc?: Desc;

    /** 视频信息 */
    private get $desc() {
        return this.#desc || (this.#desc = new Desc());
    }

    #comment?: Comment;

    /** 评论区 */
    private get $comment() {
        return this.#comment || (this.#comment = new Comment(), this.#comment.classList.add('bili-wrapper'), this.#comment);
    }

    #footer?: Footer;

    /** 底栏 */
    private get $footer() {
        return this.#footer || (this.#footer = new Footer());
    }

    #home?: Home;

    /** 视频信息 */
    private get $home() {
        return this.#home || (this.#home = new Home());
    }

    /** nano播放器兼容 */
    #p_router?: ROUTER;

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
    danmaku = {
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
        switch (location.hostname) {
            case 'www.bilibili.com': {
                switch (true) {
                    case /^\/video\/av\d+\/?$/i.test(location.pathname):
                    case /^\/video\/bv1[a-z0-9]{9}\/?$/i.test(location.pathname): {
                        document.documentElement.replaceWith(new Html());
                        this.navigate(ROUTER.AV, location);
                        break;
                    }
                    case /^\/bangumi\/play\/ss\d+\/?$/i.test(location.pathname):
                    case /^\/bangumi\/play\/ep\d+\/?$/i.test(location.pathname): {
                        document.documentElement.replaceWith(new Html());
                        this.navigate(ROUTER.BANGUMI, location);
                        break;
                    }
                    case location.pathname === '/':
                    case location.pathname === '/index.html': {
                        document.documentElement.replaceWith(new Html());
                        this.navigate(ROUTER.HOME, location);
                        break;
                    }
                    case location.pathname === '/watchlater/':
                    case location.pathname === '/medialist/play/watchlater':
                    case location.pathname === '/list/watchlater': {
                        if (location.hash === '#/list') break;
                        document.documentElement.replaceWith(new Html());
                        this.navigate(ROUTER.TOVIEW, location);
                        break;
                    }
                    case /^\/list\/ml\d+\/?$/i.test(location.pathname): {
                        document.documentElement.replaceWith(new Html());
                        this.navigate(ROUTER.MEDIALIST, location);
                        break;
                    }
                }
                break;
            }
        }

        this.header();
        this.nano();
    }

    async navigate(router: ROUTER, url: URL | Location) {
        this.identify();
        url instanceof Location && (url = new URL(url.href));
        switch (router) {
            case ROUTER.AV: {
                if (this.#p_router !== router) {
                    document.documentElement.replaceWith(new Html());
                    document.body.replaceChildren(this.$header, this.$info, this.$player, this.$desc, this.$comment, this.$footer);
                    this.#p_router = router;
                }
                this.$header.resource_id = 142;
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
                    Promise.allSettled([cards({ av: this.aid }), pagelist(this.aid), detail(this.aid)])
                        .then(([cards, pagelist, detail]) => {
                            const d = cards.status === "fulfilled" && cards.value;
                            const page = pagelist.status === "fulfilled" && pagelist.value;
                            const de = detail.status === "fulfilled" && detail.value;
                            if (d) {
                                const card = d[`av${this.aid}`];
                                card.cid && (this.cid = card.cid);
                                if (page) {
                                    const p = Number(url.searchParams.get('p')) || 1;
                                    this.cid = page[p - 1].cid;
                                }
                                if (card.redirect_url) {
                                    const path = card.redirect_url.split('/');
                                    switch (true) {
                                        case /^ep\d+$/i.test(path[6]): {
                                            this.epid = +path[6].slice(2);
                                            break;
                                        }
                                        case /^ss\d+$/i.test(path[6]): {
                                            this.ssid = +path[6].slice(2);
                                            break;
                                        }
                                    }
                                }
                                if (this.cid) {
                                    this.$player.connect(this.aid, this.cid, this.ssid, this.epid);
                                    (de && de.View.ugc_season) ? this.$player.partUgcSeason(de) : de ? this.$player.getRelated(de.Related.map(d => {
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
                                    })) : this.$player.getRelated();
                                    if (de && de.View) {
                                        this.$info.avDetail(de);
                                        this.$desc.update(de);
                                    } else {
                                        this.$info.avCards(card);
                                        this.$desc.desc(card);
                                    }
                                    page && this.$player.partAv(page);
                                }
                            }
                        });
                    this.$comment.oid = this.aid;
                } else {
                    console.error('解析av号出错~');
                }
                break;
            }
            case ROUTER.BANGUMI: {
                if (this.#p_router !== router) {
                    document.documentElement.replaceWith(new Html());
                    document.body.replaceChildren(this.$header, this.$info, this.$player, this.$desc, this.$comment, this.$footer);
                    this.#p_router = router;
                }
                this.$header.resource_id = 142;
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
                    season(this.ssid ? { season_id: this.ssid } : { ep_id: this.epid })
                        .then(d => {
                            this.ssid || (this.ssid = d.season_id);
                            d.section && (d.episodes = d.episodes.concat(...d.section.map(d => d.episodes)));
                            if (!this.epid) {

                                this.epid = d.user_status?.progress?.last_ep_id || d.episodes[0]?.ep_id;
                            }
                            if (this.epid) {
                                const ep = d.episodes.find(d => d.ep_id === this.epid);
                                if (ep) {
                                    this.aid = ep.aid;
                                    this.cid = ep.cid;
                                }
                            }
                            if (this.epid && this.cid) {
                                this.$player.connect(this.aid, this.cid, this.ssid, this.epid);
                                this.$player.getRelated();
                                this.aid && (this.$comment.oid = this.aid);
                            }
                            this.$player.partBangumi(d);
                            this.$info.bangumi(d, this.epid);
                            this.$desc.bangumi(d, this.epid);
                        });
                } else {
                    console.error('解析Bangumi出错~');
                }
                break;
            }
            case ROUTER.HOME: {
                if (this.#p_router !== router) {
                    document.documentElement.replaceWith(new Html());
                    document.body.replaceChildren(this.$header, this.$home, this.$footer);
                    this.#p_router = router;
                }
                this.$header.resource_id = 142;
                break;
            }
            case ROUTER.TOVIEW: {
                if (this.#p_router !== router) {
                    document.documentElement.replaceWith(new Html());
                    document.body.replaceChildren(this.$header, this.$info, this.$player, this.$desc, this.$comment, this.$footer);
                    this.#p_router = router;
                }
                this.$header.resource_id = 142;
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
                toviewWeb().then(toview => {
                    this.aid || (toview.length && (this.aid = toview[0].aid));
                    if (this.aid) {
                        Promise.allSettled([cards({ av: this.aid }), pagelist(this.aid), detail(this.aid)])
                            .then(([cards, pagelist, detail]) => {
                                const d = cards.status === "fulfilled" && cards.value;
                                const page = pagelist.status === "fulfilled" && pagelist.value;
                                const de = detail.status === "fulfilled" && detail.value;
                                if (d) {
                                    const card = d[`av${this.aid}`];
                                    card.cid && (this.cid = card.cid);
                                    if (page && path[2]) {
                                        const p = +path[2].slice(1);
                                        this.cid = page[p - 1].cid;
                                    }
                                    if (card.redirect_url) {
                                        const path = card.redirect_url.split('/');
                                        switch (true) {
                                            case /^ep\d+$/i.test(path[6]): {
                                                this.epid = +path[6].slice(2);
                                                break;
                                            }
                                            case /^ss\d+$/i.test(path[6]): {
                                                this.ssid = +path[6].slice(2);
                                                break;
                                            }
                                        }
                                    }
                                    if (this.cid) {
                                        this.$player.connect(this.aid, this.cid, this.ssid, this.epid);
                                        page ? this.$player.partToView(toview, page) : this.$player.partToView(toview);
                                        if (de && de.View) {
                                            this.$info.avDetail(de);
                                            this.$desc.update(de);
                                        } else {
                                            this.$info.avCards(card);
                                            this.$desc.desc(card);
                                        }
                                    }
                                }
                            });
                        this.$comment.oid = this.aid;
                    } else {
                        console.error('解析稍后再看出错~');
                    }
                })
                break;
            }
            case ROUTER.MEDIALIST: {
                if (this.#p_router !== router) {
                    document.documentElement.replaceWith(new Html());
                    document.body.replaceChildren(this.$header, this.$info, this.$player, this.$desc, this.$comment, this.$footer);
                    this.#p_router = router;
                }
                this.$header.resource_id = 142;
                const path = url.pathname.split('/');
                const ml = +path[2].slice(2);
                if (ml) {
                    favResourceList(ml).then(({ medias, has_more }) => {
                        this.aid = Number(url.searchParams.get('aid')) || medias[0].id;
                        if (this.aid) {
                            Promise.allSettled([cards({ av: this.aid }), pagelist(this.aid), detail(this.aid)])
                                .then(([cards, pagelist, detail]) => {
                                    const d = cards.status === "fulfilled" && cards.value;
                                    const page = pagelist.status === "fulfilled" && pagelist.value;
                                    const de = detail.status === "fulfilled" && detail.value;
                                    if (d) {
                                        const card = d[`av${this.aid}`];
                                        card.cid && (this.cid = card.cid);
                                        if (page) {
                                            const p = Number(url.searchParams.get('p')) || 1;
                                            this.cid = page[p - 1].cid;
                                        }
                                        if (card.redirect_url) {
                                            const path = card.redirect_url.split('/');
                                            switch (true) {
                                                case /^ep\d+$/i.test(path[6]): {
                                                    this.epid = +path[6].slice(2);
                                                    break;
                                                }
                                                case /^ss\d+$/i.test(path[6]): {
                                                    this.ssid = +path[6].slice(2);
                                                    break;
                                                }
                                            }
                                        }
                                        if (this.cid) {
                                            this.$player.connect(this.aid, this.cid, this.ssid, this.epid);
                                            page ? this.$player.partMedialist(medias, page) : this.$player.partMedialist(medias);
                                            if (de && de.View) {
                                                this.$info.avDetail(de);
                                                this.$desc.update(de);
                                            } else {
                                                this.$info.avCards(card);
                                                this.$desc.desc(card);
                                            }
                                        }
                                    }

                                    // 请求更多媒体
                                    let pn = 2;
                                    const getMore = () => {
                                        favResourceList(ml, pn).then(({ medias, has_more }) => {
                                            pn++;
                                            this.$player.partMedialist(medias);
                                            has_more && getMore();
                                        })
                                    }
                                    has_more && getMore();
                                });
                            this.$comment.oid = this.aid;
                        } else {
                            console.error('解析稍后再看出错~');
                        }
                    })
                } else {
                    console.error('解析播放列表出错~');
                }
                break;
            }
        }
    }

    /** 拦截新版播放器 */
    private nano() {
        ProxyHook.property(self, 'nano', this);
        ProxyHook.property(self, 'EmbedPlayer', this.EmbedPlayer);
        ProxyHook.property(self, 'initComment', this.initComment);
        ProxyHook.property(self, 'bbComment', class {
            constructor(
                /** 绑定到的节点的选择符 */
                parent: string,
                /** 视频aid或话题topic id */
                oid: Record<string, any> | number,
                /** 评论所在页面类型 1:视频，2:话题 */
                pageType: number,
                /** 用户信息 */
                userStatus: object,
                /** 需要跳转到的评论的id */
                jumpId: number,
                ex: unknown,
            ) {
                const target = document.querySelector(parent);
                if (target) {
                    const $comment = new Comment();
                    target.replaceChildren($comment);
                    if (typeof oid === 'object') {
                        $comment.init(oid.oid, undefined, undefined, oid.pageType, oid.jumpId);
                    } else {
                        $comment.init(oid, undefined, undefined, pageType, jumpId);
                    }
                }
            }
        })
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
    createPlayer(initData: NanoInitData, theme?: Record<string, string>) {
        console.debug('新版播放器试图启动！', initData, theme);
        initData.kind && (this.#kind = initData.kind);
        initData.aid && (this.aid = +initData.aid);
        initData.cid && (this.cid = +initData.cid);
        this.aid || (initData.bvid && (this.aid = +AV.fromBV(initData.bvid)));
        if (!this.aid) {
            const { aid } = this.searchParams();
            aid && (this.aid = aid.startsWith('BV') ? +AV.fromBV(aid) : +aid); // 诡异的写作 aid 读作 bvid ！
        }
        initData.seasonId && (this.ssid = +initData.seasonId);
        initData.episodeId && (this.epid = +initData.episodeId);
        initData.element?.replaceChildren(this.$player);
        this.$player.classList.add('nano'); // 默认铺满播放器容器
        (PLAYER_STATE.mode & PLAYER_MODE.WIDE) || ev.trigger(PLAYER_EVENT.PLAYER_MODE, PLAYER_STATE.mode ^= PLAYER_MODE.WIDE); // 默认以宽屏模式启动

        return this;
    }

    /** nano播放器兼容 */
    async reload(initData: NanoInitData) {
        this.createPlayer(initData);
        this.connect();
    }

    /** nano播放器兼容 */
    connect() {
        if (this.#kind === GroupKind.Pugv) {
            if (this.ssid || this.epid) {
                pugvSeason(this.ssid ? { season_id: this.ssid } : { ep_id: this.epid })
                    .then(d => {
                        this.ssid || (this.ssid = d.season_id);
                        if (!this.epid) {
                            this.epid = d.episodes[0]?.id;
                        }
                        if (this.epid) {
                            const ep = d.episodes.find(d => d.id === this.epid);
                            if (ep) {
                                this.aid = ep.aid;
                                this.cid = ep.cid;
                            }
                        }
                        if (this.epid && this.cid) {
                            this.$player.connect(this.aid, this.cid, this.ssid, this.epid, true, GroupKind.Pugv);
                        }
                    });
            } else {
                console.error('解析课程出错~');
            }
        } else if (this.ssid || this.epid) {
            season(this.ssid ? { season_id: this.ssid } : { ep_id: this.epid })
                .then(d => {
                    this.ssid || (this.ssid = d.season_id);
                    d.section && (d.episodes = d.episodes.concat(...d.section.map(d => d.episodes)));
                    if (!this.epid) {
                        this.epid = d.user_status?.progress?.last_ep_id || d.episodes[0]?.ep_id;
                    }
                    if (this.epid) {
                        const ep = d.episodes.find(d => d.ep_id === this.epid);
                        if (ep) {
                            this.aid = ep.aid;
                            this.cid = ep.cid;
                        }
                    }
                    if (this.epid && this.cid) {
                        this.$player.connect(this.aid, this.cid, this.ssid, this.epid, true);
                        this.$player.getRelated();
                    }
                });
        } else if (this.aid) {
            cards({ av: this.aid }).then(d => {
                const card = d[`av${this.aid}`];
                this.cid || (this.cid = card.cid);
                if (card.redirect_url) {
                    const path = card.redirect_url.split('/');
                    switch (true) {
                        case /^ep\d+$/i.test(path[6]): {
                            this.epid = +path[6].slice(2);
                            break;
                        }
                        case /^ss\d+$/i.test(path[6]): {
                            this.ssid = +path[6].slice(2);
                            break;
                        }
                    }
                }
                if (this.cid) {
                    this.$player.connect(this.aid, this.cid, this.ssid, this.epid, true);
                    this.$player.getRelated();
                }
            })
        } else {
            console.error('启动播放器出错~');
        }
    }

    /** 原生播放器兼容 */
    EmbedPlayer = (
        type: string,
        player: any,
        playerParamsArg: string,
        playerType: string,
        upgrade: boolean,
        callbackFn: Function,
        isIframe: boolean,
    ) => {
        const bofqi = document.querySelector('#bilibili-player') || document.querySelector('#bofqi');
        if (bofqi) {
            bofqi.replaceWith(this.$player);
            const params = this.searchParams(playerParamsArg || location.search);
            params.aid && (this.aid = +params.aid);
            params.cid && (this.cid = +params.cid);
            this.aid || (params.bvid && (this.aid = +AV.fromBV(params.bvid)));
            this.$player.classList.add('nano'); // 默认铺满播放器容器
            (PLAYER_STATE.mode & PLAYER_MODE.WIDE) || ev.trigger(PLAYER_EVENT.PLAYER_MODE, PLAYER_STATE.mode ^= PLAYER_MODE.WIDE); // 默认以宽屏模式启动
            this.connect();
        } else {
            console.error('未找到播放器~');
        }
    }

    /** nano播放器兼容 */
    searchParams(url = location.search) {
        return Object.fromEntries([...new URLSearchParams(url).entries()]);
    }

    /** nano播放器兼容 */
    on(event: EventType, callback: () => void) {
        switch (event) {
            case EventType.Player_Initialized:
            case EventType.Player_Connected: {
                Promise.resolve().finally(callback)
                break;
            }
            case EventType.Player_Disconnect: {
                ev.bind(PLAYER_EVENT.IDENTIFY, callback);
                break;
            }
        }
    }

    /** nano播放器兼容 */
    off(event: EventType, callback: () => void) {
        switch (event) {
            case EventType.Player_Disconnect: {
                ev.unbind(PLAYER_EVENT.IDENTIFY, callback);
                break;
            }
        }
    }

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
        return video.muted;
    }

    /** nano播放器兼容 */
    getVolume() {
        return video.volume;
    }

    /** nano播放器兼容 */
    getDuration() {
        return video.duration;
    }

    /** nano播放器兼容 */
    play() {
        return Promise.resolve();
    }

    /** nano播放器兼容 */
    pause() { }

    /** nano播放器兼容 */
    getCurrentTime() {
        return video.currentTime;
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
        return video.paused;
    }

    /** 拦截新版顶栏 */
    private header = () => {
        const { $header } = this
        ProxyHook.property(self, 'BiliHeader', class {
            constructor({ config }: BiliHeader) {
                if (config.headerType === 'mini') {
                    $header.classList.add('mini');
                }
            }
            init(el: HTMLElement) {
                $header.resource_id = 142;
                return el.replaceWith($header);
            }
        });
    }

    /** 拦截新版评论区 */
    initComment = (container: string, { oid, pageType, jumpReplyId }: InitComment) => {
        const target = document.querySelector(container);
        if (target) {
            const $comment = new Comment();
            target.replaceWith($comment);
            $comment.init(oid, undefined, undefined, pageType, jumpReplyId);
        }
        return this;
    }

    /** 新版评论区兼容 */
    registerEvent() { }

    identify = () => {
        this.aid = 0;
        this.cid = 0;
        this.ssid = 0;
        this.epid = 0;
        this.$player.classList.remove('nano');
        this.$header.classList.remove('mini');
    }
}

/** 路由列表 */
export enum ROUTER {
    AV,
    BANGUMI,
    HOME,
    TOVIEW,
    MEDIALIST,
}