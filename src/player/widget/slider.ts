import { customElement } from "../../utils/Decorator/customElement";
import { Format } from "../../utils/fomat";

/** 滚动条 */
@customElement('input')
export class Slider extends HTMLInputElement {

    /**
     * 需要监听变动的属性。
     * 与实例方法`attributeChangedCallback`配合使用。
     * 此字符串序列定义了`attributeChangedCallback`回调时的第一个参数的可能值。
     */
    static observedAttributes = ['min', 'max', 'step'];

    /**
     * 在属性更改、添加、移除或替换时调用。
     * 需要与静态属性`observedAttributes`配合使用。
     * 此回调的第一个参数在`observedAttributes`数组中定义。
     */
    attributeChangedCallback(name: 'min' | 'max' | 'step', oldValue: string, newValue: string) {
        switch (name) {
            case "min":
            case "max":
            case 'step': {
                this.linearGradient();
                break;
            }
        }
    }

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 进度颜色 */
    $colorProgress = '#00a1d6';

    /** 背景色 */
    $colorTrack = '#e5e9ef';

    /** 缓冲色 */
    $colorBuffer = '#8adced';

    #buffer: [number, number][] = [];

    #formatHint = (value: string) => value;

    /** 设置缓冲区 */
    set $buffer(buffer: [number, number][]) {
        this.#buffer = buffer.sort((a, b) => a[0] - b[0] > 0 ? 1 : -1);
        this.linearGradient();
    }

    /** 当前值 */
    get $value() {
        return this.value;
    }

    set $value(v) {
        this.dataset.value = this.#formatHint(this.value = v);
        this.linearGradient();
    }

    /** 浮动显示当前数值 */
    set $hint(v: boolean) {
        this.classList.toggle('hint', v);
    }

    constructor() {
        super();

        this.type = 'range';
        this.classList.add('bpui-slider');

        this.addEventListener('change', () => {
            this.$value = this.value;
        });
        new IntersectionObserver(this.$intersectionObserver).observe(this);

        this.defaultValue = '0';
    }

    private $intersectionObserver = (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                this.linearGradient();
                break;
            }
        }
    }

    /** 更新进度或缓冲色 */
    private linearGradient = () => {
        const value = Format.fmRange((+this.value - +this.min) / ((+this.max || 100) - +this.min), 0, 1);
        const linear = [[this.$colorProgress, 0, Format.toFixed(value * 100) + '%']];
        /** 当前最大值，用于还原背景色 */
        let max = value;
        for (const buffer of this.#buffer) {
            if (buffer[1] < value) break;
            max = buffer[1];
            if (buffer[0] > value) {
                linear.push(
                    [this.$colorTrack, Format.toFixed(value * 100) + '%', Format.toFixed(buffer[0] * 100) + '%'],
                    [this.$colorBuffer, Format.toFixed(buffer[0] * 100) + '%', Format.toFixed(buffer[1] * 100) + '%']
                );
            } else {
                linear.push([this.$colorBuffer, Format.toFixed(value * 100) + '%', Format.toFixed(buffer[1] * 100) + '%']);
            }
        }
        linear.push([this.$colorTrack, Format.toFixed(max * 100) + '%', '100%']);
        this.style.setProperty('--linear-gradient', `linear-gradient(to right,${linear.map(d => d.join(' ')).join(',')})`);
    }

    /**
     * 格式化浮动信息
     * 
     * @param callback 用于修改浮动信息的回调函数，将原始值传入
     */
    formatHint(callback: (value: string) => string) {
        this.#formatHint = callback;
    }
}