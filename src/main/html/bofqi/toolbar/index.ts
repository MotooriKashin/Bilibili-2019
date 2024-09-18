import { toviewWeb } from "../../../../io/com/bilibili/api/x/v2/history/toview/web";
import { relation } from "../../../../io/com/bilibili/api/x/web-interface/archive/relation";
import { nav } from "../../../../io/com/bilibili/api/x/web-interface/nav";
import { detail } from "../../../../io/com/bilibili/api/x/web-interface/view/detail";
import { toastr } from "../../../../toastr";
import { AV } from "../../../../utils/av";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";
import { Format } from "../../../../utils/fomat";
import { mainEv, MAIN_EVENT } from "../../../event";
import { ROUTER } from "../../../router";

/** 播放器主区域 */
@customElement('div')
export class Toolbar extends HTMLDivElement {

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
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #shre = Element.add('div', { appendTo: this, class: "share-box" });

    #shareText = Element.add('div', {
        appendTo: this.#shre, class: "s-text", innerHTML: `<span class="t">分享</span><span class="num"></span><i class="icon"></i>`
    });

    #shareBtn = Element.add('div', {
        appendTo: this.#shre, class: "share-btn", innerHTML: `<i title="分享到动态" class="dynmic"></i>
<i title="分享到新浪微博" class="weibo"></i>
<i title="分享到QQ空间" class="zone"></i>
<i title="分享到QQ" class="qq"></i>
<i title="分享到百度贴吧" class="baidu"></i>`
    });

    #sharePopup = Element.add('div', {
        appendTo: this.#shre, class: "share-popup", innerHTML: `<div class="share-address">
	<span class="t">将视频贴到博客或论坛</span>
	<div class="item"><span class="name">视频地址</span><input id="link0" readonly><button id="link-btn-0">复制</button></div>
	<div class="item"><span class="name">嵌入代码</span><input id="link2" readonly><button id="link-btn-2">复制</button></div>
</div>
<div class="or-code">
	<span class="t">微信扫一扫分享</span>
	<div class="or-code-pic"></div>
</div>` });

    #favBox = Element.add('div', { appendTo: this, class: ['fav', 'box'] });

    #coinBox = Element.add('div', { appendTo: this, class: ['coin', 'box'] });

    #waitBox = Element.add('div', { appendTo: this, class: ['wait', 'box'], innerHTML: '<div><span>稍后再看</span><span>马克一下~</span></div>' });

    #appBox = Element.add('a', { appendTo: this, class: ['app', 'box'], attribute: { href: '//app.bilibili.com', target: "_blank" }, innerHTML: '<div><span>用手机看</span><span>转移阵地~</span></div>' });

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
                            this.#favBox.classList.toggle('d', Boolean(favorite));
                            this.#coinBox.classList.toggle('d', Boolean(coin));
                        })
                        .catch(e => {
                            toastr.error('获取互动状态出错', e);
                            console.error(e);
                        });
                }
            })
            .catch(console.error);
    }

    constructor() {
        super();

        this.classList.add('toolbar');
        this.#shre.insertAdjacentHTML('afterend', '<div class="tb-line"></div>');

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });
        mainEv.bind(MAIN_EVENT.RELATION_FLASH, () => {
            this.$aid = this.#aid;
        });

        this.#shre.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLButtonElement) {
                switch (target.id) {
                    case 'link-btn-0': {
                        navigator.clipboard.writeText(this.#sharePopup.querySelector<HTMLInputElement>('#link0')!.value)
                            .then(() => {
                                toastr.success('已成功复制到剪切板')
                            })
                            .catch(e => {
                                toastr.error('复制失败', e);
                                console.error(e);
                            })
                        break;
                    }
                    case 'link-btn-2': {
                        navigator.clipboard.writeText(this.#sharePopup.querySelector<HTMLInputElement>('#link2')!.value)
                            .then(() => {
                                toastr.success('已成功复制到剪切板')
                            })
                            .catch(e => {
                                toastr.error('复制失败', e);
                                console.error(e);
                            })
                        break;
                    }
                }
            }
        });
        this.#favBox.addEventListener('click', () => {
            mainEv.trigger(MAIN_EVENT.REQUEST_FAV, void 0);
        });
        this.#coinBox.addEventListener('click', () => {
            this.#coinBox.classList.contains('d') || mainEv.trigger(MAIN_EVENT.REQUSET_COIN, void 0);
        });
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        switch (router) {
            case ROUTER.AV: {
                this.classList.remove('hide');
                const path = url.pathname.split('/');
                let aid = 0, cid = 0;
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
                const p = Number(new URLSearchParams(url.search).get('p')) || 1;
                if (aid) {
                    detail(aid)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            // 视频信息
                            const { View } = data;
                            cid = View.pages[p - 1].cid;
                            this.#shareText.querySelector<HTMLSpanElement>('.num')!.textContent = <string>Format.carry(View.stat.share);
                            this.#sharePopup.querySelector<HTMLInputElement>('#link0')!.value = `https://www.bilibili.com/video/av${aid}/`;
                            this.#sharePopup.querySelector<HTMLInputElement>('#link2')!.value = `<iframe src="//player.bilibili.com/player.html?aid=${aid}&cid=${cid}&page=${p}"></iframe>`;
                            this.#favBox.innerHTML = `<div><span>收藏</span><span>${Format.carry(View.stat.favorite)}</span></div>`;
                            this.#coinBox.innerHTML = `<div><span>投币</span><span>${Format.carry(View.stat.coin)}</span></div>`;
                            this.$aid = aid;
                        })
                        .catch(e => {
                            toastr.error('获取视频信息失败', e);
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
                        .catch(e => {
                            toastr.error('请求稍后再看信息错误~', e);
                            console.error(e);
                        });
                }
                break;
            }
            default: {
                this.classList.add('hide');
                break
            }
        }
    }
}