import { locs } from "../../../io/com/bilibili/api/x/web-show/res/locs";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 推广 */
@customElement('div')
export class Popularize extends HTMLDivElement {

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

    #left = Element.add('div', { appendTo: this, class: ['left', 'zone'], innerHTML: '<div class="headline"><span class="name">推广</span></div>' });

    #right = Element.add('div', { appendTo: this, class: 'right', innerHTML: '<a href="/video/online.html" target="_blank" title="在线列表" class="online">在线列表</a>' });

    #box = Element.add('div', { appendTo: this.#left, class: 'storey-box' });

    constructor() {
        super();

        this.classList.add('module', 'popularize');

        locs(34)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                const popularize = data[34];
                this.#box.innerHTML = https(popularize.filter(d => !d.ad_cb && !d.null_frame).map(d => `<a target="_blank" href="${d.archive ? `/video/av${d.archive.aid}` : d.url}">
    <img loading="lazy" src="${d.pic}@.webp" alt="${d.name}">
    ${d.archive ? `<div class="mask"></div><span class="dur">${Format.fmSeconds(d.archive.duration)}</span>` : ''}
    <p title="${d.name}">${d.name}</p>
    ${d.archive ? `<i class="wl" data-aid="${d.archive.aid}" title="稍后再看"></i>` : ''}
</a>`).join(''));
            })
            .catch(e => {
                toastr.error('获取推广位失败', e);
                console.error(e);
            });
    }
}