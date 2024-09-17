import { Player } from "../../..";
import svg_24danmucurrent from "../../../../assets/svg/24danmucurrent.svg";
import svg_24danmusetting from "../../../../assets/svg/24danmusetting.svg";
import svg_48danmuback from "../../../../assets/svg/48danmuback.svg";
import svg_48danmubottom from "../../../../assets/svg/48danmubottom.svg";
import svg_48danmunormal from "../../../../assets/svg/48danmunormal.svg";
import svg_48danmutop from "../../../../assets/svg/48danmutop.svg";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";

/** 弹幕类型 */
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

    /** 每当元素添加到文档中时调用。 */
    connectedCallback() {
        this.insertAdjacentElement('afterend', this.#wrap);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.#wrap.remove();
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    #wrap = Element.add('div', { class: 'sendbar-choose-wrap' });

    #id = crypto.randomUUID();

    #pool = Element.add('form', { class: 'choose-wrap-form', appendTo: this.#wrap, data: { label: '类型' }, innerHTML: `<label><input type="radio" name="${this.#id}" value="0" checked>普通弹幕</label><label><input type="radio" name="${this.#id}" value="1">字幕弹幕</label><label><input type="radio" name="${this.#id}" value="2" disabled>特殊弹幕</label>` });

    #size = Element.add('form', {
        class: 'choose-wrap-form', appendTo: this.#wrap, data: { label: '字号' }, innerHTML: `<label><input type="radio" name="${this.#id}" value="12">极小</label>
<label><input type="radio" name="${this.#id}" value="16">超小</label>
<label><input type="radio" name="${this.#id}" value="18">小</label>
<label><input type="radio" name="${this.#id}" value="25" checked>中</label>
<label><input type="radio" name="${this.#id}" value="36">大</label>
<label><input type="radio" name="${this.#id}" value="45">超大</label>
<label><input type="radio" name="${this.#id}" value="64">极大</label>`
    });

    #mode = Element.add('form', {
        class: 'choose-wrap-form', appendTo: this.#wrap, data: { label: '类型' }, innerHTML: `<label data-label="滚动弹幕"><input type="radio" name="${this.#id}" value="1" checked>${svg_48danmunormal}${svg_24danmucurrent}</label>
<label data-label="顶部弹幕"><input type="radio" name="${this.#id}" value="5">${svg_48danmutop}${svg_24danmucurrent}</label>
<label data-label="底部弹幕"><input type="radio" name="${this.#id}" value="4">${svg_48danmubottom}${svg_24danmucurrent}</label>
<label data-label="逆向弹幕"><input type="radio" name="${this.#id}" value="6">${svg_48danmuback}${svg_24danmucurrent}</label>`
    });

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

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-sendbar-choose');
        this.innerHTML = svg_24danmusetting;
        this.#wrap.popover = 'auto';
        this.popoverTargetElement = this.#wrap;

        this.#pool.addEventListener('change', () => {
            const d = new FormData(this.#pool);
            const i = +[...d.values()][0];
            this.$pool = <0>i;
        });

        this.#size.addEventListener('change', () => {
            const d = new FormData(this.#size);
            const i = +[...d.values()][0];
            this.$size = i;
        });

        this.#mode.addEventListener('change', () => {
            const d = new FormData(this.#mode);
            const i = +[...d.values()][0];
            this.$mode = <1>i;
        });
    }
}