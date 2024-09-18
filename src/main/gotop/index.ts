import { customElement } from "../../utils/Decorator/customElement";
import stylesheet from "./index.css" with {type: 'css'};

/** 评论区 */
@customElement(undefined, `go-top-${Date.now()}`)
export class Gotop extends HTMLElement {

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

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];
        this.#host.innerHTML = `<div class="gotop"></div>`;
        CSS.registerProperty({
            name: "--scroll-positon",
            syntax: "<number>",
            inherits: true,
            initialValue: "0",
        });

        this.addEventListener('click', () => {
            self.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }
}