import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { PLAYER_EVENT, ev } from "../../event-target";
import { video } from "../wrap/video";

/** 播放器时间轴显示 */
@customElement('output')
export class Time extends HTMLOutputElement {

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

    /** 跳转输入 */
    protected $seek = Element.add('input', { class: 'bofqi-control-time-seek', value: "00:00" }, this);

    /** 时间戳容器 */
    protected $wrap = Element.add('div', { class: 'bofqi-control-time-wrap' }, this);

    /** 当前时间 */
    protected $current = Element.add('span', { class: 'bofqi-control-time-now' }, this.$wrap, '00:00');

    /** 分隔符 */
    protected $divider = Element.add('span', { class: 'bofqi-control-divider' }, this.$wrap, '/');

    /** 合计时间 */
    protected $total = Element.add('span', { class: 'bofqi-control-time-total' }, this.$wrap, '00:00');

    #current = 0;

    /** 当前时间 */
    set current(value: number) {
        this.$current.textContent = Format.fmSeconds(this.#current = value);
    }

    #total = 0;

    /** 合计时间 */
    set total(value: number) {
        this.$total.textContent = Format.fmSeconds(this.#total = value);
    }

    constructor() {
        super();

        this.classList.add('bofqi-control-time');

        video.addEventListener('timeupdate', () => {
            // 当前时间更新
            this.current = video.currentTime;
        })
        video.addEventListener('durationchange', () => {
            // 合计时间更新
            this.total = video.duration;
        });
        ev.bind(PLAYER_EVENT.IDENTIFY, this.identity);
        this.$wrap.addEventListener('click', e => {
            // 输入跳帧
            e.stopPropagation();
            if (this.#total) {
                this.classList.add('seeking');
                this.$seek.focus();
                this.$seek.value = Format.fmSeconds(this.#current);
                this.$seek.addEventListener('focusout', this.focusout, { once: true });
                this.$seek.addEventListener('keydown', this.keydown);
            }
        });
    }

    protected focusout = () => {
        this.$seek.removeEventListener('keydown', this.keydown);
        this.classList.remove('seeking');
        const newTime = Format.fmSecondsReverse(this.$seek.value);
        if (this.#current !== newTime) {
            // 跳帧播放
            video.seek(newTime);
        }
    }

    protected keydown = (e: KeyboardEvent) => {
        e.stopPropagation();
        switch (e.key) {
            case 'Enter': {
                this.$seek.removeEventListener('focusout', this.focusout);
                this.$seek.removeEventListener('keydown', this.keydown);
                this.classList.remove('seeking');
                const newTime = Format.fmSecondsReverse(this.$seek.value);
                if (this.#current !== newTime) {
                    // 跳帧播放
                    video.seek(newTime);
                }
                this.$seek.removeEventListener('keydown', this.keydown);
                break;
            }
            case 'Escape': {
                this.$seek.removeEventListener('focusout', this.focusout);
                this.$seek.removeEventListener('keydown', this.keydown);
                this.classList.remove('seeking');
                this.$seek.removeEventListener('keydown', this.keydown);
                break;
            }
        }
    }

    protected identity = () => {
        this.#current = this.#total = 0;
    }
}