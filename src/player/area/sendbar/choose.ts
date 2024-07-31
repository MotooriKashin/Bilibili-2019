import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import svg_danmaku_current from "../../assets/svg/danmaku-current.svg";
import svg_danmaku_mode_1 from "../../assets/svg/danmaku-mode-1.svg";
import svg_danmaku_mode_4 from "../../assets/svg/danmaku-mode-4.svg";
import svg_danmaku_mode_5 from "../../assets/svg/danmaku-mode-5.svg";
import svg_danmaku_mode_6 from "../../assets/svg/danmaku-mode-6.svg";
import svg_danmaku_setting from "../../assets/svg/danmaku-setting.svg";

/** 弹幕配置 */
@customElement('button')
export class DanmakuChoose extends HTMLButtonElement {

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

    private $wrap = Element.add('div', { class: 'bofqi-sendbar-choose-wrap', popover: 'auto' }, this);

    /** 类型 */
    private $type = Element.add('div', { class: 'bofqi-sendbar-choose-row' }, this.$wrap, '<div class="bofqi-sendbar-choose-label">类型</div>');

    private $typeSelection = Element.add('div', { class: 'bofqi-sendbar-choose-selection' }, this.$type);

    /** 普通弹幕 */
    private $typeNormal = Element.add('div', { class: 'active', 'data-pool': '0' }, this.$typeSelection, '普通弹幕');

    /** 字幕弹幕 */
    private $typeCaption = Element.add('div', { 'data-pool': '1' }, this.$typeSelection, '字幕弹幕');

    /** 特殊弹幕 */
    private $typeSpecial = Element.add('div', { 'data-pool': '2' }, this.$typeSelection, '特殊弹幕');

    /** 字号 */
    private $dmSize = Element.add('div', { class: 'bofqi-sendbar-choose-row' }, this.$wrap, '<div class="bofqi-sendbar-choose-label">字号</div>');

    private $sizeSelection = Element.add('div', { class: 'bofqi-sendbar-choose-selection' }, this.$dmSize);

    /** 极小 */
    private $sizeSmallMost = Element.add('div', { 'data-size': '12' }, this.$sizeSelection, '极小');

    /** 超小 */
    private $sizeSmallMore = Element.add('div', { 'data-size': '16' }, this.$sizeSelection, '超小');

    /** 小 */
    private $sizeSmall = Element.add('div', { 'data-size': '18' }, this.$sizeSelection, '小');

    /** 中 */
    private $sizeNormal = Element.add('div', { class: 'active', 'data-size': '25' }, this.$sizeSelection, '中');

    /** 大 */
    private $sizeBig = Element.add('div', { 'data-size': '36' }, this.$sizeSelection, '大');

    /** 超大 */
    private $sizeBigMore = Element.add('div', { 'data-size': '45' }, this.$sizeSelection, '超大');

    /** 极大 */
    private $sizeBigMost = Element.add('div', { 'data-size': '64' }, this.$sizeSelection, '极大');

    /** 模式 */
    private $dmMode = Element.add('div', { class: 'bofqi-sendbar-choose-row' }, this.$wrap, '<div class="bofqi-sendbar-choose-label">模式</div>');

    private $modeSelection = Element.add('div', { class: 'bofqi-sendbar-choose-selection' }, this.$dmMode);

    /** 滚动弹幕 */
    private $scroll = Element.add('div', { class: 'bofqi-sendbar-choose-mode active', 'data-mode': '1' }, this.$modeSelection, svg_danmaku_mode_1 + svg_danmaku_current);

    /** 顶部弹幕 */
    private $top = Element.add('div', { class: 'bofqi-sendbar-choose-mode', 'data-mode': '5' }, this.$modeSelection, svg_danmaku_mode_5 + svg_danmaku_current);

    /** 底部弹幕 */
    private $bottom = Element.add('div', { class: 'bofqi-sendbar-choose-mode', 'data-mode': '4' }, this.$modeSelection, svg_danmaku_mode_4 + svg_danmaku_current);

    /** 逆向弹幕 */
    private $reverse = Element.add('div', { class: 'bofqi-sendbar-choose-mode', 'data-mode': '6' }, this.$modeSelection, svg_danmaku_mode_6 + svg_danmaku_current);

    /**
     * 弹幕池
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 普通弹幕 | 字幕弹幕 | 特殊弹幕 |
     */
    $pool: 0 | 1 | 2 = 0;

    /** 字体大小 */
    $size = 25;

    /**
     * 弹幕模式
     * | 1 | 4 | 5 | 6 | 7 | 8 | 9 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 普通 | 底部 | 顶部 | 逆向 | 高级 | 代码 | BAS |
     */
    $mode: 1 | 4 | 5 | 6 | 7 | 8 | 9 = 1;

    constructor() {
        super();

        this.classList.add('bofqi-sendbar-choose');
        this.$wrap.insertAdjacentHTML('beforebegin', svg_danmaku_setting);
        this.popoverTargetElement = this.$wrap;

        this.$typeSpecial.classList.add('disabled'); // 特殊弹幕被禁用
        this.$scroll.dataset.label = '滚动弹幕';
        this.$top.dataset.label = '顶部弹幕';
        this.$bottom.dataset.label = '底部弹幕';
        this.$reverse.dataset.label = '逆向弹幕';

        this.$wrap.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            switch (<HTMLElement>e.target) {
                case this.$typeNormal:
                case this.$typeCaption:
                case this.$typeSpecial:
                case this.$sizeSmallMost:
                case this.$sizeSmallMore:
                case this.$sizeSmall:
                case this.$sizeNormal:
                case this.$sizeBig:
                case this.$sizeBigMore:
                case this.$sizeBigMost:
                case this.$scroll:
                case this.$top:
                case this.$bottom:
                case this.$reverse: {
                    if (!(<HTMLElement>e.target).classList.contains('disabled')) {
                        (<HTMLElement>e.target).parentElement!.querySelector('.active')?.classList.remove('active');
                        (<HTMLElement>e.target).classList.add('active');
                        if ((<HTMLElement>e.target).dataset.pool) {
                            this.$pool = <1>+(<HTMLElement>e.target).dataset.pool!;
                        }
                        if ((<HTMLElement>e.target).dataset.size) {
                            this.$size = +(<HTMLElement>e.target).dataset.size!;
                        }
                        if ((<HTMLElement>e.target).dataset.mode) {
                            this.$mode = <1>+(<HTMLElement>e.target).dataset.mode!;
                        }
                    }
                    break;
                }
            }
        });
    }
}