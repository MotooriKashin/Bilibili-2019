import { Player } from "../..";
import svg_24repeatoff from "../../../assets/svg/24repeatoff.svg";
import svg_24repeaton from "../../../assets/svg/24repeaton.svg";
import { customElement } from "../../../utils/Decorator/customElement";

/** 洗脑循环 */
@customElement('label')
export class Repeat extends HTMLLabelElement {

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

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'bofqi-area-repeat');
        this.innerHTML = svg_24repeatoff + svg_24repeaton;

        player.$video.addEventListener('loadstart', this.#indetify);
        player.$video.addEventListener('loadeddata', () => {
            this.classList.remove('disabled');
        });
        player.$video.addEventListener('loopchange', () => {
            this.classList.toggle('on');
        });

        this.addEventListener('click', () => {
            player.$video.loop = !player.$video.loop;
        });

        this.#indetify();
    }

    #indetify = () => {
        this.classList.add('disabled');
    }
}