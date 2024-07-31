import { customElement } from "../../utils/Decorator/customElement";
import { Mode0 } from "./mode0";

/** 普通弹幕 */
@customElement('div')
export class Mode1 extends Mode0 {

    static space: Mode1[][] = [];

    static identity() {
        this.space.length = 0;
    }

    private $space() {
        if (this.$wraps < 2) {
            const { $danmakuArea, $heightFix } = this.$container;
            for (let i = 0; i <= Mode1.space.length; i++) {
                if ($danmakuArea && i) {
                    return this.$cancel();
                }
                if (!Mode1.space[i]) {
                    // 弹幕层尚未创建，直接创建
                    const layer: Mode1[] = [];
                    layer.length = Math.ceil($heightFix);
                    layer.fill(this, 0, Math.ceil(this.$height));
                    Mode1.space.push(layer);
                    break;
                } else if (this.$layer(Mode1.space[i])) {
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
    private $layer(layer: Mode1[]) {
        const { $heightFix } = this.$container;
        layer.length = Math.ceil($heightFix);
        for (let i = 0; i + this.$height < $heightFix; i += this.$height) {
            if (this.$add(layer, i, i + this.$height)) {
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
    private $add(layer: Mode1[], from: number, to: number) {
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
            const pauseStamp = this.$pause(pre);
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
        this.style.translate = `0 ${from}px`;
        layer.fill(this, Math.ceil(from), Math.ceil(to));
        return true;
    }

    /**
     * 暂停时长
     * 
     * @param pre 当前行参数
     * @returns 
     */
    private $pause(pre: Mode1) {
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

    private $animationstart = (ev: AnimationEvent) => {
        this.$starttimeStamp = ev.timeStamp;
    }

    /** 运动结束处理 */
    private $animationend = (ev: AnimationEvent) => {
        this.$endtimeStamp = ev.timeStamp;
        this.remove();
        this.style.animation = '';
        this.$wraps > 1 || this.$container.$danmakuNow--;
        this.$render = true;
    }

    /** 取消弹幕 */
    private $cancel() {
        this.removeEventListener('animationend', this.$animationend);
        this.remove();
        this.style.animation = '';
        this.$wraps > 1 || this.$container.$danmakuNow--;
        this.$render = true;
    }

    async execute(delay = 0) {
        if (this.$render) {
            this.$render = false;
            this.$endtimeStamp = this.$starttimeStamp = 0;
            this.style.transform = 'translateX(100cqw)';
            this.$container.appendChild(this);

            const { clientWidth, clientHeight } = this;
            const { $speedPlus, $speedSync, $rate, $duration, $width } = this.$container
            this.$width = clientWidth;
            this.$height = clientHeight;
            this.$duration = $duration / $speedPlus / ($speedSync ? $rate : 1) * (this.$width + $width) / (512 + this.$width);
            this.$speed = (512 + this.$width) / ($duration / $speedPlus / ($speedSync ? $rate : 1));
            this.addEventListener('animationstart', this.$animationstart, { once: true });
            this.addEventListener('animationend', this.$animationend, { once: true });
            this.$space();
            this.style.animation = `${this.$duration}ms linear ${delay}ms both dmMode1`;
            this.$wraps > 1 || this.$container.$danmakuNow++;
        }
    }
}