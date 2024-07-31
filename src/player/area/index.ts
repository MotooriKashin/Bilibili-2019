import { customElement } from "../../utils/Decorator/customElement";
import { Control } from "./control";
import { Message } from "./message";
import { Sendbar } from "./sendbar";
import { Wrap } from "./wrap";

/** 播放器区域 */
@customElement('div')
export class Area extends HTMLDivElement {

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

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 播放器通知区域 */
    $message = this.appendChild(new Message());

    /** 播放器容器区域 */
    $wrap = this.appendChild(new Wrap());

    /** 播放器控制区域 */
    $control = this.appendChild(new Control());

    /** 播放器发送区域 */
    $sendbar = this.appendChild(new Sendbar());

    constructor() {
        super();

        this.classList.add('bofqi-area');
    }
}