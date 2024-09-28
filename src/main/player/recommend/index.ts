import { BilibiliPlayer } from "..";
import { recommend } from "../../../io/com/bilibili/api/pgc/season/web/related/recommend";
import { pgcSection } from "../../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { toviewWeb } from "../../../io/com/bilibili/api/x/v2/history/toview/web";
import { related } from "../../../io/com/bilibili/api/x/web-interface/archive/related";
import { detail } from "../../../io/com/bilibili/api/x/web-interface/view/detail";
import { ev, PLAYER_EVENT } from "../../../player/event";
import { MAIN_EVENT, mainEv } from "../../event";
import { ROUTER } from "../../router";

export class Recommend {

    constructor(private player: BilibiliPlayer) { }

    async av() {
        detail(this.player.$aid)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.View.ugc_season) {
                    // 视频合集
                    if (data.View.ugc_season) {
                        this.player.$auxiliary.$recommend.add(data.View.ugc_season.sections[0].episodes.map(d => {
                            return {
                                src: d.arc.pic + '@.webp',
                                title: d.title,
                                duration: d.arc.duration,
                                view: d.arc.stat.view,
                                danmaku: d.arc.stat.danmaku,
                                callback() {
                                    const url = new URL(`https://www.bilibili.com/video/av${d.aid}/`);
                                    mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.AV, url]);
                                    history.replaceState(undefined, '', url);
                                },
                                selected: d.cid === this.player.$cid,
                            }
                        }));
                        this.player.$auxiliary.$filter.$recommend.textContent = '视频合集';
                    }
                } else {
                    related(this.player.$aid).then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        this.player.$auxiliary.$recommend.add(data.map(d => {
                            return {
                                src: d.pic + '@.webp',
                                title: d.title,
                                duration: d.duration,
                                view: d.stat.view,
                                danmaku: d.stat.danmaku,
                                author: d.owner.name,
                                callback() {
                                    const url = new URL(`https://www.bilibili.com/video/av${d.aid}/`);
                                    mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.AV, url]);
                                    history.replaceState(undefined, '', url);
                                },
                            }
                        }));
                        this.player.$auxiliary.$filter.$recommend.textContent = '推荐视频';
                    })
                }
                if (data.View.pages.length > 1) {
                    let ni = data.View.pages.findIndex(d => d.cid === this.player.$cid);
                    if (ni >= 0 && ni + 1 < data.View.pages.length) {
                        const ep = data.View.pages[ni + 1];
                        ep && ev.trigger(PLAYER_EVENT.CALL_NEXT_REGISTER, () => {
                            const url = new URL(`https://www.bilibili.com/video/av${this.player.$aid}/?p=${ep.page}`);
                            mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.AV, url]);
                            history.replaceState(undefined, '', url);
                        });
                    }
                }
            })
            .catch(e => {
                console.error('获取推荐数据失败', e);
            });
    }

    async bangumi() {
        recommend(this.player.$ssid)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                this.player.$auxiliary.$recommend.add(data.season.map(d => {
                    return {
                        src: d.cover + '@.webp',
                        title: d.title,
                        view: d.stat.view,
                        danmaku: d.stat.danmaku,
                        callback() {
                            const url = new URL(d.url);
                            mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.BANGUMI, url]);
                            history.replaceState(undefined, '', url);
                        },
                    }
                }));
            })
            .catch(e => {
                console.error('获取推荐数据失败', e);
            });
        pgcSection(this.player.$ssid)
            .then(({ code, message, result }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                if (result.main_section) {
                    const ni = result.main_section.episodes.findIndex(d => d.id === this.player.$epid);
                    if (ni >= 0 && ni + 1 < result.main_section.episodes.length) {
                        const ep = result.main_section.episodes[ni + 1];
                        ep && ev.trigger(PLAYER_EVENT.CALL_NEXT_REGISTER, () => {
                            const url = new URL(`https://www.bilibili.com/bangumi/play/ep${ep.id}`);
                            mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.BANGUMI, url]);
                            history.replaceState(undefined, '', url);
                        });
                    }
                }
            })
            .catch(e => {
                console.error('获取分P数据失败', e);
            })
    }

    async toview(list: Awaited<ReturnType<typeof toviewWeb>>['data']['list']) {
        let ni = -1;
        this.player.$auxiliary.$recommend.add(list.map((d, i) => {
            d.aid === this.player.$aid && (ni = i);
            return {
                src: d.pic + '@.webp',
                title: d.title,
                duration: d.duration,
                view: d.stat.view,
                danmaku: d.stat.danmaku,
                callback() {
                    const url = new URL(`https://www.bilibili.com/watchlater/#/av${d.aid}`);
                    mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.TOVIEW, url]);
                    history.replaceState(undefined, '', url);
                },
                selected: d.aid === this.player.$aid,
            }
        }));
        this.player.$auxiliary.$filter.$recommend.textContent = '稍后再看';
        if (ni >= 0) {
            const ep = list[ni];
            if (ep.pages.length > 1) {
                const ni = ep.pages.findIndex(d => d.cid === this.player.$cid);
                if (ni >= 0 && ni + 1 < ep.pages.length) {
                    const part = ep.pages[ni + 1];
                    part && ev.trigger(PLAYER_EVENT.CALL_NEXT_REGISTER, () => {
                        const url = new URL(`https://www.bilibili.com/watchlater/#/av${ep.aid}/p${part.page}`);
                        mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.TOVIEW, url]);
                        history.replaceState(undefined, '', url);
                    });
                    return
                }
            }
            if (ni + 1 < list.length) {
                const ep = list[ni + 1];
                ep && ev.trigger(PLAYER_EVENT.CALL_NEXT_REGISTER, () => {
                    const url = new URL(`https://www.bilibili.com/watchlater/#/av${ep.aid}/`);
                    mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.TOVIEW, url]);
                    history.replaceState(undefined, '', url);
                });
            }
        }
    }
}