import { medialistRecent } from "../../../io/com/bilibili/api/medialist/gateway/coll/resource/recent";
import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";

/** 收藏 */
@customElement('div')
export class Favorite extends HTMLDivElement {

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

    #grp = Element.add('a', { appendTo: this, class: 'grp', innerText: '查看更多', attribute: { target: '_blank' } });

    constructor() {
        super();

        this.classList.add('favorite-wrap');

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.isLogin) {
                    this.classList.add('d');
                    const p = <HTMLAnchorElement>this.parentElement!.querySelector('.favorite')!;
                    p.href = this.#grp.href = `//space.bilibili.com/${data.mid}/favlist`;
                    p.addEventListener('pointerenter', () => {
                        data.mid && medialistRecent()
                            .then(({ code, message, data }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                                this.#list.innerHTML = data.map(d => `<a href="//www.bilibili.com/video/av${d.id}" target="_blank" title="${d.title}">${d.title}</a>`).join('');
                            })
                            .catch(e => {
                                toastr.error('获取收藏数据出错', e);
                                console.error(e)
                            });
                    }, { once: true });
                }
            }).catch(e => {
                console.error(e);
            });
    }
}