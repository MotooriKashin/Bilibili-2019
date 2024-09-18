import { customElement } from "../../../utils/Decorator/customElement";

/** 投稿 */
@customElement('div')
export class Ulink extends HTMLDivElement {

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

    constructor() {
        super();

        this.classList.add('u-link-wrap');
        this.innerHTML = `<a class="i-art" href="//member.bilibili.com/v2#/upload/text/apply" target="_blank">专栏投稿</a>
<a class="i-ap" href="//member.bilibili.com/v2#/upload/audio/" target="_blank">音频投稿</a>
<a class="i-vp" href="//member.bilibili.com/v2#/upload/video/frame" target="_blank">视频投稿</a>
<a class="i-vm" href="//member.bilibili.com/v2#/upload-manager/article" target="_blank">投稿管理</a>`;
    }
}