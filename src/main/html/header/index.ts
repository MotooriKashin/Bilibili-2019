import svg_bilibili_tv from "../../../assets/svg/bilibili-tv.svg";
import svg_Navbar_mobile from "../../../assets/svg/Navbar_mobile.svg";
import { header, ISplitLayer } from "../../../io/com/bilibili/api/x/web-show/page/header";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { https } from "../../../utils/https";
import { MAIN_EVENT, mainEv } from "../../event";
import { ROUTER } from "../../router";
import channelList from "./channel-list.json";
import navGif from "./nav-gift.json"
import stylesheet from "./index.css" with {type: 'css'};
import { Format } from "../../../utils/fomat";
import { online } from "../../../io/com/bilibili/api/x/web-interface/online";
import { Avatar } from "./avatar";
import { Message } from "./message";
import { Dynamic } from "./dynamic";
import { Toview } from "./toview";
import { Favorite } from "./favorite";
import { History } from "./history";
import { Ulink } from "./ulink";
import { Search } from "./search";

/** 顶栏模块 */
@customElement(undefined, `header-${Date.now()}`)
export class Header extends HTMLElement {

    #host = this.attachShadow({ mode: 'closed' });

    #banner = Element.add('div', { class: 'head-banner', appendTo: this.#host });

    #nav = Element.add('div', { class: 'nav-menu', appendTo: this.#host });

    #navWarp = Element.add('div', { class: 'nav-wrap', appendTo: this.#nav });

    #navLeft = Element.add('div', {
        class: 'nav-organ', appendTo: this.#navWarp, innerHTML: `<a href="//www.bilibili.com" title="主站" class="home">${svg_bilibili_tv}主站</a>
<a href="//game.bilibili.com" target="_blank" title="游戏中心">游戏中心</a>
<a href="//live.bilibili.com" target="_blank" title="直播">直播</a>
<a href="//show.bilibili.com/platform/home.html" target="_blank" title="会员购">会员购</a>
<a href="//manga.bilibili.com" target="_blank" title="漫画">漫画</a>
<a href="//www.bilibili.com/v/game/match/" target="_blank" title="赛事">赛事</a>
<a href="//app.bilibili.com" target="_blank" title="下载APP" class="mobile">${svg_Navbar_mobile}下载APP</a>`
    });

    #navRight = Element.add('div', {
        class: 'nav-organ', appendTo: this.#navWarp, innerHTML: `<a href="//account.bilibili.com/account/big" target="_blank">大会员</a>
<a class="message" href="//message.bilibili.com" target="_blank" title="消息">消息</a>
<a class="dynamic" href="//t.bilibili.com" target="_blank">动态</a>
<a class="toview" href="//www.bilibili.com/watchlater/#/list" target="_blank">稍后再看</a>
<a class="favorite" href="//space.bilibili.com/favlist" target="_blank">收藏</a>
<a class="history" href="//www.bilibili.com/account/history" target="_blank">历史</a>
<a href="//member.bilibili.com/v2#/home" target="_blank">创作中心</a>
<a class="u-link" href="//member.bilibili.com/v2#/upload/video/frame" target="_blank">投稿</a>`
    });

    #avatar = this.#navRight.insertAdjacentElement('afterbegin', new Avatar());

    #message = this.#navRight.appendChild(new Message());

    #dynamic = this.#navRight.appendChild(new Dynamic());

    #toview = this.#navRight.appendChild(new Toview());

    #favorite = this.#navRight.appendChild(new Favorite());

    #history = this.#navRight.appendChild(new History());

    #ulink = this.#navRight.appendChild(new Ulink());


    #primary = Element.add('div', { class: 'primary-menu', appendTo: this.#host });

    #menu = Element.add('div', { class: 'menu', appendTo: this.#primary });

    #gif = Element.add('a', { class: 'menu-gif', appendTo: this.#primary });

    #search = this.#primary.appendChild(new Search());

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });

        // 导航分区
        channelList.forEach(({ url, name, tid, position, sub }) => {
            const a = Element.add('a', { appendTo: this.#menu, attribute: { href: url }, innerText: name, data: { online: '...' } });
            if (position) {
                a.classList.add('position');
                a.style.setProperty('--background-position', `${position[0]}px ${position[1]}px`);
            }
            tid && (a.dataset.tid = <any>tid);
            sub && a.insertAdjacentHTML('beforeend', `<div class="sub-item">${sub.map(d => `<a href="${d.url}">${d.name}</a>`).join('')}</div>`);
        })
        // 随机推荐动图
        const gif = Format.subArray(navGif);
        this.#gif.target = "_blank";
        this.#gif.href = gif.links[0];
        this.#gif.innerHTML = `<img loading="lazy" src=${gif.icon}>`;
        this.#gif.title = gif.title;

        // 获取各分区在线人数
        online()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                const online = data.region_count;
                Array.from(this.#menu.childNodes).forEach(d => {
                    const tid = (<HTMLElement>d).dataset.tid;
                    if (tid && online[<any>tid]) {
                        (<HTMLElement>d).dataset.online = online[<any>tid] > 999 ? '999+' : <any>online[<any>tid];
                    }
                })
            }).catch(e => {
                console.error('获取在线人数失败', e)
            });
    }

    #resource_id = 0;

    set $resource_id(v: number) {
        if (this.#resource_id !== v) {
            this.#resource_id = v;
            header(v)
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    this.#banner.style.backgroundImage = `url(${https(data.pic)}@.webp)`;
                    // 使用动画资源
                    const animatedBannerConfig: ISplitLayer = JSON.parse(data.split_layer);
                    for (const { resources, scale, rotate, translate, blur, opacity } of animatedBannerConfig.layers) {
                        const div = Element.add('div', { class: 'layer', appendTo: this.#banner });
                        for (const { id, src } of resources) {
                            // const $scale = (scale?.initial || 1);
                            const $translate = [translate?.initial?.[0] || 0, translate?.initial?.[1] || 0];
                            const $blur = blur?.wrap === 'alternate' ? Math.abs(blur.initial || 0) : Math.max(0, blur?.initial || 0);
                            const x = opacity?.initial === undefined ? 1 : opacity.initial;
                            let y = Math.abs(x % 1);
                            if (Math.abs(x % 2) >= 1) {
                                y = 1 - y;
                            }
                            if (/\.(webm|mp4)$/.test(src)) {
                                const video = Element.add('video', { attribute: { src, id: <any>id }, appendTo: div },);
                                video.muted = true;
                                video.autoplay = true;
                                video.loop = true;
                                video.playsInline = true;

                                // $scale === 1 || (video.style.scale = <any>$scale);
                                ($translate[0] || $translate[1]) && (video.style.translate = `calc(100cqb / 155 * (${$translate[0]})) calc(100cqb / 155 * (${$translate[1]}))`);
                                ($blur < 1e-4) || (video.style.filter = `blur(${$blur}px)`);
                                video.style.opacity = opacity?.wrap === 'alternate' ? <any>y : <any>Math.max(0, Math.min(1, x));
                            } else {
                                const img = Element.add('img', { attribute: { src, id: <any>id }, appendTo: div },);
                                // $scale === 1 || (img.style.scale = <any>$scale);
                                ($translate[0] || $translate[1]) && (img.style.translate = `calc(100cqb / 155 * (${$translate[0]})) calc(100cqb / 155 * (${$translate[1]}))`);
                                ($blur < 1e-4) || (img.style.filter = `blur(${$blur}px)`);
                                img.style.opacity = opacity?.wrap === 'alternate' ? <any>y : <any>Math.max(0, Math.min(1, x));
                            }
                        }
                    }
                })
                .catch(e => {
                    console.error('获取顶栏 Banner 失败~', e);
                })
        }
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        switch (router) {
            default: {
                this.$resource_id = 142;
                break;
            }
        }
    }
}