import { Player } from "../../..";
import { CSSStyleSheet2HTMLStyleElement } from "../../../../utils/CSSStyleSheet2HTMLStyleElement";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Format } from "../../../../utils/fomat";
import { ev, PLAYER_EVENT } from "../../../event";
import { Slider } from "../../../widget/slider";
import stylesheet from "./index.css" with {type: 'css'};

/** 播放器进度条 */
@customElement('form')
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

    /** 每当元素添加到文档中时调用。 */
    connectedCallback() {
        self.addEventListener('keydown', this.#onKeyDown);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        self.removeEventListener('keydown', this.#onKeyDown);
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    /** 缓冲 */
    #buffer = document.createElement('progress');

    /** 时间戳 */
    $hover = this.appendChild(document.createElement('div'));

    #time = document.createElement('time');

    #preTime = 0;

    constructor(player: Player) {
        super();

        // this.#host.adoptedStyleSheets = [stylesheet]; // 文档画中画模式会导致构造的样式表丢失，暂时取道 style 元素代替
        this.appendChild(CSSStyleSheet2HTMLStyleElement(stylesheet));
        this.#player = player;
        this.classList.add('bofqi-area-progress');
        this.$bar.insertAdjacentElement('afterend', this.#buffer);

        this.$defaultValue = 0;
        this.$step = 'any';
        this.#buffer.classList.add('buffer');
        this.$hover.classList.add('bofqi-area-progress-detail');
        this.$hover.innerHTML = `<div class="progress-detail-sign"></div>`;
        this.$hover.appendChild(this.#time);

        player.$video.addEventListener('durationchange', () => {
            this.$max = player.$video.duration;
        });
        player.$video.addEventListener('timeupdate', () => {
            const time = Math.floor(player.$video.currentTime);
            if (this.#preTime !== time) {
                // 本事件一秒可能触发几十次，精确到整数以避免频繁操作带来性能问题
                this.$value = player.$video.currentTime;
                this.#preTime = time;
            }
        });
        player.$video.addEventListener('canplay', () => {
            this.classList.remove('disabled');
        });
        player.$video.addEventListener('progress', () => {
            const { buffered, duration } = player.$video;
            if (duration) {
                const arr: [number, number][] = [];
                for (let i = 0, len = buffered.length; i < len; i++) {
                    arr.push([buffered.start(i) / duration, buffered.end(i) / duration]);
                }
                arr.sort((a, b) => a[0] - b[0] > 0 ? 1 : -1);
                const linear: [string, string, string][] = [];
                /** 当前最大值，用于还原背景色 */
                let max = 0;
                for (const buffer of arr) {
                    linear.push(
                        ['transparent', Format.toFixed(max * 100) + '%', Format.toFixed(buffer[0] * 100) + '%'],
                        ['var(--8adced)', Format.toFixed(buffer[0] * 100) + '%', Format.toFixed(buffer[1] * 100) + '%']
                    );
                    max = buffer[1];
                }
                linear.push(['transparent', Format.toFixed(max * 100) + '%', '100%']);
                this.#buffer.style.setProperty('--linear-gradient', `linear-gradient(to right,${linear.map(d => d.join(' ')).join(',')})`);
            }
        });
        // this.addEventListener('change', () => {
        //     const detail = this.$value;
        //     const { duration } = player.$video;
        //     const time = Format.fmRange((detail || 0), 0, duration);
        //     player.$video.$seek(time);
        // });
        this.addEventListener('click', e => {
            const detail = this.#getPersent(e);
            const { duration } = this.#player.$video;
            const time = Format.fmRange(detail * duration, 0, duration);
            player.$video.$seek(time);
        });
        this.addEventListener('pointerenter', this.#mouseEnter);
        this.addEventListener('pointerleave', this.#mouseLeave);
        ev.bind(PLAYER_EVENT.VIDEO_DESTORY, this.#indetify);

        this.#indetify();
    }

    /** 键盘事件回调 */
    #onKeyDown = ({ key, shiftKey, ctrlKey, altKey, metaKey }: KeyboardEvent) => {
        try {
            const { activeElement } = document;
            if (activeElement === document.body || activeElement === this.#player || this.#player.contains(activeElement) && !(activeElement?.hasAttribute('contenteditable') || activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
                switch (key) {
                    // 不能区分小键盘，但能识别 Shift 后的值
                    case 'ArrowRight': {
                        // 快进 5 秒
                        shiftKey || ctrlKey || altKey || metaKey || (this.#player.$video.currentTime += 5);
                        break;
                    }
                    case 'ArrowLeft': {
                        // 快退 5 秒
                        shiftKey || ctrlKey || altKey || metaKey || (this.#player.$video.currentTime -= 5);
                        break;
                    }
                }
                // switch (code) {
                //     // 能区分小键盘，但不识别 Shift 后的值
                // }
            }
        } catch { }
    }

    #mouseEnter = () => {
        this.addEventListener('pointermove', this.#mouseHoverLinster);
    }

    #mouseLeave = () => {
        this.removeEventListener('pointermove', this.#mouseHoverLinster);
    }

    /** 根据鼠标事件获取百分比 */
    #getPersent(e: MouseEvent) {
        const { offsetX } = e;
        const $all = this.clientWidth;
        return Format.fmRange(offsetX, 0, $all) / $all
    }

    #mouseHoverLinster = (e: MouseEvent) => {
        const { offsetX } = e;
        const detail = this.#getPersent(e);
        const { duration } = this.#player.$video;
        this.$hover.style.setProperty('--inline-start', `${offsetX}px`);
        const time = Format.fmRange(detail * duration, 0, duration);
        this.#time.textContent = this.#time.dateTime = Format.fmSeconds(time);
        ev.trigger(PLAYER_EVENT.PROGRESS_HOVER, time);
    }

    #indetify = () => {
        this.#preTime = -1;
        this.classList.add('disabled');
        this.$value = 0;
    }
}