import { Player } from "../..";
import svg_12sent from "../../../assets/svg/12sent.svg";
import { customElement } from "../../../utils/Decorator/customElement";

/** 播放器消息区域 */
@customElement('div')
export class Message extends HTMLDivElement {

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

    #prev = this.appendChild(document.createElement('div'));

    #panel = this.appendChild(document.createElement('div'));

    #next = this.appendChild(document.createElement('div'));

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-message');
        this.#prev.classList.add('bofqi-message-prev');
        this.#prev.innerHTML = svg_12sent;
        this.#panel.classList.add('bofqi-message-panel');
        this.#next.classList.add('bofqi-message-next');
        this.#next.innerHTML = svg_12sent;
    }
}