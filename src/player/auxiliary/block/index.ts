import { Player } from "../..";
import svg_24danmuforbid from "../../../assets/svg/24danmuforbid.svg";
import svg_48danmubottom from "../../../assets/svg/48danmubottom.svg";
import svg_48danmucode from "../../../assets/svg/48danmucode.svg";
import svg_48danmucolor from "../../../assets/svg/48danmucolor.svg";
import svg_48danmunorm from "../../../assets/svg/48danmunorm.svg";
import svg_48danmunormal from "../../../assets/svg/48danmunormal.svg";
import svg_48danmuspe from "../../../assets/svg/48danmuspe.svg";
import svg_48danmutext from "../../../assets/svg/48danmutext.svg";
import svg_48danmutop from "../../../assets/svg/48danmutop.svg";
import svg_48danmuunreg from "../../../assets/svg/48danmuunreg.svg";
import { DANMAKU } from "../../../danmaku/block";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { ev, PLAYER_EVENT } from "../../event";
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

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 按类型屏蔽 */
    #type = Element.add('div', { class: 'bofqi-auxiliary-block-filter', appendTo: this, innerHTML: '<header>按类型屏蔽</header>' });

    /** 滚动弹幕 */
    #scroll = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmunormal + svg_24danmuforbid, data: { label: '滚动弹幕' } });

    /** 顶端弹幕 */
    #top = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmutop + svg_24danmuforbid, data: { label: '顶端弹幕' } });

    /** 底端弹幕 */
    #bottom = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmubottom + svg_24danmuforbid, data: { label: '底端弹幕' } });

    /** 彩色弹幕 */
    #color = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmucolor + svg_24danmuforbid, data: { label: '彩色弹幕' } });

    /** 高级弹幕 */
    #mode7 = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmunorm + svg_24danmuforbid, data: { label: '高级弹幕' } });

    /** 代码弹幕 */
    #mode8 = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmucode + svg_24danmuforbid, data: { label: '代码弹幕' } });

    /** BAS弹幕 */
    #mode9 = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmuspe + svg_24danmuforbid, data: { label: 'BAS弹幕' } });

    /** 高赞弹幕 */
    #like = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmuunreg + svg_24danmuforbid, data: { label: '高赞弹幕' } });

    /** VIP弹幕 */
    #vip = Element.add('div', { class: 'bofqi-auxiliary-block-filter-type', appendTo: this.#type, innerHTML: svg_48danmutext + svg_24danmuforbid, data: { label: 'VIP弹幕' } });

    /** 等级屏蔽 */
    #level = Element.add('div', { class: 'bofqi-auxiliary-block-filter', appendTo: this, innerHTML: '<header>等级屏蔽</header>' });

    /** 等级滑块 */
    #weight = this.#level.appendChild(new Slider());

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-block');

        this.#weight.classList.add('bofqi-auxiliary-block-filter-weight');
        this.#weight.max = 11;
        this.#weight.$hint = true;
        this.#weight.formatHint(v => {
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

            this.#scroll.classList.toggle('block', Boolean(block & DANMAKU.SCROLL));
            this.#top.classList.toggle('block', Boolean(block & DANMAKU.TOP));
            this.#bottom.classList.toggle('block', Boolean(block & DANMAKU.BOTTOM));
            this.#color.classList.toggle('block', Boolean(block & DANMAKU.COLOR));
            this.#mode7.classList.toggle('block', Boolean(block & DANMAKU.ADVANCE));
            this.#mode8.classList.toggle('block', Boolean(block & DANMAKU.SCRIPT));
            this.#mode9.classList.toggle('block', Boolean(block & DANMAKU.BAS));
            this.#like.classList.toggle('block', Boolean(block & DANMAKU.LIKE));
            this.#vip.classList.toggle('block', Boolean(block & DANMAKU.VIP));
            this.#weight.$value = <any>weight;
        });

        this.#scroll.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.SCROLL;
        });
        this.#top.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.TOP;
        });
        this.#bottom.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.BOTTOM;
        });
        this.#color.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.COLOR;
        });
        this.#mode7.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.ADVANCE;
        });
        this.#mode8.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.SCRIPT;
        });
        this.#mode9.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.BAS;
        });
        this.#like.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.LIKE;
        });
        this.#vip.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.VIP;
        });
        this.#weight.addEventListener('change', () => {
            options.danmaku.weight = +this.#weight.$value || 0;
        });
    }
}