import { customElement } from "../../utils/Decorator/customElement";
import { PLAYER_EVENT, ev } from "../event-target";
import { Block } from "./block";
import { Danmaku } from "./danmaku";
import { Filter } from "./filter";
import { Info } from "./info";
import { Recommend } from "./recommend";

/** 播放器右侧面板 */
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

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 播放信息栏 */
    $info = this.appendChild(new Info());

    /** 播放列表控制栏 */
    $filter = this.appendChild(new Filter());

    /** 当前播放列表 */
    $currentList?: HTMLDivElement;

    /** 推荐列表 */
    $recommend = new Recommend();

    /** 弹幕列表 */
    $danmaku = new Danmaku();

    /** 屏蔽列表 */
    $block = new Block();

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary');
        ev.bind(PLAYER_EVENT.AUXILIARY_FILTER, ({ detail }) => {
            switch (detail) {
                case 1: {
                    this.$currentList ? this.$currentList.replaceWith(this.$danmaku) : this.appendChild(this.$danmaku);
                    this.$currentList = this.$danmaku;
                    break;
                }
                case 2: {
                    this.$currentList ? this.$currentList.replaceWith(this.$block) : this.appendChild(this.$block);
                    this.$currentList = this.$block;
                    break;
                }
                default: {
                    this.$currentList ? this.$currentList.replaceWith(this.$recommend) : this.appendChild(this.$recommend);
                    this.$currentList = this.$recommend;
                    break;
                }
            }
        });
    }
}