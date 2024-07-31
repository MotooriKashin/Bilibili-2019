import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { PLAYER_EVENT, ev } from "../../event-target";
import { Slider } from "../../widget/slider";
import { video } from "../wrap/video";

/** 进度条 */
@customElement('input')
export class Progress extends Slider {

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
    connectedCallback() {
        this.insertAdjacentElement('afterend', this.$detail);
    }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #currentTime = 0;

    constructor() {
        super();

        this.classList.add('bofqi-control-progress');
        this.disabled = true;

        video.addEventListener('durationchange', () => {
            this.max = <any>Math.floor(video.duration);
            this.disabled = video.duration > 0 ? false : true;
        });
        video.addEventListener('timeupdate', () => {
            if (this.#currentTime !== Math.ceil(video.currentTime)) {
                // 按秒更新即可，无需频繁修改
                this.$value = <any>video.currentTime;
            }
            this.#currentTime = Math.ceil(video.currentTime);
        });
        video.addEventListener('progress', () => {
            this.buffer(video);
        });

        ev.bind(PLAYER_EVENT.IDENTIFY, this.identity);

        this.addEventListener('click', (e: MouseEvent) => {
            const detail = this.getPersent(e);
            const { duration } = video;
            const time = Format.fmRange(detail * duration, 0, duration);
            video.seek(time);
        });
        this.addEventListener('pointerenter', this.mouseEnter);
        this.addEventListener('pointerleave', this.mouseLeave);
    }

    /** 浮动提示容器 */
    protected $detail = Element.add('div', {
        class: 'bofqi-control-progress-detail'
    }, undefined, `<div class="bofqi-control-progress-detail-sign"></div>`);

    /** 时间 */
    protected $time = Element.add('div', { class: 'bofqi-control-progress-detail-time' }, this.$detail, undefined, true);

    /** 预览图 */
    protected $img = Element.add('div', { class: 'bofqi-control-progress-detail-img' }, this.$detail, undefined, true);

    /** 更新缓冲条 */
    protected buffer(video: HTMLVideoElement) {
        const { buffered, duration } = video;
        if (duration) {
            const arr: [number, number][] = [];
            for (let i = 0, len = buffered.length; i < len; i++) {
                arr.push([buffered.start(i) / duration, buffered.end(i) / duration]);
            }
            this.$buffer = arr;
        }
    }

    private mouseEnter = (e: MouseEvent) => {
        self.addEventListener('pointermove', this.mouseHoverLinster);
    }

    private mouseLeave = (e: MouseEvent) => {
        self.removeEventListener('pointermove', this.mouseHoverLinster);
    }

    /** 根据鼠标事件获取百分比 */
    private getPersent(e: MouseEvent) {
        const { offsetX } = e;
        const $all = this.clientWidth;
        return Format.fmRange(offsetX, 0, $all) / $all
    }

    private mouseHoverLinster = (e: MouseEvent) => {
        const { offsetX } = e;
        const detail = this.getPersent(e);
        const { duration } = video;
        this.$detail.style.setProperty('--inline-start', `${offsetX}px`);
        const time = Format.fmRange(detail * duration, 0, duration);
        this.$time.textContent = Format.fmSeconds(time);
        ev.trigger(PLAYER_EVENT.PROGRESS_VIDEOSHOT, [this.$img, time]);
    }

    protected identity = () => {
        this.$value = <any>0;
        this.$buffer = [];
        this.$img.removeAttribute('style');
        this.$img.replaceChildren();
    }
}