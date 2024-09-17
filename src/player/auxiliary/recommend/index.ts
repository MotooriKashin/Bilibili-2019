import svg_12icondanmu from "../../../assets/svg/12icondanmu.svg";
import svg_12iconplayed from "../../../assets/svg/12iconplayed.svg";
import svg_12up from "../../../assets/svg/12up.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
import { ev, PLAYER_EVENT } from "../../event";

/** 推荐列表 */
@customElement('div')
export class Recommend extends HTMLDivElement {

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

    #items: IRecommend[] = [];

    #startIndex = 0;

    #seeLength = 0;

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-recommend');

        ev.bind(PLAYER_EVENT.OTHER_IDENTITY, this.#identify);
        new ResizeObserver(this.observeResizeCallback).observe(this);
        new IntersectionObserver(this.observeIntersectionCallback).observe(this);
        this.addEventListener('scroll', () => {
            const { scrollTop } = this;
            const startindex = Math.floor(scrollTop / 72);
            const { length } = this.#items;
            if (this.#startIndex < startindex) {
                // 向下滚动
                for (; (this.#startIndex < startindex && (this.#startIndex + this.#seeLength) < length); this.#startIndex++) {
                    this.appendChild(this.renderItem(this.#items[this.#startIndex + this.#seeLength], this.#startIndex + this.#seeLength + 1));
                    this.firstElementChild?.remove();
                }
            } else {
                // 向上滚动
                for (; (this.#startIndex > startindex && (this.#startIndex - 1) >= 0); this.#startIndex--) {
                    this.prepend(this.renderItem(this.#items[this.#startIndex - 1], this.#startIndex));
                    this.lastElementChild?.remove();
                }
            }
            this.marginFix();
        });
    }

    private observeIntersectionCallback = (entries: IntersectionObserverEntry[]) => {
        let isIntersecting = false;
        for (const entry of entries) {
            isIntersecting = entry.isIntersecting;
        }

        if (!isIntersecting) {
            this.#startIndex = 0;
        }
    }

    private observeResizeCallback = (entries: ResizeObserverEntry[]) => {
        let blockSize = 0;
        for (const entry of entries) {
            for (const borderBoxSize of entry.borderBoxSize) {
                borderBoxSize.blockSize && (blockSize = borderBoxSize.blockSize);
            }
        }

        if (blockSize) {
            this.render(blockSize);
        }
    }

    private render(blockSize: number) {
        this.replaceChildren();
        const { length } = this.#items;
        const max = Math.ceil(blockSize / 72) + 2;
        for (let i = 0; (i < max && (this.#startIndex + i) < length); i++) {
            this.appendChild(this.renderItem(this.#items[this.#startIndex + i], this.#startIndex + i + 1));
            this.#seeLength = i + 1;
        }
        this.marginFix();
    }

    private marginFix() {
        const { length } = this.#items;
        this.style.setProperty('--margin-block-start', `${this.#startIndex * 72}px`);
        this.style.setProperty('--margin-block-end', `${(length - this.#seeLength - this.#startIndex) * 72}px`);
    }

    private renderItem(d: IRecommend, i: number) {
        const div = document.createElement('div');
        div.classList.add('recommend');
        d.selected && div.classList.add('selected');
        div.dataset.index = <any>i;
        div.innerHTML = `
<div class="recommend-left">
    <img loading="lazy" src="${https(d.src)}" alt="${d.title}">
    <div class="recommend-time">${d.duration ? Format.fmSeconds(d.duration) : ''}</div>
</div>
<div class="recommend-right">
    <div class="recommend-title">${d.title}</div>
    <div class="recommend-info">
        ${d.view ? `<div>${svg_12iconplayed + Format.carry(d.view)}</div>` : ''}
        ${d.danmaku ? `<div>${svg_12icondanmu + Format.carry(d.danmaku)}</div>` : ''}
        ${d.author ? `<div>${svg_12up + d.author}</div>` : ''}
    </div>
</div>`;
        d.callback && div.addEventListener('click', d.callback);
        return div;
    }

    add(items: IRecommend | IRecommend[]) {
        this.#items = this.#items.concat(items);
        this.hasChildNodes() || (this.offsetHeight && this.render(this.offsetHeight));
    }

    #identify = () => {
        this.#startIndex = 0;
        this.#items.length = 0;
        this.replaceChildren();
    }
}

/** 推荐视频 */
export interface IRecommend {

    /** 封面 */
    src: string;

    /** 标题 */
    title: string;

    /** 时长秒数 */
    duration?: number;

    /** 作者（三选二之一） */
    author?: string;

    /** 播放数（三选二之一） */
    view?: number;

    /** 弹幕数（三选二之一） */
    danmaku?: number;

    /** 点击回调 */
    callback?: () => void;

    /** 是否选中 */
    selected?: boolean;
}