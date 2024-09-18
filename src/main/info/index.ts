import { AV } from "../../utils/av";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { MAIN_EVENT, mainEv } from "../event";
import { ROUTER } from "../router";
import SORT from "./sort.json"
import stylesheet from "./index.css" with {type: 'css'};
import { Format } from "../../utils/fomat";
import { detail } from "../../io/com/bilibili/api/x/web-interface/view/detail";
import { toastr } from "../../toastr";
import { https } from "../../utils/https";
import { Avatar } from "../comment/avatar";
import { IModulePositiveEpisode, pgcAppSeason } from "../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { toviewWeb } from "../../io/com/bilibili/api/x/v2/history/toview/web";
import { relation } from "../../io/com/bilibili/api/x/web-interface/archive/relation";
import { nav } from "../../io/com/bilibili/api/x/web-interface/nav";
import { Operated } from "./operated";
import { Collection } from "./collection";
import { relationModify } from "../../io/com/bilibili/api/x/relation/modify";
import { cookie } from "../../utils/cookie";

/** 评论区 */
@customElement(undefined, `info-${Date.now()}`)
export class Info extends HTMLElement {

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
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #host = this.attachShadow({ mode: 'closed' });

    #container = Element.add('div', { class: 'container', appendTo: this.#host });

    #video = Element.add('div', { class: 'video', appendTo: this.#container });

    #up = Element.add('div', { class: 'up', appendTo: this.#container });

    #title = Element.add('h1', { appendTo: this.#video });

    #tm = Element.add('div', { appendTo: this.#video, class: 'tm-info' });

    #number = Element.add('div', { appendTo: this.#video, class: 'number' });

    #coin = this.#host.appendChild(new Operated());

    #collection = this.#host.appendChild(new Collection());

    #aid = 0;

    get $aid() {
        return this.#aid
    }

    set $aid(v) {
        this.#aid = v;
        v && nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.isLogin) {
                    relation(v)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            const { favorite, coin } = data;
                            this.#number.querySelector('.fav')?.classList.toggle('d', Boolean(favorite));
                            this.#number.querySelector('.coin')?.classList.toggle('d', Boolean(coin));
                        })
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });
        mainEv.bind(MAIN_EVENT.RELATION_FLASH, () => {
            this.$aid = this.#aid;
        });
        mainEv.bind(MAIN_EVENT.GUAN_ZHU, ({ detail }) => {
            const d = this.#host.querySelector<HTMLElement>('.b-gz');
            if (d) {
                d.classList.toggle('d', detail);
                d.innerText = detail ? '已关注' : '+ 关注';
            }
        });

        this.#host.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLElement) {
                const coin = target.closest('.coin');
                if (coin && !coin.classList.contains('d')) {
                    this.#coin.showPopover();
                } else if (target.closest('.fav')) {
                    this.#collection.showPopover();
                } else if (target.closest('.b-gz')) {
                    const gz = target.closest<HTMLElement>('.b-gz')!;
                    const csrf = cookie.get('bili_jct');
                    const i = gz.classList.contains('d') ? 2 : 1;
                    const { mid } = gz.dataset;
                    if (csrf && mid) {
                        relationModify(csrf, mid, i)
                            .then(({ code, message }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                                toastr.success(`已${i === 2 ? '取消' : '关注'}关注`, `mid：${mid}`);
                                mainEv.trigger(MAIN_EVENT.GUAN_ZHU, i === 1);
                            })
                            .catch(e => {
                                toastr.error(`${i === 2 ? '取消' : '关注'}关注出错`, e);
                                console.error(e);
                            })
                    }
                } else if (target.closest('.b-cd')) {
                    toastr.warn('【充电】功能属于支付类风险操作！', '请移步到UP主页等原生页面进行，已保护您的财产安全~').$delay = 10;
                }
            }
        });
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                if (aid) {
                    detail(aid)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            // 视频信息
                            const { View, Card } = data;
                            document.title = this.#title.innerText = this.#title.title = View.title;
                            const tinfo: any = SORT[View.tid];
                            this.#tm.innerHTML = `<span><a href="/">主页</a>${tinfo ? tinfo[2] ? ` > <a href="${(<any>SORT)[tinfo[2]][1]}">${(<any>SORT)[tinfo[2]][0]}</a> > <a href="${tinfo[1]}">${tinfo[0]}</a>` : ` > <a href="${tinfo[1]}">${tinfo[0]}</a>` : ''}</span>
<time>${Format.eTime(View.pubdate)}</time>
<a>稿件投诉</a>`;
                            this.#number.innerHTML = `<span title="总播放数${View.stat.view}" class="v play">${Format.carry(View.stat.view)}</span>
<span title="总弹幕数${View.stat.danmaku}" class="v dm">${Format.carry(View.stat.danmaku)}</span>
${View.stat.his_rank ? `<span title="本日日排行数据过期后，再纳入本稿件的历史排行数据进行对比得出" class="v rank">最高全站日排行${View.stat.his_rank}名</span>` : ''}
<span class="line"></span>
<span title="投硬币枚数${View.stat.coin}" class="u coin">硬币 ${Format.carry(View.stat.coin)}</span>
<span title="收藏人数${View.stat.favorite}" class="u fav">收藏 ${Format.carry(View.stat.favorite)}</span>`;
                            // UP信息
                            this.#up.innerHTML = https(`<div>
    <a target="_blank" class="avatar" href="//space.bilibili.com/${Card.card.mid}">
        <img loading="lazy" src="${Card.card.face}" class="avatar-face">${Card.card.pendant.image ? `<img class="avatar-pendant" loading="lazy" src="${Card.card.pendant.image}">` : ''}${Card.card.official_verify.type >= 0 || Card.card.vip.vipStatus ? `<img class="avatar-icon" src="//i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/${Card.card.official_verify.type >= 0 ? Avatar[Card.card.official_verify.type] : Avatar[2]}.svg">` : ''}
    </a>
</div>
<div class="info">
	<div class="user">
		<a href="//space.bilibili.com/${Card.card.mid}" target="_blank" class="name"${Card.card.vip.nickname_color ? ` style="color: ${Card.card.vip.nickname_color}"` : ''}>${Card.card.name}</a>
		<a href="//message.bilibili.com/#whisper/mid${Card.card.mid}" target="_blank" class="message">发消息</a>
	</div>
	<div class="sign">${Card.card.sign}</div>
	<div class="number">
		<span title="投稿数${Card.archive_count}">投稿：${Format.carry(Card.archive_count)}</span>
		<span title="粉丝数${Card.follower}">粉丝：${Format.carry(Card.follower)}</span>
	</div>
	<div class="followe">
		<button class="b-gz${Card.following ? ' d' : ''}" data-mid="${Card.card.mid}">+ 关注</button>
		<button class="b-cd">充电</button>
	</div>
</div>`);
                            View.staff && this.#up.insertAdjacentHTML('beforeend', `<div class="staff">${View.staff.map(d => `<a target="_blank" class="avatar" href="//space.bilibili.com/${d.mid}">
    <img loading="lazy" src="${d.face}" class="avatar-face">${d.official.type >= 0 || d.vip.status ? `<img class="avatar-icon" src="//i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/${d.official.type >= 0 ? Avatar[d.official.type] : Avatar[2]}.svg">` : ''}
    <span class="name"${d.vip.nickname_color ? ` style="color: ${d.vip.nickname_color}"` : ''}>${d.name}</span>
    <span class="title">${d.title}</span>
</a>`).join('')}</div>`);
                            this.#coin.dataset.aid = this.#collection.dataset.aid = this.$aid = <any>aid;
                        })
                        .catch(e => {
                            console.error(e);
                        });
                }
                break;
            }
            case ROUTER.BANGUMI: {
                const path = url.pathname.split('/');
                let ssid = 0, epid = 0;
                switch (true) {
                    case /^ss\d+$/i.test(path[3]): {
                        ssid = +path[3].slice(2);
                        break;
                    }
                    case /^ep\d+$/i.test(path[3]): {
                        epid = +path[3].slice(2);
                        break;
                    }
                }
                if (ssid || epid) {
                    pgcAppSeason(ssid ? { season_id: ssid } : { ep_id: epid })
                        .then(async ({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            ssid || (ssid = data.season_id);
                            epid || (data.user_status.progress?.last_ep_id && (epid = data.user_status.progress?.last_ep_id));
                            let ep: IEpisode | IModulePositiveEpisode | undefined;
                            data.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        if (!ep) {
                                            epid || (epid = d.data.episodes[0]?.ep_id);
                                            if (epid) {
                                                ep = d.data.episodes.find(d => d.ep_id === epid);
                                            }
                                        }
                                        break;
                                    }
                                }
                            });
                            if (!ep) {
                                if (ssid) {
                                    const { code, message, result } = await pgcSection(ssid);
                                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                                    const eps = (<IEpisode[]>[]).concat(...(result.main_section?.episodes || []), ...result.section.map(d => d.episodes));
                                    ep = epid ? eps.find(d => d.id === epid) : eps[0];
                                } else {
                                    throw new ReferenceError('番剧信息里未包含有效分集列表？', { cause: { code, message, data } });
                                }
                            }
                            if (!ep) throw new ReferenceError('番剧信息里未包含有效分集列表？', { cause: { code, message, data } });
                            document.title = this.#title.innerText = this.#title.title = `${data.title}：${isNaN(+ep.title) ? ep.title : `第${ep.title}话`} ${ep.long_title}`;
                            this.#tm.innerHTML = `<span>${data.type_name} | ${data.areas.map(d => d.name).join(',')}</span>
<span>${data.new_ep.desc}</span>
<a href="/video/av${ep.aid}">av${ep.aid}</a>`;
                            this.#number.innerHTML = `<span title="总播放数${data.stat.views}" class="v play">${Format.carry(data.stat.views)}</span>
<span title="总弹幕数${data.stat.danmakus}" class="v dm">${Format.carry(data.stat.danmakus)}</span>
<span class="line"></span>
<span title="投硬币枚数${data.stat.coins}" class="u coin">硬币 ${Format.carry(data.stat.coins)}</span>
<span title="追番数${data.stat.favorites}" class="u order">追番 ${Format.carry(data.stat.favorites)}</span>`;
                            this.#coin.dataset.aid = this.#collection.dataset.aid = this.$aid = <any>ep.aid;
                        })
                        .catch(e => {
                            console.error(e);
                        });
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                if (aid) {
                    this.$navigate(ROUTER.AV, new URL(`https://www.bilibili.com/video/av${aid}`));
                } else {
                    toviewWeb()
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            aid || (aid = data.list[0].aid);
                            this.$navigate(ROUTER.AV, new URL(`https://www.bilibili.com/video/av${aid}`));
                        })
                        .catch(console.error);
                }
                break;
            }
        }
    }
}