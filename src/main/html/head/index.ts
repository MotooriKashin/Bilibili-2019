import { customElement } from "../../../utils/Decorator/customElement";

/** 路由页面`head` */
@customElement('head')
export class Head extends HTMLHeadElement {

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
    // connectedCallback(){}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    constructor() {
        super();

        this.innerHTML = `<meta charset="utf-8" />
<title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
<link rel="icon" href="//www.bilibili.com/favicon.ico" />
<link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩" />`;
    }
}