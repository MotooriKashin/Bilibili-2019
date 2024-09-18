import { Player } from "../..";
import { customElement } from "../../../utils/Decorator/customElement";
import { Format } from "../../../utils/fomat";
import { ev, PLAYER_EVENT } from "../../event";

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

    #player: Player;

    /** 跳转输入 */
    #seek = this.appendChild(document.createElement('input'));

    /** 时间戳容器 */
    #wrap = this.appendChild(document.createElement('div'));

    /** 当前时间 */
    #current = this.#wrap.appendChild(document.createElement('time'));

    /** 分隔符 */
    #divider = this.#wrap.appendChild(document.createElement('span'));

    /** 合计时间 */
    #total = this.#wrap.appendChild(document.createElement('time'));

    #currentTime = 0;

    /** 当前时间 */
    set $current(value: number) {
        this.#current.dateTime = this.#current.textContent = Format.fmSeconds(this.#currentTime = value);
    }

    #totalTime = 0;

    /** 合计时间 */
    set $total(value: number) {
        this.#total.dateTime = this.#total.textContent = Format.fmSeconds(this.#totalTime = value);
    }

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-control-time');
        this.#seek.classList.add('bofqi-control-time-seek');
        this.#seek.value = '00:00';
        this.#wrap.classList.add('bofqi-control-time-wrap');
        this.#current.classList.add('bofqi-control-time-now');
        this.#divider.classList.add('bofqi-control-divider');
        this.#divider.innerText = '/';
        this.#total.classList.add('bofqi-control-time-total');


        player.$video.addEventListener('timeupdate', () => {
            // 当前时间更新
            this.$current = player.$video.currentTime;
        })
        player.$video.addEventListener('durationchange', () => {
            // 合计时间更新
            this.$total = player.$video.duration;
        });
        ev.bind(PLAYER_EVENT.VIDEO_DESTORY, this.#identity);
        this.#wrap.addEventListener('click', e => {
            // 输入跳帧
            e.stopPropagation();
            if (this.#totalTime) {
                this.classList.add('seeking');
                this.#seek.focus();
                this.#seek.value = Format.fmSeconds(this.#currentTime);
                this.#seek.addEventListener('focusout', this.#onFocusOut, { once: true });
                this.#seek.addEventListener('keydown', this.#onKeyDown);
            }
        });

        this.#identity();
    }

    #onFocusOut = () => {
        this.#seek.removeEventListener('keydown', this.#onKeyDown);
        this.classList.remove('seeking');
        const newTime = Format.fmSecondsReverse(this.#seek.value);
        if (this.#currentTime !== newTime) {
            // 跳帧播放
            this.#player.$video.$seek(newTime);
        }
    }

    #onKeyDown = (e: KeyboardEvent) => {
        e.stopPropagation();
        switch (e.key) {
            case 'Enter': {
                this.#seek.removeEventListener('focusout', this.#onFocusOut);
                this.#seek.removeEventListener('keydown', this.#onKeyDown);
                this.classList.remove('seeking');
                const newTime = Format.fmSecondsReverse(this.#seek.value);
                if (this.#currentTime !== newTime) {
                    // 跳帧播放
                    this.#player.$video.$seek(newTime);
                }
                this.#seek.removeEventListener('keydown', this.#onKeyDown);
                break;
            }
            case 'Escape': {
                this.#seek.removeEventListener('focusout', this.#onFocusOut);
                this.#seek.removeEventListener('keydown', this.#onKeyDown);
                this.classList.remove('seeking');
                this.#seek.removeEventListener('keydown', this.#onKeyDown);
                break;
            }
        }
    }

    #identity = () => {
        this.$current = this.$total = 0;
    }
}