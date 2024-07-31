import { customElement } from "../../../utils/Decorator/customElement";
import { PLAYER_EVENT, ev } from "../../event-target";

/** 弹幕数及播放人数信息 */
@customElement('div')
export class Number extends HTMLDivElement {

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

    #count = 0;

    /** 观看人数 */
    set $count(v: number) {
        this.dataset.count = `${(this.#count = v) || '-'}`;
    }

    #danmaku = 0;

    /** 弹幕数 */
    set $danmaku(v: number) {
        this.dataset.danmaku = `${(this.#danmaku += v) || '-'}条弹幕`;
    }

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-info-number');

        this.textContent = '人正在观看，';
        this.dataset.count = '-';
        this.dataset.danmaku = '-条弹幕';

        ev.bind(PLAYER_EVENT.DANMAKU_ADD, ({ detail }) => {
            this.$danmaku = detail.length;
        });
        ev.bind(PLAYER_EVENT.DANMAKU_IDENTIFY, this.identify);
        ev.bind(PLAYER_EVENT.IDENTIFY, this.identify);
    }

    private identify = () => {
        this.$count = 0;
        this.$danmaku = this.#danmaku = 0;
    }
}