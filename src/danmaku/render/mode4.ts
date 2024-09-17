import { Mode } from ".";
import { IDanmaku, Danmaku } from "..";
import { customElement } from "../../utils/Decorator/customElement";

/** 底部弹幕 */
@customElement(undefined, `mode4-${Date.now()}`)
export class Mode4 extends Mode {

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

    static space: Mode4[][] = [];

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
            this.classList.add('mode4', 'pause');
            this.$container.$host.appendChild(this);

            const { clientHeight } = this;
            const { $duration } = this.$container
            this.$height = clientHeight;
            this.$duration = $duration;
            this.addEventListener('animationend', this.#animationend, { once: true });
            this.style.setProperty('--duation', <any>this.$duration);
            this.style.setProperty('--dealy', <any>$delay);
            this.#space();
            this.classList.remove('pause');
            this.$wraps || this.$container.$danmakuNow++;
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
            for (let i = 0; i <= Mode4.space.length; i++) {
                if ($danmakuArea && i) {
                    return this.#cancel();
                }
                if (!Mode4.space[i]) {
                    // 弹幕层尚未创建，直接创建
                    const layer: Mode4[] = [];
                    layer.length = Math.ceil($heightFix);
                    layer.fill(this, 0, Math.ceil(this.$height));
                    Mode4.space.push(layer);
                    break;
                } else if (this.#layer(Mode4.space[i])) {
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
    #layer(layer: Mode4[]) {
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
    #add(layer: Mode4[], from: number, to: number) {
        const set = new Set<Mode4>();
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
        this.style.insetBlockEnd = `${from}px`;
        layer.fill(this, Math.ceil(from), Math.ceil(to));
        return true;
    }
}