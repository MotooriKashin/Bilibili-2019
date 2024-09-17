import { Player } from "..";
import { customElement } from "../../utils/Decorator/customElement";
import { ev, PLAYER_EVENT } from "../event";
import { Block } from "./block";
import { Danmaku } from "./danmaku";
import { Filter } from "./filter";
import { Info } from "./info";
import { Recommend } from "./recommend";

/** 播放器辅助区域 */
@customElement('div')
export class Auxiliary extends HTMLDivElement {

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

    $info: Info;

    $filter: Filter;

    $recommend = new Recommend();

    #danmaku: Danmaku;

    #block = new Block();

    /** 当前播放列表 */
    #currentList?: HTMLDivElement;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-auxiliary');
        this.$info = this.appendChild(new Info(player));
        this.$filter = this.appendChild(new Filter(player));
        this.#danmaku = new Danmaku(player);

        ev.bind(PLAYER_EVENT.AUXILIARY_FILTER, ({ detail }) => {
            switch (detail) {
                case 1: {
                    this.#currentList ? this.#currentList.replaceWith(this.#danmaku) : this.appendChild(this.#danmaku);
                    this.#currentList = this.#danmaku;
                    break;
                }
                case 2: {
                    this.#currentList ? this.#currentList.replaceWith(this.#block) : this.appendChild(this.#block);
                    this.#currentList = this.#block;
                    break;
                }
                default: {
                    this.#currentList ? this.#currentList.replaceWith(this.$recommend) : this.appendChild(this.$recommend);
                    this.#currentList = this.$recommend;
                    break;
                }
            }
        });
    }
}