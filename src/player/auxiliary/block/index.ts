import { DANMAKU } from "../../../danmaku/block";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import svg_danmaku_color from "../../assets/svg/danmaku-color.svg";
import svg_danmaku_forbid from "../../assets/svg/danmaku-forbid.svg";
import svg_danmaku_mode_1 from "../../assets/svg/danmaku-mode-1.svg";
import svg_danmaku_mode_4 from "../../assets/svg/danmaku-mode-4.svg";
import svg_danmaku_mode_5 from "../../assets/svg/danmaku-mode-5.svg";
import svg_danmaku_mode_7 from "../../assets/svg/danmaku-mode-7.svg";
import svg_danmaku_mode_8 from "../../assets/svg/danmaku-mode-8.svg";
import svg_danmaku_normal from "../../assets/svg/danmaku-normal.svg";
import svg_danmaku_text from "../../assets/svg/danmaku-text.svg";
import svg_danmaku_unregister from "../../assets/svg/danmaku-unregister.svg";
import { PLAYER_EVENT, ev } from "../../event-target";
import { options } from "../../option";
import { Slider } from "../../widget/slider";

/** 屏蔽列表 */
@customElement('div')
export class Block extends HTMLDivElement {

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

    /** 按类型屏蔽 */
    private $type = Element.add('div', { class: 'bofqi-auxiliary-block-filter' }, this, `<header>按类型屏蔽</header>`);

    /** 滚动弹幕 */
    private $scroll = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_mode_1 + svg_danmaku_forbid);

    /** 顶端弹幕 */
    private $top = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_mode_5 + svg_danmaku_forbid);

    /** 底端弹幕 */
    private $bottom = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_mode_4 + svg_danmaku_forbid);

    /** 彩色弹幕 */
    private $color = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_color + svg_danmaku_forbid);

    /** 高级弹幕 */
    private $mode7 = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_normal + svg_danmaku_forbid);

    /** 代码弹幕 */
    private $mode8 = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_mode_8 + svg_danmaku_forbid);

    /** BAS弹幕 */
    private $mode9 = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_mode_7 + svg_danmaku_forbid);

    /** 高赞弹幕 */
    private $like = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_unregister + svg_danmaku_forbid);

    /** VIP弹幕 */
    private $vip = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type' }, this.$type, svg_danmaku_text + svg_danmaku_forbid);

    /** 等级屏蔽 */
    private $level = Element.add('div', { class: 'bofqi-auxiliary-block-filter' }, this, `<header>等级屏蔽</header>`);

    /** 等级滑块 */
    private $weight = this.$level.appendChild(new Slider());

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-block');

        this.$scroll.dataset.label = '滚动弹幕';
        this.$top.dataset.label = '顶端弹幕';
        this.$bottom.dataset.label = '底端弹幕';
        this.$color.dataset.label = '彩色弹幕';
        this.$mode7.dataset.label = '高级弹幕';
        this.$mode8.dataset.label = '代码弹幕';
        this.$mode9.dataset.label = 'BAS弹幕';
        this.$like.dataset.label = '高赞弹幕';
        this.$vip.dataset.label = 'VIP弹幕';
        this.$weight.classList.add('bofqi-auxiliary-block-filter-weight');
        this.$weight.max = '11';
        this.$weight.$hint = true;
        this.$weight.formatHint(v => {
            switch (<number><unknown>v) {
                case 0: {
                    return '关闭'
                }
                case 11: {
                    return '硬核会员模式'
                }
                default: {
                    return v;
                }
            }
        });

        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { block, weight } = detail.danmaku;

            this.$scroll.classList.toggle('block', Boolean(block & DANMAKU.SCROLL));
            this.$top.classList.toggle('block', Boolean(block & DANMAKU.TOP));
            this.$bottom.classList.toggle('block', Boolean(block & DANMAKU.BOTTOM));
            this.$color.classList.toggle('block', Boolean(block & DANMAKU.COLOR));
            this.$mode7.classList.toggle('block', Boolean(block & DANMAKU.ADVANCE));
            this.$mode8.classList.toggle('block', Boolean(block & DANMAKU.SCRIPT));
            this.$mode9.classList.toggle('block', Boolean(block & DANMAKU.BAS));
            this.$like.classList.toggle('block', Boolean(block & DANMAKU.LIKE));
            this.$vip.classList.toggle('block', Boolean(block & DANMAKU.VIP));
            this.$weight.$value = <any>weight;
        });

        this.$scroll.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.SCROLL;
        });
        this.$top.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.TOP;
        });
        this.$bottom.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.BOTTOM;
        });
        this.$color.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.COLOR;
        });
        this.$mode7.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.ADVANCE;
        });
        this.$mode8.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.SCRIPT;
        });
        this.$mode9.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.BAS;
        });
        this.$like.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.LIKE;
        });
        this.$vip.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.VIP;
        });
        this.$weight.addEventListener('change', () => {
            options.danmaku.weight = +this.$weight.$value || 0;
        });
    }
}