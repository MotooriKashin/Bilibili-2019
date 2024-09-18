import { Player } from "../..";
import svg_24soundlarge from "../../../assets/svg/24soundlarge.svg";
import svg_24soundoff from "../../../assets/svg/24soundoff.svg";
import svg_24soundsmall from "../../../assets/svg/24soundsmall.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { ev, PLAYER_EVENT } from "../../event";
import { Slider } from "../../widget/slider";

/** 音量控制 */
@customElement('label')
export class Volume extends HTMLLabelElement {

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
        self.addEventListener('keydown', this.#onKeyDown);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.#wrap.remove();
        self.removeEventListener('keydown', this.#onKeyDown);
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    #wrap = document.createElement('div');

    #slider = this.#wrap.appendChild(new Slider());

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'bofqi-area-volume');
        this.innerHTML = svg_24soundsmall + svg_24soundlarge + svg_24soundoff;
        this.#wrap.classList.add('bofqi-volume-wrap');
        this.#slider.classList.add('bofqi-volume-slider');

        player.$video.addEventListener('volumechange', this.#volumeChange);
        player.$video.addEventListener('canplay', () => {
            this.classList.remove('disabled');
            this.#volumeChange();
        });
        ev.bind(PLAYER_EVENT.VIDEO_DESTORY, this.#indetify);
        this.addEventListener('click', this.#toggle);
        this.#slider.addEventListener('change', () => {
            player.$video.volume = +this.#slider.$value / 100;
        });
        this.#wrap.addEventListener('wheel', e => {
            // 响应滚轮
            e.stopPropagation();
            this.#wheel(e);
        }, { passive: true });

        this.#indetify();
    }

    /** 键盘事件回调 */
    #onKeyDown = ({ key, shiftKey, ctrlKey, altKey, metaKey }: KeyboardEvent) => {
        try {
            const { activeElement } = document;
            if (activeElement === document.body || activeElement === this.#player || this.#player.contains(activeElement) && !(activeElement?.hasAttribute('contenteditable') || activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
                switch (key) {
                    // 不能区分小键盘，但能识别 Shift 后的值
                    case 'M': case 'm': {
                        // 音量开关
                        shiftKey || ctrlKey || altKey || metaKey || this.#toggle();
                        break;
                    }
                }
                // switch (code) {
                //     // 能区分小键盘，但不识别 Shift 后的值
                // }
            }
        } catch { }
    }

    /** 开关切换 */
    #toggle = () => {
        this.#player.$video.muted = !this.#player.$video.muted;
    }

    /** 视频音量变动回调 */
    #volumeChange = () => {
        const { muted, volume } = this.#player.$video;
        this.classList.toggle('muted', muted);
        this.classList.toggle('large', volume >= 0.5);
        this.#wrap.dataset.volume = this.#slider.$value = <any>Math.floor(volume * 100);
    }

    /** 滚轮响应 */
    #wheel = (e: WheelEvent) => {
        const { deltaY } = e;
        // 超出范围会报错，直接忽略
        if (deltaY < 0) {
            this.#player.$video.volume = Math.min(1, this.#player.$video.volume + 0.1);
        } else {
            this.#player.$video.volume = Math.max(0, this.#player.$video.volume - 0.1);
        }
    }

    #indetify = () => {
        this.classList.add('disabled');
    }
}