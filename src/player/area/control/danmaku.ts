import { DANMAKU } from "../../../danmaku/block";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import svg_danmaku_forbid from "../../assets/svg/danmaku-forbid.svg";
import svg_danmaku_mode_1 from "../../assets/svg/danmaku-mode-1.svg";
import svg_danmaku_mode_4 from "../../assets/svg/danmaku-mode-4.svg";
import svg_danmaku_mode_5 from "../../assets/svg/danmaku-mode-5.svg";
import svg_danmaku_off from "../../assets/svg/danmaku-off.svg";
import svg_danmaku from "../../assets/svg/danmaku.svg";
import { PLAYER_EVENT, ev } from "../../event-target";
import { options } from "../../option";
import { Checkbox } from "../../widget/checkbox";
import { Slider } from "../../widget/slider";

/** 播放器弹幕控制 */
@customElement('button')
export class Danmaku extends HTMLButtonElement {

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

    /** 浮动面板 */
    private $wrap = Element.add('div', { class: 'bofqi-control-danmaku-wrap' }, this);

    /** 不透明度 */
    private $opacity = this.$wrap.appendChild(new Slider());

    /** 防挡字幕 */
    private $preventShade = this.$wrap.appendChild(new Checkbox());

    /** 顶端弹幕 */
    private $top = Element.add('div', { class: 'bofqi-control-danmaku-block' }, this.$wrap, svg_danmaku_mode_5 + svg_danmaku_forbid);

    /** 底端弹幕 */
    private $bottom = Element.add('div', { class: 'bofqi-control-danmaku-block' }, this.$wrap, svg_danmaku_mode_4 + svg_danmaku_forbid);

    /** 滚动弹幕 */
    private $scroll = Element.add('div', { class: 'bofqi-control-danmaku-block' }, this.$wrap, svg_danmaku_mode_1 + svg_danmaku_forbid);

    constructor() {
        super();

        this.classList.add('bofqi-control-button', 'bofqi-control-danmaku');
        this.insertAdjacentHTML('afterbegin', svg_danmaku + svg_danmaku_off);
        this.$opacity.insertAdjacentHTML('beforebegin', '<span>不透明度</span>');
        this.$preventShade.insertAdjacentHTML('beforebegin', '<hr>');
        this.$top.insertAdjacentHTML('beforebegin', '<hr>');

        this.$opacity.classList.add('bofqi-control-danmaku-opacity');
        this.$opacity.min = '1';
        this.$opacity.$hint = true;
        this.$opacity.formatHint(v => {
            return Math.floor(+v) + '%';
        });
        this.$preventShade.$prev = true;
        this.$preventShade.$text = '防挡字幕';
        this.$top.dataset.label = '顶端弹幕';
        this.$bottom.dataset.label = '底端弹幕';
        this.$scroll.dataset.label = '滚动弹幕';

        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { visible, opacity, preventShade, block } = detail.danmaku;

            this.classList.toggle('off', !visible);
            this.$opacity.$value = <any>Math.max(1, Math.min(100, opacity * 100));
            this.$preventShade.$value = preventShade;
            this.$top.classList.toggle('block', Boolean(block & DANMAKU.TOP));
            this.$bottom.classList.toggle('block', Boolean(block & DANMAKU.BOTTOM));
            this.$scroll.classList.toggle('block', Boolean(block & DANMAKU.SCROLL));
        });

        this.$wrap.addEventListener('click', e => {
            e.stopPropagation();
        });
        this.addEventListener('click', () => {
            options.danmaku.visible = !options.danmaku.visible;
        });
        this.$opacity.addEventListener('change', () => {
            options.danmaku.opacity = Math.max(0.01, Math.min(1, +this.$opacity.$value / 100));
        });
        this.$preventShade.addEventListener('change', () => {
            options.danmaku.preventShade = this.$preventShade.$value;
        });
        this.$top.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.TOP;
        });
        this.$bottom.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.BOTTOM;
        });
        this.$scroll.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.SCROLL;
        });
    }
}