import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Comment } from "../../comment";
import stylesheet from "./index.css" with {type: 'css'};

/** 评论区 */
@customElement(undefined, `comment-box-${Date.now()}`)
export class CommentBox extends HTMLElement {

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

    #comment = new Comment();

    #box = Element.add('div', { class: 'comment-box', appendTo: this.#host, children: this.#comment });

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];
    }
}