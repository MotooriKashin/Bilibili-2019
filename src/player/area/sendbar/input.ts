import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";

/** 弹幕发送 */
@customElement('div')
export class DanmakuInput extends HTMLDivElement {

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

    /** 输入框 */
    private $input = Element.add('input', { class: 'sendbar-input', placeholder: '您可以在这里输入弹幕吐槽哦~' }, this);

    /** 提示词 */
    private $hint = Element.add('div', { class: 'sendbar-hint' }, this, '弹幕礼仪 >');

    /** 发送 */
    private $send = Element.add('button', { class: 'sendbar-send bpui-button' }, this, '发送 >');

    /** 弹幕内容 */
    $value = '';

    constructor() {
        super();

        this.classList.add('bofqi-area-sendbar-input');

        this.$input.required = true;
        this.$input.maxLength = 100;

        this.$send.addEventListener('click', this.send);
        this.$input.addEventListener('keypress', e => {
            if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key === 'Enter') {
                this.$send.click();
            }
        });
    }

    /** 发送弹幕 */
    private send = () => {
        if (this.$input.reportValidity()) {
            this.$value = '';
            this.dispatchEvent(new Event('send'));
            this.$input.value = '';
        }
    }
}