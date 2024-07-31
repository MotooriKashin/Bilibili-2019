import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { PLAYER_EVENT, ev } from "../../event-target";
import { video } from "./video";

/** 播放幕布 */
@customElement('div')
export class Panel extends HTMLDivElement {

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

    private $image = Element.add('div', { class: 'bofqi-panel-image' }, this);

    private $text = Element.add('div', { class: 'bofqi-panel-text' }, this);

    /** 播放器初始化 */
    private $player = Element.add('div', { class: 'bofqi-panel-row' }, this.$text, '播放器初始化...');

    /** 加载视频地址 */
    private $url = Element.add('div', { class: 'bofqi-panel-row' }, this.$text, '加载视频地址...');

    /** 加载视频内容 */
    private $media = Element.add('div', { class: 'bofqi-panel-row' }, this.$text, '加载视频内容...');

    /** 加载用户配置 */
    private $user = Element.add('div', { class: 'bofqi-panel-row' }, this.$text, '加载用户配置...');

    constructor() {
        super();

        this.classList.add('bofqi-panel', 'active');

        ev.one(PLAYER_EVENT.INITED, () => {
            this.$player.dataset.stage = '完成';
        });
        ev.bind(PLAYER_EVENT.IDENTIFY, this.identify);

        video.addEventListener('loadstart', () => {
            this.$url.dataset.stage = '完成';
        });
        video.addEventListener('loadedmetadata', () => {
            this.$media.dataset.stage = '完成';
            this.classList.remove('active');
        });
        video.addEventListener('emptied', this.identify);
    }

    /** 加载用户配置 */
    userLoad() {
        this.$user.dataset.stage = '完成';
    }

    private identify = () => {
        this.classList.add('active');
        this.$url.removeAttribute('data-stage');
        this.$media.removeAttribute('data-stage');
        this.$user.removeAttribute('data-stage');
    }
}