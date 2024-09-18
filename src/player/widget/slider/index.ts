import { CSSStyleSheet2HTMLStyleElement } from "../../../utils/CSSStyleSheet2HTMLStyleElement";
import { customElement } from "../../../utils/Decorator/customElement";
import stylesheet from "./index.css" with {type: 'css'};

/** 播放器主区域 */
@customElement('form')
export class Slider extends HTMLFormElement {

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

    /** 轨道 */
    protected $bar = this.appendChild(document.createElement('progress'));

    /** 进度 */
    #progress = this.appendChild(document.createElement('progress'));

    /** 进度条 */
    #slider = this.appendChild(document.createElement('input'));

    #formatHint = (value: number) => <string | number>value;

    /** 默认值 */
    set $defaultValue(v: number) {
        this.#slider.defaultValue = <any>v;
    }

    /** 步进 */
    set $step(v: number | string) {
        this.#slider.step = <string>v;
    }

    /** 最大值 */
    set $max(v: number) {
        this.#slider.max = <any>(this.#progress.max = v);
    }

    /** 当前值 */
    set $value(v: number) {
        this.#slider.value = <any>(this.#progress.value = v);
        this.#slider.dataset.value = <string>this.#formatHint(<any>v);
    }

    get $value() {
        return +this.#slider.value;
    }

    /** 浮动显示当前数值 */
    set $hint(v: boolean) {
        this.#slider.classList.toggle('hint', v);
    }

    /** 设定浮动显示值 */
    set $hintValue(v: string) {
        this.#slider.dataset.value = v;
    }

    constructor() {
        super();

        // this.#host.adoptedStyleSheets = [stylesheet]; // 文档画中画模式会导致构造的样式表丢失，暂时取道 style 元素代替
        this.appendChild(CSSStyleSheet2HTMLStyleElement(stylesheet));

        this.classList.add('bpui-slider');
        this.#slider.type = 'range';
        this.#slider.classList.add('slider');
        this.$bar.classList.add('bar');

        this.#slider.addEventListener('change', () => {
            this.#progress.value = +this.#slider.value;
        });

        this.$max = 100;
    }

    /**
     * 格式化浮动信息
     * 
     * @param callback 用于修改浮动信息的回调函数，将原始值传入
     */
    formatHint(callback: (value: number) => string | number) {
        this.#formatHint = callback;
    }
}