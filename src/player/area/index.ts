import { Player } from "..";
import { customElement } from "../../utils/Decorator/customElement";
import { Control } from "./control";
import { Message } from "./message";
import { Sendbar } from "./sendbar";
import { Wrap } from "./wrap";

/** 播放器主区域 */
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

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    #message: Message;

    #wrap: Wrap;

    $control: Control;

    #sendbar: Sendbar;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area');
        this.#message = this.appendChild(new Message(this.#player));
        this.#wrap = this.appendChild(new Wrap(this.#player));
        const buttom = this.appendChild(document.createElement('div'));
        buttom.classList.add('bofqi-area-contents');
        this.$control = buttom.appendChild(new Control(this.#player));
        this.#sendbar = buttom.appendChild(new Sendbar(this.#player));
    }
}