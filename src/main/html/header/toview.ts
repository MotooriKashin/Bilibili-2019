import { toviewWeb } from "../../../io/com/bilibili/api/x/v2/history/toview/web";
import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { https } from "../../../utils/https";

/** 稍后再看 */
@customElement('div')
export class Toview extends HTMLDivElement {

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

    #grp = Element.add('div', { appendTo: this, class: 'grp', innerHTML: '<a href="//www.bilibili.com/watchlater/#/" target="_blank">播放全部</a><a href="//www.bilibili.com/watchlater/#/list" target="_blank">查看全部</a>' });

    constructor() {
        super();

        this.classList.add('toview-wrap');

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.isLogin) {
                    this.classList.add('d');
                    (<HTMLElement>this.parentElement!.querySelector('.toview')).addEventListener('pointerenter', () => {
                        data.mid && toviewWeb(6)
                            .then(({ code, message, data }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                                this.#list.innerHTML = https(data.list.map(d => `<a href="//www.bilibili.com/watchlater/#/av${d.aid}" target="_blank" title="${d.title}">${d.title}</a>`).join(''));
                            })
                            .catch(e => {
                                toastr.error('获取稍后再看数据出错', e);
                                console.error(e)
                            })
                    }, { once: true });
                }
            }).catch(e => {
                console.error(e);
            });
    }
}