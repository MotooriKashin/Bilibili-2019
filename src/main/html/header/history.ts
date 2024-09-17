import { history } from "../../../io/com/bilibili/api/x/v2/history";
import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { https } from "../../../utils/https";

/** 历史记录 */
@customElement('div')
export class History extends HTMLDivElement {

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
    // disconnectedCallback() { }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #list = Element.add('div', { appendTo: this, class: 'list' });

    #grp = Element.add('a', { appendTo: this, class: 'grp', innerText: '查看更多', attribute: { target: '_blank', href: '//www.bilibili.com/account/history' } });

    constructor() {
        super();

        this.classList.add('history-wrap');

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.isLogin) {
                    this.classList.add('d');
                    (<HTMLElement>this.parentElement!.querySelector('.history')).addEventListener('pointerenter', () => {
                        if (data.mid) {
                            const t = new Date();
                            const now = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
                            const pasts: string[] = [];
                            history()
                                .then(({ code, message, data }) => {
                                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                                    this.#list.innerHTML = https(data.map(d => {
                                        const past = this.past(now - d.view_at * 1e3);
                                        const label = pasts.includes(past);
                                        label || pasts.push(past);
                                        const url = new URL(d.redirect_url || d.redirect_link);
                                        d.redirect_url || (d.page && d.page.page > 1 && url.searchParams.set('p', <any>d.page.page));
                                        d.progress > 0 && url.searchParams.set('t', <any>d.progress);
                                        return `${label ? '' : `<div class="timeline"><span>${past}</span></div>`}<a href="${url.toJSON()}" target="_blank" title="${d.title}"><div>${d.title}</div><div class="${2 === d.device ? "pc" : 1 === d.device || 3 === d.device || 5 === d.device || 7 === d.device ? "phone" : 4 === d.device || 6 === d.device ? "pad" : 33 === d.device ? "tv" : "unknown"}">${d.page && d.page.page > 1 ? `<span>第${d.page.page}P</span><span>|</span>` : ''}<span>${d.progress ? d.progress > 0 ? Math.floor(d.progress / d.duration * 100) : '100' : '1'}%</span></div></a>`;
                                    }).join(''));
                                })
                                .catch(e => {
                                    toastr.error('获取历史记录出错', e);
                                    console.error(e);
                                })
                        }
                    }, { once: true });
                }
            }).catch(e => {
                console.error(e);
            });
    }

    private past(tsp: number) {
        return tsp <= 0 ? "今日" : tsp > 0 && tsp <= 864e5 ? "昨日" : tsp > 864e5 && tsp <= 6048e5 ? "近1周" : tsp > 6048e5 && tsp <= 2592e6 ? "1周前" : tsp > 2592e6 && tsp <= 7776e6 ? "1个月前" : "last";
    }
}