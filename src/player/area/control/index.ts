import { customElement } from "../../../utils/Decorator/customElement";
import { ClosedCaption } from "./closed-caption";
import { Danmaku } from "./danmaku";
import { Fullscreen } from "./fullscreen";
import { FullscreenWeb } from "./fullscreen-web";
import { Next } from "./next";
import { Pip } from "./pip";
import { Progress } from "./progress";
import { Quality } from "./quality";
import { Repeat } from "./repeat";
import { Time } from "./time";
import { Toggle } from "./toggle";
import { Volume } from "./volume";
import { Wide } from "./wide";

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

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 播放器播放暂停控制 */
    $play = this.appendChild(new Toggle());

    /** 播放器下一视频控制 */
    $next = this.appendChild(new Next());

    /** 进度条 */
    $progress = this.appendChild(new Progress());

    /** 播放器时间轴显示 */
    $time = this.appendChild(new Time());

    /** 播放器音量控制 */
    $volume = this.appendChild(new Volume());

    /** 播放器画质控制 */
    $quality = this.appendChild(new Quality());

    /** 播放器弹幕控制 */
    $danmaku = this.appendChild(new Danmaku());

    /** 播放器字幕控制 */
    $closedCaption = this.appendChild(new ClosedCaption());

    /** 播放器洗脑循环控制 */
    $repeat = this.appendChild(new Repeat());

    /** 播放器宽屏控制 */
    $wide = this.appendChild(new Wide());

    /** 播放器全屏控制 */
    $fullscreen = this.appendChild(new Fullscreen());

    /** 播放器网页全屏控制 */
    $fullscreenWeb = this.appendChild(new FullscreenWeb());

    /** 播放器画中画控制 */
    $pip = this.appendChild(new Pip());

    constructor() {
        super();

        this.classList.add('bofqi-area-control');
    }
}