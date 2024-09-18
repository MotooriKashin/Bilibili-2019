import { Player } from "../../..";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";

/** 弹幕输入 */
@customElement('form')
export class DanmakuInput extends HTMLFormElement {

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
    connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() { }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    $input = Element.add('input', { appendTo: this });

    #hint = Element.add('div', { class: 'sendbar-hint', appendTo: this, innerText: '弹幕礼仪 >' });

    #submit = Element.add('button', { class: 'bpui-button', appendTo: this, innerText: '发送 >' });

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-sendbar-input');
        this.autocomplete = 'off';
        this.$input.placeholder = '您可以在这里输入弹幕吐槽哦~';
        this.$input.name = 'danmaku';
        this.$input.required = true;
        this.$input.maxLength = 100;
    }
}