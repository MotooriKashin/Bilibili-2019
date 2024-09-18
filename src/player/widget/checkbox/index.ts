import { customElement } from "../../../utils/Decorator/customElement";

/**
 * 带标签的复选框  
 * 支持更改以下属性：
 *    - $prev 是否移动标签到复选框前
 *    - $text 标签的文本
 *    - $value 复选框是否选中
 * 
 */
@customElement('label')
export class Checkbox extends HTMLLabelElement {

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
    // attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // }

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 复选框 */
    #input = this.appendChild(document.createElement('input'));

    /** 标签 */
    #label = this.appendChild(document.createTextNode(''));

    #prev = false;

    get $prev() {
        return this.#prev;
    }

    set $prev(v) {
        this.#prev = v;
        this.insertAdjacentElement(v ? 'beforeend' : 'afterbegin', this.#input);
    }

    get $text() {
        return this.#label.textContent;
    }

    set $text(v) {
        this.#label.textContent = v;
    }

    get $value() {
        return this.#input.checked;
    }

    set $value(v) {
        this.#input.checked = v;
    }

    get $disabled() {
        return this.#input.disabled;
    }

    set $disabled(v) {
        this.#input.disabled = v;
    }

    constructor() {
        super();

        this.classList.add('bpui-checkbox');
        this.#input.type = 'checkbox';
    }
}