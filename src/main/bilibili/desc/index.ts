import { ROUTER } from "..";
import { pgcAppSeason } from "../../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { followAdd } from "../../../io/com/bilibili/api/pgc/web/follow/add";
import { followDel } from "../../../io/com/bilibili/api/pgc/web/follow/del";
import { cards, ICardsOut } from "../../../io/com/bilibili/api/x/article/cards";
import { toviewWeb } from "../../../io/com/bilibili/api/x/v2/history/toview/web";
import { favResourceList } from "../../../io/com/bilibili/api/x/v3/fav/resource/list";
import { detail } from "../../../io/com/bilibili/api/x/web-interface/view/detail";
import svg_heart from "../../../player/assets/svg/heart.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { AV } from "../../../utils/av";
import { cookie } from "../../../utils/cookie";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 视频介绍 */
@customElement('div')
export class Desc extends HTMLDivElement {

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

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    private $desc = Element.add('div', { class: 'desc' }, this);

    private $tag = Element.add('div', { class: 'tag' }, this.$desc);

    private $m = Element.add('div', { class: 'm' }, this.$desc);

    private $cover = Element.add('a', { class: 'bangumi-cover', target: '_blank' }, this.$desc);

    private $info = Element.add('div', { class: 'bangumi-info', target: '_blank' }, this.$desc);

    private $title = Element.add('div', { class: 'bangumi-title' }, this.$info);

    private $a = Element.add('a', { target: '_blank' }, this.$title);

    private $follow = Element.add('button', { class: "btn-follow" }, this.$title, `${svg_heart}追番`);

    private $list = Element.add('div', { class: 'bangumi-list' }, this.$info);

    private $section = Element.add('form', { class: 'bangumi-section' }, this.$list);

    private $episode = Element.add('div', { class: 'bangumi-episode' }, this.$list);

    private $detail = Element.add('div', { class: 'bangumi-detail' }, this.$info);

    #aid = 0;

    #cid = 0;

    #ssid = 0;

    #epid = 0;

    constructor() {
        super();
        this.insertAdjacentHTML('beforeend', `<style>${__BILI_DESC_STYLE__}</style>`);

        this.$section.addEventListener('change', () => {
            const d = new FormData(this.$section);
            const i = +[...d.values()][0];
            if (i) {
                pgcSection(i).then(d => {
                    const eps = d.main_section.episodes.concat(...d.section.map(d => d.episodes));
                    if (eps.length) {
                        this.$episode.replaceChildren();
                        this.banggumiEpisode(eps);
                    }
                })
            }
        });
        this.$follow.addEventListener('click', () => {
            const csrf = cookie.get('bili_jct');
            const { ssid } = this.$follow.dataset;
            if (csrf && ssid) {
                (this.$follow.classList.contains('followed') ? followDel(csrf, ssid) : followAdd(csrf, ssid)).then(({ toast }) => {
                    this.$follow.textContent = toast;
                    this.$follow.classList.toggle('followed');
                });
            }
        });
    }

    async navigate(router: ROUTER, url: URL | Location) {
        this.#aid = 0;
        this.#cid = 0;
        this.#ssid = 0;
        this.#epid = 0;
        url instanceof Location && (url = new URL(url.href));
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        this.#aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        this.#aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                if (this.#aid) {
                    Promise.allSettled([cards({ av: this.#aid }), detail(this.#aid)])
                        .then(([cards, detail]) => {
                            const d = cards.status === "fulfilled" && cards.value;
                            const de = detail.status === "fulfilled" && detail.value;
                            if (d) {
                                const card = d[`av${this.#aid}`];
                                if (de && de.View) {
                                    this.update(de);
                                } else {
                                    this.desc(card);
                                }
                            }
                        });
                } else {
                    console.error('解析av号出错~');
                }
                break;
            }
            case ROUTER.BANGUMI: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^ss\d+$/i.test(path[3]): {
                        this.#ssid = +path[3].slice(2);
                        break;
                    }
                    case /^ep\d+$/i.test(path[3]): {
                        this.#epid = +path[3].slice(2);
                        break;
                    }
                }
                if (this.#ssid || this.#epid) {
                    pgcAppSeason(this.#ssid ? { season_id: this.#ssid } : { ep_id: this.#epid })
                        .then(season => {
                            this.#ssid || (this.#ssid = season.season_id);
                            season.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        this.#epid || (this.#epid = d.data.episodes[0]?.ep_id);
                                        break;
                                    }
                                }
                            });
                            this.bangumi(season, this.#epid).finally(async () => {
                                if (this.#ssid && !this.#epid) {
                                    const d = await pgcSection(this.#ssid);
                                    const eps = d.main_section.episodes.concat(...d.section.map(d => d.episodes));
                                    const ep = this.#epid ? eps.find(d => d.id === this.#epid) : eps[0];
                                    if (ep) {
                                        this.#epid = ep.id;
                                        this.banggumiEpisode(eps, this.#epid);
                                    }
                                }
                            });
                        });
                } else {
                    console.error('解析Bangumi出错~');
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        this.#aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        this.#aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                toviewWeb().then(toview => {
                    this.#aid || (toview.length && (this.#aid = toview[0].aid));
                    if (this.#aid) {
                        Promise.allSettled([cards({ av: this.#aid }), detail(this.#aid)])
                            .then(([cards, detail]) => {
                                const d = cards.status === "fulfilled" && cards.value;
                                const de = detail.status === "fulfilled" && detail.value;
                                if (d) {
                                    const card = d[`av${this.#aid}`];
                                    if (de && de.View) {
                                        this.update(de);
                                    } else {
                                        this.desc(card);
                                    }
                                }
                            });
                    } else {
                        console.error('解析稍后再看出错~');
                    }
                })
                break;
            }
            case ROUTER.MEDIALIST: {
                const path = url.pathname.split('/');
                const ml = +path[2].slice(2);
                if (ml) {
                    favResourceList(ml).then(({ medias }) => {
                        this.#aid = Number(url.searchParams.get('aid')) || medias[0].id;
                        if (this.#aid) {
                            Promise.allSettled([cards({ av: this.#aid }), detail(this.#aid)])
                                .then(([cards, detail]) => {
                                    const d = cards.status === "fulfilled" && cards.value;
                                    const de = detail.status === "fulfilled" && detail.value;
                                    if (d) {
                                        const card = d[`av${this.#aid}`];
                                        if (de && de.View) {
                                            this.update(de);
                                        } else {
                                            this.desc(card);
                                        }
                                    }
                                });
                        } else {
                            console.error('解析播放列表出错~');
                        }
                    })
                } else {
                    console.error('解析播放列表出错~');
                }
                break;
            }
        }
    }

    private update(data: Awaited<ReturnType<typeof detail>>) {
        this.desc(<ICardsOut><unknown>data.View);
        let p = '';
        data.Tags.forEach(d => {
            p += `<a target="_blank" href="//search.bilibili.com/all?keyword=${d.tag_name}">${d.tag_name}</a>`
        });
        this.$tag.innerHTML = p;
    }

    private desc(data: ICardsOut) {
        this.identify();
        this.$m.innerHTML = Format.superLink(data.desc);
    }

    private async bangumi(data: Awaited<ReturnType<typeof pgcAppSeason>>, epid?: number) {
        this.identify();
        this.$desc.classList.add('bangumi');
        this.$cover.href = this.$a.href = `//www.bilibili.com/bangumi/media/md${data.media_id}`;
        this.$cover.innerHTML = `<img loading="lazy" src="${https(data.cover)}@.webp">`;
        this.$a.text = data.title;
        this.$follow.dataset.ssid = <any>data.season_id;

        const id = crypto.randomUUID();
        data.modules.forEach(d => {
            switch (d.style) {
                case "season": {
                    this.$section.innerHTML = d.data.seasons.map(d => {
                        return `<label class="season-item">${d.season_title}<input type="radio" name=${id} value="${d.season_id}" ${d.season_id === data.season_id ? ' checked' : ''}></label>`;
                    }).join('');
                    break;
                }
                case "positive":
                case "section": {
                    this.$episode.insertAdjacentHTML('beforeend', d.data.episodes.map(d => {
                        return `<a class="episode-item${d.ep_id === epid ? ' on' : ''}" href="/bangumi/play/ep${d.ep_id}" data-index="${/^\d+$/.test(d.title) ? `第${d.title}话` : d.title}"><span>${d.long_title}</span><span class="badge" style="background-color: ${d.badge_info.bg_color || '#fb7299'};">${d.badge_info.text}</span></a>`
                    }).join(''));
                    break;
                }
            }
        });
        this.$detail.innerHTML = `<p><label>风格：</label>${data.styles.map(d => `<span>${d.name}</span>`).join('')}</p>
<p><label>主创：</label>${data.staff.info}</p>
<p><label>演员：</label>${data.actor.info}</p>
<p><label>简介：</label>${data.evaluate}</p>`;
    }

    private async banggumiEpisode(eps: IEpisode[], epid?: number) {
        this.$episode.insertAdjacentHTML('beforeend', eps.map(d => {
            return `<a class="episode-item${d.id === epid ? ' on' : ''}" href="/bangumi/play/ep${d.id}" data-index="${/^\d+$/.test(d.title) ? `第${d.title}话` : d.title}"><span>${d.long_title}</span><span class="badge" style="background-color: ${d.badge_info.bg_color || '#fb7299'};">${d.badge_info.text}</span></a>`
        }).join(''));
    }

    private identify = () => {
        this.$desc.classList.remove('bangumi');
        this.$tag.replaceChildren();
        this.$m.replaceChildren();
        this.$cover.replaceChildren();
        this.$a.replaceChildren();
        this.$section.replaceChildren();
        this.$episode.replaceChildren();
        this.$detail.replaceChildren();
    }
}


//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_DESC_STYLE__: string;
}