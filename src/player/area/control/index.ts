import { Player } from "../..";
import { customElement } from "../../../utils/Decorator/customElement";
import { Danmaku } from "./danmaku";
import { Next } from "./next";
import { Progress } from "./progress";
import { Quality } from "./quality";
import { Repeat } from "./repeat";
import { ScreenFull } from "./screen-full";
import { ScreenPip } from "./screen-pip";
import { ScreenWeb } from "./screen-web";
import { ScreenWide } from "./screen-wide";
import { Subtitle } from "./subtitle";
import { Time } from "./time";
import { Toggle } from "./toggle";
import { Volume } from "./volume";

/** 播放器控制区域 */
@customElement('div')
export class Control extends HTMLDivElement {

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

    #toggle: Toggle;

    #next: Next;

    $progress: Progress;

    #time: Time;

    #volume: Volume;

    $quality: Quality;

    #danmaku: Danmaku;

    $subtitle: Subtitle;

    #repeat: Repeat;

    #screenWide: ScreenWide;

    #screenFull: ScreenFull;

    #screenWeb: ScreenWeb;

    #screenPip: ScreenPip;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control');
        this.#toggle = this.appendChild(new Toggle(player));
        this.#next = this.appendChild(new Next(player));
        this.$progress = this.appendChild(new Progress(player));
        this.#time = this.appendChild(new Time(player));
        this.#volume = this.appendChild(new Volume(player));
        this.$quality = this.appendChild(new Quality(player));
        this.#danmaku = this.appendChild(new Danmaku(player));
        this.$subtitle = this.appendChild(new Subtitle(player));
        this.#repeat = this.appendChild(new Repeat(player));
        this.#screenWide = this.appendChild(new ScreenWide(player));
        this.#screenFull = this.appendChild(new ScreenFull(player));
        this.#screenWeb = this.appendChild(new ScreenWeb(player));
        this.#screenPip = this.appendChild(new ScreenPip(player));
    }
}