import { customElement } from "../../../utils/Decorator/customElement";
import { Panel } from "./panel";
import { Record } from "./record";
import { State } from "./state";
import { Toast } from "./toast";

/** 播放器容器区域 */
@customElement('div')
export class Wrap extends HTMLDivElement {

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

    /** 播放登记信息 */
    $record = this.appendChild(new Record());

    /** 播放状态 */
    $state = this.appendChild(new State());

    /** 播放幕布 */
    $panel = this.appendChild(new Panel());

    /** 浮窗通知 */
    $toast = this.appendChild(new Toast());

    constructor() {
        super();

        this.classList.add('bofqi-area-wrap');
    }
}