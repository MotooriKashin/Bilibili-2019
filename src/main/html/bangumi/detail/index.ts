import { IModulePositiveEpisode, pgcAppSeason } from "../../../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { followAdd } from "../../../../io/com/bilibili/api/pgc/web/follow/add";
import { followDel } from "../../../../io/com/bilibili/api/pgc/web/follow/del";
import { toastr } from "../../../../toastr";
import { cookie } from "../../../../utils/cookie";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";
import { Format } from "../../../../utils/fomat";
import { https } from "../../../../utils/https";
import { mainEv, MAIN_EVENT } from "../../../event";
import { ROUTER } from "../../../router";
import stylesheet from "./index.css" with {type: 'css'};

/** 详情区 */
@customElement(undefined, `desctail-${Date.now()}`)
export class Detail extends HTMLElement {

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

    #info = Element.add('div', { class: 'info', appendTo: this.#container });

    #left = Element.add('div', { class: 'left', appendTo: this.#info });

    #right = Element.add('div', { class: 'right', appendTo: this.#info });

    #title = Element.add('div', { class: 'title', appendTo: this.#right });

    #titleFunc = Element.add('div', {
        class: 'func', appendTo: this.#title, innerHTML: `<button class="follow">追番</button>
<button class="app">用手机看</button>
<button class="icon weibo"></button>
<button class="icon zone"></button>
<button class="icon qq"></button>
<button class="icon baidu"></button>` }
    );

    #topBlock = Element.add('div', { class: 'top-block', appendTo: this.#right });

    #ssList = Element.add('form', { class: 'ss-list-wrapper', appendTo: this.#topBlock });

    #modSelect = Element.add('form', { class: 'mode-select', appendTo: this.#topBlock, innerHTML: `<label class="detail-mode" title="详细模式"><input type="radio" name="mode" value="0" checked></label><label class="simple-mode" title="精简模式"><input type="radio" name="mode" value="1"></label>` });

    #episodeList = Element.add('form', { class: 'episode-list', appendTo: this.#right });

    #sponsor = Element.add('div', { class: 'sponsor' });

    #sponsorLeft = Element.add('div', {
        class: 'left', appendTo: this.#sponsor, innerHTML: `<div class="header">
	<div class="title">承包榜</div>
	<div class="view">查看承包榜</div>
</div>` });

    #sponsorRight = Element.add('div', { class: 'right', appendTo: this.#sponsor, innerHTML: '' });

    #sponsorList = Element.add('div', { class: 'body', appendTo: this.#sponsorLeft });

    #follow = <HTMLElement>this.#titleFunc.firstElementChild!

    #ssid = 0;

    #epid = 0;

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];

        this.#ssList.addEventListener('change', () => {
            const d = new FormData(this.#ssList);
            const i = Number(d.get('ssid'));
            if (i) {
                pgcSection(i)
                    .then(({ code, message, result }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                        this.#episodeList.replaceChildren();
                        const eps = (<IEpisode[]>[]).concat(...(result.main_section?.episodes || []), ...result.section.map(d => d.episodes));
                        eps.forEach(d => Element.add('label', { appendTo: this.#episodeList, innerHTML: `<input type="radio" name="epid" value="${d.id}"${d.id === this.#epid ? ' checked' : ''}><div class="ep-index${isNaN(+d.title) ? '' : ` d`}">${d.title}</div><div class="ep-title">${d.long_title}</div>${d.badge_info.text ? `<div class="mark" style="background-color: light-dark(${d.badge_info.bg_color},${d.badge_info.bg_color_night});">${d.badge_info.text}</div>` : ''}` }));
                    })
                    .catch(e => {
                        toastr.error('获取分集列表出错', e);
                        console.error(e)
                    })
            }
        });
        this.#modSelect.addEventListener('change', () => {
            const d = new FormData(this.#modSelect);
            const i = +[...d.values()][0];
            this.#episodeList.classList.toggle('simple', Boolean(i));
        });
        this.#episodeList.addEventListener('change', () => {
            const d = new FormData(this.#episodeList);
            const i = Number(d.get('epid'));
            if (i) {
                const url = new URL(`https://www.bilibili.com/bangumi/play/ep${i}`);
                mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.BANGUMI, url]);
                history.replaceState(undefined, '', url);
            }
        });
        this.#follow.addEventListener('click', () => {
            const csrf = cookie.get('bili_jct');
            const i = this.#follow.classList.contains('d');
            if (csrf && this.#ssid) {
                (i ? followDel(csrf, this.#ssid) : followAdd(csrf, this.#ssid))
                    .then(({ code, message, result }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                        toastr.success(result.toast);
                        mainEv.trigger(MAIN_EVENT.ZHUI_FAN, Boolean(result.status));
                    })
                    .catch(e => {
                        toastr.error(`${i ? '取消' : '添加'}追番出错`, e);
                        console.error(e);
                    });
            }
        })

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });
        mainEv.bind(MAIN_EVENT.ZHUI_FAN, ({ detail }) => {
            this.#follow.innerText = this.#follow.classList.toggle('d', detail) ? '已追番' : '追番';
        });
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        this.#identify();
        switch (router) {
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
                        .then(async ({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            this.#ssid || (this.#ssid = data.season_id);
                            this.#epid || (data.user_status.progress?.last_ep_id && (this.#epid = data.user_status.progress?.last_ep_id));
                            let ep: IEpisode | IModulePositiveEpisode | undefined;
                            data.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        if (!ep) {
                                            this.#epid || (this.#epid = d.data.episodes[0]?.ep_id);
                                            if (this.#epid) {
                                                ep = d.data.episodes.find(d => d.ep_id === this.#epid);
                                            }
                                        }
                                        break;
                                    }
                                }
                            });
                            if (!ep) {
                                if (this.#ssid) {
                                    const { code, message, result } = await pgcSection(this.#ssid);
                                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                                    const eps = (<IEpisode[]>[]).concat(...(result.main_section?.episodes || []), ...result.section.map(d => d.episodes));
                                    ep = this.#epid ? eps.find(d => d.id === this.#epid) : eps[0];
                                    eps.forEach(d => Element.add('label', { appendTo: this.#episodeList, innerHTML: `<input type="radio" name="epid" value="${d.id}"${d.id === this.#epid ? ' checked' : ''}><div class="ep-index${isNaN(+d.title) ? '' : ` d`}">${d.title}</div><div class="ep-title">${d.long_title}</div>${d.badge_info.text ? `<div class="mark" style="background-color: light-dark(${d.badge_info.bg_color},${d.badge_info.bg_color_night});">${d.badge_info.text}</div>` : ''}` }));
                                } else {
                                    throw new ReferenceError('番剧信息里未包含有效分集列表？', { cause: { code, message, data } });
                                }
                            }
                            if (!ep) throw new ReferenceError('番剧信息里未包含有效分集列表？', { cause: { code, message, data } });
                            this.#left.innerHTML = https(`<a href="/bangumi/media/md${data.media_id}" target="_blank"><img src="${data.cover}@.webp"></a>`);
                            this.#title.insertAdjacentHTML('afterbegin', `<a class="name" href="/bangumi/media/md${data.media_id}" target="_blank">${data.title}${data.rating ? `<div class="score" data-score="${data.rating.score}">分</div><div class="count">${Format.carry(data.rating.count)}人评分</div>` : ''}</a>`);
                            for (const module of data.modules) {
                                switch (module.style) {
                                    case "positive": {
                                        module.data.episodes.forEach(d => Element.add('label', { appendTo: this.#episodeList, innerHTML: `<input type="radio" name="epid" value="${d.ep_id}"${d.ep_id === this.#epid ? ' checked' : ''}><div class="ep-index${isNaN(+d.title) ? '' : ` d`}">${d.title}</div><div class="ep-title">${d.long_title}</div>${d.badge_info.text ? `<div class="mark" style="background-color: light-dark(${d.badge_info.bg_color},${d.badge_info.bg_color_night});">${d.badge_info.text}</div>` : ''}` }));
                                        break;
                                    }
                                    case "season": {
                                        module.data.seasons.forEach(d => Element.add('label', { appendTo: this.#ssList, innerHTML: `<input type="radio" name="ssid" value="${d.season_id}"${d.season_id === data.season_id ? ' checked' : ''}>${d.season_title}` }));
                                        break;
                                    }
                                    case "section": {
                                        module.data.episodes.forEach(d => Element.add('label', { appendTo: this.#episodeList, innerHTML: `<input type="radio" name="epid" value="${d.ep_id}"${d.ep_id === this.#epid ? ' checked' : ''}><div class="ep-index${isNaN(+d.title) ? '' : ` d`}">${d.title}</div><div class="ep-title">${d.long_title}</div>${d.badge_info.text ? `<div class="mark" style="background-color: light-dark(${d.badge_info.bg_color},${d.badge_info.bg_color_night});">${d.badge_info.text}</div>` : ''}` }));
                                        break;
                                    }
                                    case "pugv": {
                                        break;
                                    }
                                }
                            }
                            if (data.sponsor) {
                                this.#container.appendChild(this.#sponsor);
                                this.#sponsorRight.innerHTML = `<img src="//s1.hdslb.com/bfs/static/bangumi/play/asserts/chengbao.png"><div class="count">已有<span>${Format.carry(data.sponsor.total)}</span>人承包</div><button>我要承包</button>`;
                                data.sponsor.list.forEach(d => {
                                    Element.add('div', {
                                        appendTo: this.#sponsorList, innerHTML: `<div><div class="avatar"><img loading="lazy" src="${https(d.face)}" class="avatar-face"></div></div>
<div>
    <a href="//space.bilibili.com/${d.uid}" target="_blank" class="info">${d.uname}</a>
    <div class="msg"><i></i>${d.msg || 'TA并沒有留言'}</div>
</div>` });
                                });
                            }
                            this.#follow.innerText = this.#follow.classList.toggle('d', Boolean(data.user_status.follow)) ? '已追番' : '追番';
                        })
                        .catch(e => {
                            console.error(e);
                        });
                }
                break;
            }
        }
    }

    #identify = () => {
        this.#ssid = this.#epid = 0;
        this.#left.replaceChildren();
        this.#title.replaceChildren(this.#titleFunc);
        this.#ssList.replaceChildren();
        this.#episodeList.replaceChildren();
        this.#sponsor.remove();
        this.#sponsorList.replaceChildren();
    }
}