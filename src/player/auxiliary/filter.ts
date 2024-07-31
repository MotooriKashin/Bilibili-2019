import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { PLAYER_EVENT, ev } from "../event-target";

/** 播放列表控制栏 */
@customElement('div')
export class Filter extends HTMLDivElement {

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
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 推荐视频 */
    $recommend = Element.add('button', { class: 'bofqi-auxiliary-filter-btn' }, this, '推荐视频');

    /** 弹幕列表 */
    private $danmaku = Element.add('button', { class: 'bofqi-auxiliary-filter-btn' }, this, '弹幕列表');

    /** 屏蔽设定 */
    private $block = Element.add('button', { class: 'bofqi-auxiliary-filter-btn' }, this, '屏蔽设定');

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-filter');

        ev.bind(PLAYER_EVENT.AUXILIARY_FILTER, ({ detail }) => {
            switch (detail) {
                case 1: {
                    this.$recommend.classList.remove('active');
                    this.$danmaku.classList.add('active');
                    this.$block.classList.remove('active');
                    break;
                }
                case 2: {
                    this.$recommend.classList.remove('active');
                    this.$danmaku.classList.remove('active');
                    this.$block.classList.add('active');
                    break;
                }
                default: {
                    this.$recommend.classList.add('active');
                    this.$danmaku.classList.remove('active');
                    this.$block.classList.remove('active');
                    break
                }
            }
        });

        this.$recommend.addEventListener('click', () => {
            ev.trigger(PLAYER_EVENT.AUXILIARY_FILTER, 0);
        });
        this.$danmaku.addEventListener('click', () => {
            ev.trigger(PLAYER_EVENT.AUXILIARY_FILTER, 1);
        });
        this.$block.addEventListener('click', () => {
            ev.trigger(PLAYER_EVENT.AUXILIARY_FILTER, 2);
        });

        // 默认显示推荐视频
        ev.one(PLAYER_EVENT.INITED, () => {
            ev.trigger(PLAYER_EVENT.AUXILIARY_FILTER, 0);
        });
        ev.bind(PLAYER_EVENT.IDENTIFY, this.identify);
    }

    private identify = () => {
        this.$recommend.textContent = '推荐视频';
    }
}