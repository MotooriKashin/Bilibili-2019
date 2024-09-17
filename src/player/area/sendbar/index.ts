import { Player } from "../..";
import { customElement } from "../../../utils/Decorator/customElement";
import { ev, PLAYER_EVENT } from "../../event";
import { DanmakuChoose } from "./choose";
import { DanmakuColor } from "./color";
import { DanmakuInput } from "./input/input";

/** 播放器弹幕发送区域 */
@customElement('div')
export class Sendbar extends HTMLDivElement {

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

    #choose: DanmakuChoose;

    #color: DanmakuColor;

    #input: DanmakuInput;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-sendbar');
        this.#choose = this.appendChild(new DanmakuChoose(player));
        this.#color = this.appendChild(new DanmakuColor(player));
        this.#input = this.appendChild(new DanmakuInput(player));

        this.#input.addEventListener('submit', e => {
            const d = new FormData(this.#input);
            const i = <string>d.get('danmaku');
            i && ev.trigger(PLAYER_EVENT.DANMAKU_INPUT, {
                msg: i,
                progress: Math.ceil(player.$video.currentTime * 1e3),
                color: this.#color.$value,
                fontsize: this.#choose.$size,
                pool: this.#choose.$pool,
                mode: this.#choose.$mode,
            });
            e.preventDefault();
            this.#input.$input.value = '';
        });
    }
}

export interface IDanmakuInput {
    /** 弹幕内容（长度小于 100 字符） */
    msg: string;
    /** 弹幕出现在视频内的时间：/毫秒 */
    progress: number;
    /** 弹幕颜色,十进制 RGB888 值 */
    color?: number;
    /** 弹幕字号 */
    fontsize?: number;
    /**
     * 弹幕池
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 普通弹幕 | 字幕弹幕 | 特殊弹幕 |
     */
    pool?: 0 | 1 | 2;
    /**
     * 弹幕模式
     * | 1 | 4 | 5 | 6 | 7 | 8 | 9 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 普通 | 底部 | 顶部 | 逆向 | 高级 | 代码 | BAS |
     */
    mode?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * | 1 | 2 |
     * | :-: | :-: |
     * | 视频 | 漫画 |
     */
    type?: 1 | 2;
    /** 专属渐变彩色 */
    colorful?: 60001;
    /**
     * 是否带 UP 身份标识
     * | 0 | 4 |
     * | :-: | :-: |
     * | 普通 | 带有标识 |
     */
    checkbox_type?: 0 | 4;
}