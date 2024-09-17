import { Player } from "../..";
import { customElement } from "../../../utils/Decorator/customElement";
import { ev, PLAYER_EVENT } from "../../event";

/** 播放器数据 */
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

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    #watch = this.appendChild(document.createElement('span'));

    #danmaku = this.appendChild(document.createElement('span'));

    #dm = 0;

    /** 设定观看人数 */
    set $watch(v: number | string) {
        this.#watch.dataset.num = <any>v || '-';
    }

    /** 设定弹幕数 */
    set $danmaku(v: number) {
        this.#danmaku.dataset.num = <any>(this.#dm += v) || '-';
    }

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-info-number');
        this.#watch.textContent = '人正在观看，';
        this.#danmaku.textContent = '条弹幕';

        ev.bind(PLAYER_EVENT.DANMAKU_ADD, ({ detail }) => {
            this.$danmaku = detail.length;
        });
        ev.bind(PLAYER_EVENT.DANMAKU_IDENTIFY, () => {
            this.#dm = 0;
            this.$danmaku = 0;
        });
        ev.bind(PLAYER_EVENT.OTHER_IDENTITY, () => {
            this.$watch = 0;
        });
        ev.bind(PLAYER_EVENT.ONLINE_NUMBER, ({ detail }) => {
            const { count } = detail;
            this.$watch = count;
        });

        this.$danmaku = 0;
        this.$watch = 0;
    }
}