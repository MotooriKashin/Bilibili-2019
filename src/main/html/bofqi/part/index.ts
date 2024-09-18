import { pagelist } from "../../../../io/com/bilibili/api/x/player/pagelist";
import { toviewWeb } from "../../../../io/com/bilibili/api/x/v2/history/toview/web";
import { AV } from "../../../../utils/av";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";
import { mainEv, MAIN_EVENT } from "../../../event";
import { ROUTER } from "../../../router";

/** 播放器主区域 */
@customElement('div')
export class Part extends HTMLDivElement {

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

    #list = Element.add('div', { class: 'list', appendTo: this });

    #more = Element.add('div', { class: 'more', appendTo: this, innerText: '展开' });

    constructor() {
        super();

        this.classList.add('multi-page');

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });

        this.#list.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLDivElement) {
                const { url, router } = target.dataset;
                if (url && router) {
                    mainEv.trigger(MAIN_EVENT.NAVIGATE, [+router, new URL(url, location.origin)]);
                    history.replaceState(undefined, '', url);
                }
            }
        });
        this.#more.addEventListener('click', () => {
            this.#more.textContent = this.#list.classList.toggle('span') ? '收起' : '展开';
        })
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        this.identify();
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
                    pagelist(aid)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            const p = Number(new URLSearchParams(url.search).get('p')) || 1;
                            if (data.length > 1) {
                                data.forEach((d, i) => {
                                    const a = Element.add('div', { attribute: { title: d.part }, innerText: `${d.page}、${d.part}`, appendTo: this.#list, data: { url: `/video/av${aid}/?p=${d.page}`, router: <any>router } });
                                    i === p - 1 && a.classList.add('active');
                                });
                                this.#more.classList.toggle('active', this.#list.scrollHeight > 25);
                            }
                        })
                        .catch(e => {
                            console.error('获取分P数据失败~', e)
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
                const p = +path[2]?.slice(1) || 1;
                toviewWeb()
                    .then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        aid || (aid = data.list[0].aid);
                        const { pages } = data.list.find(d => d.aid === aid) || data.list[0];
                        if (pages.length > 1) {
                            pages.forEach((d, i) => {
                                const a = Element.add('div', { attribute: { title: d.part }, innerText: `${d.page}、${d.part}`, appendTo: this.#list, data: { url: `https://www.bilibili.com/watchlater/#/av${aid}/p${d.page}`, router: <any>router } });
                                i === p - 1 && a.classList.add('active');
                            });
                            this.#more.classList.toggle('active', this.#list.scrollHeight > 25);
                        }
                    })
                    .catch(e => {
                        console.error('获取分P数据失败~', e)
                    });
                break;
            }
        }
    }

    private identify() {
        this.#list.replaceChildren();
        this.#more.classList.remove('active');
        this.#list.classList.remove('span');
        this.#more.textContent = '展开';
    }
}