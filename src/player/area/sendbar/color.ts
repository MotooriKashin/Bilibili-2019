import { customElement } from "../../../utils/Decorator/customElement";
import svg_color from "../../assets/svg/color.svg";
import { Color } from "../../widget/color";

/** 弹幕颜色 */
@customElement('button')
export class DanmakuColor extends HTMLButtonElement {

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

    private $wrap = new Color(this);

    #value = '#ffffff'

    get $value(): number {
        if (/^#[0-9A-Fa-f]{6}$/.test(this.#value)) {
            return Number(this.#value.replace('#', '0x'));
        } else {
            return 0xFFFFFF;
        }
    }

    set $value(v: string) {
        this.#value = v;
        this.style.setProperty('--color-select', v);
    }

    constructor() {
        super();

        this.classList.add('bofqi-sendbar-color');
        this.$wrap.insertAdjacentHTML('beforebegin', svg_color);
        this.$wrap.addEventListener('change', () => {
            this.$value = this.$wrap.$value;
        });
    }
}