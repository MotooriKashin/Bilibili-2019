import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import svg_volume_large from "../../assets/svg/volume-large.svg";
import svg_volume_muted from "../../assets/svg/volume-muted.svg";
import svg_volume from "../../assets/svg/volume.svg";
import { Slider } from "../../widget/slider";
import { video } from "../wrap/video";

/** 播放器音量控制 */
@customElement('button')
export class Volume extends HTMLButtonElement {

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

    /** 浮动面板 */
    $wrap = Element.add('div', { class: 'bofqi-control-volume-wrap' }, this);

    /** 音量条 */
    $slider = this.$wrap.appendChild(new Slider());

    constructor() {
        super();

        this.classList.add('bofqi-control-button', 'bofqi-control-volume');
        this.insertAdjacentHTML('afterbegin', svg_volume + svg_volume_large + svg_volume_muted);

        this.$slider.defaultValue = '0';
        this.disabled = true;

        video.addEventListener('loadstart', () => {
            this.disabled = true;
            this.classList.toggle('muted', video.muted);
            this.classList.toggle('large', video.volume >= 0.5);
            this.$slider.$value = <any>Math.floor(video.volume * 100);
            this.$wrap.dataset.value = <any>Math.floor(video.volume * 100);
        });
        video.addEventListener('loadeddata', () => {
            this.disabled = false;
        });
        video.addEventListener('volumechange', () => {
            this.classList.toggle('muted', video.muted);
            this.classList.toggle('large', video.volume >= 0.5);
            this.$slider.$value = <any>Math.floor(video.volume * 100);
            this.$wrap.dataset.value = <any>Math.floor(video.volume * 100);
        });

        this.addEventListener('click', () => {
            video.muted = !video.muted;
        });
        this.$wrap.addEventListener('click', e => {
            e.stopPropagation();
        })
        this.$slider.addEventListener('change', () => {
            video.volume = +this.$slider.$value / 100;
        });
        this.addEventListener('wheel', e => {
            // 响应滚轮
            e.stopPropagation();
            e.preventDefault();
            this.wheel(e);
        });
    }

    /** 滚轮响应 */
    protected wheel = (e: WheelEvent) => {
        const { deltaY } = e;
        // 超出范围会报错，直接忽略
        if (deltaY < 0) {
            video.volume = Math.min(1, video.volume + 0.1);
        } else {
            video.volume = Math.max(0, video.volume - 0.1);
        }
    }
}