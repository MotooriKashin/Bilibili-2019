import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";

/**
 * 颜色选择 
 * 初始化时请将绑定按钮传入。  
 * 颜色改变时将发送`change`事件，颜色值从`$value`属性获取，十六进制sRGB格式。
 */
@customElement('div')
export class Color extends HTMLDivElement {

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
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    private $theme = Element.add('div', { class: 'bpui-color-row', 'data-label': '主题色' }, this);

    private $standard = Element.add('div', { class: 'bpui-color-row', 'data-label': '标准色' }, this);

    private $eye = Element.add('div', { class: 'bpui-color-eye', 'data-value': '#ffffff' }, this, '拾色器');

    /** 主题色 */
    private $themes = [
        "#ffffff",
        "#000000",
        "#e7e6e6",
        "#44546a",
        "#4472c4",
        "#ed7d31",
        "#a5a5a5",
        "#ffc000",
        "#5b9bd5",
        "#70ad47",
        "#f2f2f2",
        "#7f7f7f",
        "#d0cece",
        "#d6dce4",
        "#d9e2f3",
        "#fbe5d5",
        "#ededed",
        "#fff2cc",
        "#deebf6",
        "#e2efd9",
        "#d8d8d8",
        "#595959",
        "#aeabab",
        "#adb9ca",
        "#b4c6e7",
        "#f7cbac",
        "#dbdbdb",
        "#fee599",
        "#bdd7ee",
        "#c5e0b3",
        "#bfbfbf",
        "#3f3f3f",
        "#757070",
        "#8496b0",
        "#8eaadb",
        "#f4b183",
        "#c9c9c9",
        "#ffd965",
        "#9cc3e5",
        "#a8d08d",
        "#a5a5a5",
        "#262626",
        "#3a3838",
        "#323f4f",
        "#2f5496",
        "#c55a11",
        "#7b7b7b",
        "#bf9000",
        "#2e75b5",
        "#538135",
        "#7f7f7f",
        "#0c0c0c",
        "#171616",
        "#222a35",
        "#1f3864",
        "#833c0b",
        "#525252",
        "#7f6000",
        "#1e4e79",
        "#375623"
    ];

    /** 标准色 */
    private $standards = [
        "#c00000",
        "#ff0000",
        "#ffc000",
        "#ffff00",
        "#92d050",
        "#00b050",
        "#00b0f0",
        "#0070c0",
        "#002060",
        "#7030a0"
    ];

    get $value() {
        return this.$eye.dataset.value || '#ffffff';
    }

    set $value(v) {
        this.$eye.dataset.value = v;
        this.style.setProperty('--color-select', v);
    }

    constructor(parrent: HTMLButtonElement, anchorName?: string) {
        super();
        this.popover = 'auto';
        parrent.popoverTargetElement = this;
        this.classList.add('bpui-color');
        if (anchorName) {
            parrent.style.setProperty('anchor-name', anchorName);
            this.style.setProperty('position-anchor', anchorName);

        }

        this.$theme.innerHTML = `<div class="color-grid theme">${this.$themes.map(d => `<span title="${d}" data-value="${d}" style="background-color: ${d}"></span>`).join('')}</div>`;
        this.$standard.innerHTML = `<div class="color-grid standard">${this.$standards.map(d => `<span title="${d}" data-value="${d}" style="background-color: ${d}"></span>`).join('')}</div>`;

        this.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            if (e.target instanceof HTMLSpanElement) {
                if (e.target.dataset.value) {
                    this.$value = e.target.dataset.value;
                    this.dispatchEvent(new Event('change'));
                }
            }
        });
        this.$eye.addEventListener('click', () => {
            new EyeDropper().open().then(({ sRGBHex }) => {
                this.$value = sRGBHex;
                this.dispatchEvent(new Event('change'));
            })
        });

        parrent.appendChild(this);
    }
}