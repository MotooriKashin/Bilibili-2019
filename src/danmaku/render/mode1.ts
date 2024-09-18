import { Mode } from ".";
import { Danmaku, IDanmaku } from "..";
import { customElement } from "../../utils/Decorator/customElement";

/** 一般弹幕 */
@customElement(undefined, `mode1-${Date.now()}`)
export class Mode1 extends Mode {

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
    connectedCallback() {
        this.$dm.on = true;
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.$dm.on = false;
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    static space: Mode1[][] = [];

    static identity() {
        this.space.length = 0;
    }

    constructor(
        /** 弹幕数据 */
        public $dm: IDanmaku,
        /** 弹幕管理器 */
        protected $container: Danmaku,

    ) {
        super($dm);
    }

    async execute($delay = 0) {
        this.$starttimeStamp = this.$endtimeStamp = 0;
        this.classList.add('mode1', 'pause');
        this.$container.$host.appendChild(this);

        const { clientWidth, clientHeight } = this;
        const { $speedPlus, $speedSync, $rate, $duration, $width } = this.$container;
        this.$width = clientWidth;
        this.$height = clientHeight;
        this.$duration = $duration / $speedPlus / ($speedSync ? $rate : 1) * (this.$width + $width) / (512 + this.$width);
        this.$speed = (512 + this.$width) / ($duration / $speedPlus / ($speedSync ? $rate : 1));
        this.addEventListener('animationstart', this.#animationstart, { once: true });
        this.addEventListener('animationend', this.#animationend, { once: true });
        this.style.setProperty('--duation', <any>this.$duration);
        this.style.setProperty('--dealy', <any>$delay);
        this.#space();
        this.classList.remove('pause');
        this.$wraps || this.$container.$danmakuNow++;
    }

    #animationstart = (ev: AnimationEvent) => {
        this.$starttimeStamp = ev.timeStamp;
    }

    /** 运动结束处理 */
    #animationend = (ev: AnimationEvent) => {
        this.$endtimeStamp = ev.timeStamp;
        this.remove();
        this.style.animation = '';
        this.$wraps || this.$container.$danmakuNow--;
    }

    /** 取消弹幕 */
    #cancel() {
        this.removeEventListener('animationend', this.#animationend);
        this.remove();
        this.style.animation = '';
        this.$wraps || this.$container.$danmakuNow--;
    }

    #space() {
        if (!this.$wraps) {
            const { $danmakuArea, $heightFix } = this.$container;
            for (let i = 0; i <= Mode1.space.length; i++) {
                if ($danmakuArea && i) {
                    return this.#cancel();
                }
                if (!Mode1.space[i]) {
                    // 弹幕层尚未创建，直接创建
                    const layer: Mode1[] = [];
                    layer.length = Math.ceil($heightFix);
                    layer.fill(this, 0, Math.ceil(this.$height));
                    Mode1.space.push(layer);
                    break;
                } else if (this.#layer(Mode1.space[i])) {
                    // 弹幕层可以进入
                    break;
                }
            }
        }
    }

    /**
     * 测试弹幕层可用性
     * 
     * @param layer 弹幕层
     * @returns 是否可以添加弹幕
     */
    #layer(layer: Mode1[]) {
        const { $heightFix } = this.$container;
        layer.length = Math.ceil($heightFix);
        for (let i = 0; i + this.$height < $heightFix; i += this.$height) {
            if (this.#add(layer, i, i + this.$height)) {
                return true;
            }
        }
        return false
    }

    /**
     * 尝试往弹幕层添加弹幕
     * 
     * @param layer 弹幕层
     * @param from 弹幕上限高度
     * @param to 弹幕下限高度
     * @returns 是否允许添加
     */
    #add(layer: Mode1[], from: number, to: number) {
        const set = new Set<Mode1>();
        for (let i = Math.ceil(from); i < Math.ceil(to); i++) {
            layer[i] && set.add(layer[i]);
        }
        /** 当前时间戳 */
        const timeStamp = performance.now();
        for (const pre of set) {
            if (pre.$endtimeStamp) {
                // 本行已无弹幕，安心进入
                break;
            }
            if (!pre.$starttimeStamp) {
                // 本行已有弹幕尚未出发，禁止进入
                return false;
            }
            // 计算弹幕距离
            const pauseStamp = this.#pause(pre);
            if ((timeStamp - pre.$starttimeStamp - pauseStamp) * pre.$speed <= pre.$width) {
                // 本行弹幕尚未完全显示，必定追尾，拒绝进入
                return false;
            }
            if (this.$speed <= pre.$speed) {
                // 前方弹幕快，不可能追尾，安全进入
                break;
            }
            /** 弹幕距离 */
            const distance = (timeStamp - pre.$starttimeStamp - pauseStamp) * pre.$speed - pre.$width;
            /** 剩余时间 */
            const rest = pre.$duration - (timeStamp - pre.$starttimeStamp - pauseStamp);
            /** 追及速度 */
            const dSpeed = this.$speed - pre.$speed;
            if (rest * dSpeed >= distance) {
                // 追尾距离过短，禁止进入
                return false;
            }
        }
        this.style.insetBlockStart = `${from}px`;
        layer.fill(this, Math.ceil(from), Math.ceil(to));
        return true;
    }

    /**
     * 暂停时长
     * 
     * @param pre 当前行参数
     * @returns 
     */
    #pause(pre: Mode1) {
        if (!this.$container.$pauseTimeStamp) {
            // 弹幕未曾暂停过，无需修正处理
            return 0;
        } else if (this.$container.$playTimeStamp > this.$container.$pauseTimeStamp) {
            if (this.$container.$playTimeStamp < pre.$starttimeStamp) {
                // 未曾暂停
                return 0;
            } else if (this.$container.$pauseTimeStamp > pre.$starttimeStamp) {
                // 弹幕暂停过
                return this.$container.$playTimeStamp - this.$container.$pauseTimeStamp;
            } else {
                // 还在暂停中？为什么会刷新弹幕？
                return pre.$starttimeStamp - this.$container.$pauseTimeStamp;
            }
        } else {
            // 还在暂停中？为什么会刷新弹幕？
            return 0;
        }
    }
}