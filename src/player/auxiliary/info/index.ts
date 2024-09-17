import { Player } from "../..";
import { customElement } from "../../../utils/Decorator/customElement";
import { More } from "./more";
import { Number } from "./number";
import { Setting } from "./setting";

/** 播放器信息区域 */
@customElement('div')
export class Info extends HTMLDivElement {

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

    #number: Number;

    #more: More;

    $setting: Setting;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-info');
        this.#number = this.appendChild(new Number(player));
        this.#more = this.appendChild(new More(player));
        this.$setting = this.appendChild(new Setting(player));
    }
}