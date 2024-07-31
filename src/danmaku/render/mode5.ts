import { customElement } from "../../utils/Decorator/customElement";
import { Mode0 } from "./mode0";

/** 顶部 */
@customElement('div')
export class Mode5 extends Mode0 {

    static space: Mode5[][] = [];

    static identity() {
        this.space.length = 0;
    }

    private $space() {
        if (this.$wraps < 2) {
            const { $danmakuArea, $heightFix } = this.$container;
            for (let i = 0; i <= Mode5.space.length; i++) {
                if ($danmakuArea && i) {
                    return this.$cancel();
                }
                if (!Mode5.space[i]) {
                    // 弹幕层尚未创建，直接创建
                    const layer: Mode5[] = [];
                    layer.length = Math.ceil($heightFix);
                    layer.fill(this, 0, Math.ceil(this.$height));
                    Mode5.space.push(layer);
                    break;
                } else if (this.$layer(Mode5.space[i])) {
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
    private $layer(layer: Mode5[]) {
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
    private $add(layer: Mode5[], from: number, to: number) {
        const set = new Set<Mode5>();
        for (let i = Math.ceil(from); i < Math.ceil(to); i++) {
            layer[i] && set.add(layer[i]);
        }
        /** 当前时间戳 */
        for (const pre of set) {
            if (!pre.$endtimeStamp) {
                // 本行有弹幕，禁止进入
                return false
            }
        }
        this.style.translate = `0 ${from}px`;
        layer.fill(this, Math.ceil(from), Math.ceil(to));
        return true;
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
            this.style.transform = 'translateX(calc(50cqw - 50%))';
            this.$container.appendChild(this);

            const { clientHeight } = this;
            const { $duration } = this.$container
            this.$height = clientHeight;
            this.$duration = $duration;
            this.addEventListener('animationend', this.$animationend, { once: true });
            this.$space();
            this.style.animation = `0ms linear ${delay + this.$duration}ms both dmMode5`;
            this.$wraps > 1 || this.$container.$danmakuNow++;
        }
    }
}