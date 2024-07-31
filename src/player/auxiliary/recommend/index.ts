import { customElement } from "../../../utils/Decorator/customElement";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
import svg_icon_danmaku from "../../assets/svg/icon-danmaku.svg";
import svg_icon_played from "../../assets/svg/icon-played.svg";
import svg_upper from "../../assets/svg/upper.svg";
import { PLAYER_EVENT, ev } from "../../event-target";

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

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-recommend');

        ev.bind(PLAYER_EVENT.IDENTIFY, this.identify);
    }

    add(items: IRecommend | IRecommend[]) {
        Array.isArray(items) || (items = [items]);
        const p = document.createDocumentFragment();
        let i = 0;
        for (const d of items) {
            const div = document.createElement('div');
            div.classList.add('recommend');
            d.selected && div.classList.add('selected');
            div.dataset.index = <any>++i;
            div.innerHTML = `
<div class="recommend-left">
    <img loading="lazy" src="${https(d.src)}" alt="${d.title}">
    <div class="recommend-time">${d.duration ? Format.fmSeconds(d.duration) : ''}</div>
</div>
<div class="recommend-right">
    <div class="recommend-title">${d.title}</div>
    <div class="recommend-info">
        ${d.view ? `<div>${svg_icon_played + Format.carry(d.view)}</div>` : ''}
        ${d.danmaku ? `<div>${svg_icon_danmaku + Format.carry(d.danmaku)}</div>` : ''}
        ${d.author ? `<div>${svg_upper + d.author}</div>` : ''}
    </div>
</div>`;
            d.callback && div.addEventListener('click', d.callback);
            p.appendChild(div);
        }
        this.appendChild(p);
    }

    private identify = () => {
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