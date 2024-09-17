import { Player } from "../..";
import svg_24danmuforbid from "../../../assets/svg/24danmuforbid.svg";
import svg_24danmuoff from "../../../assets/svg/24danmuoff.svg";
import svg_24danmuon from "../../../assets/svg/24danmuon.svg";
import svg_48danmubottom from "../../../assets/svg/48danmubottom.svg";
import svg_48danmunormal from "../../../assets/svg/48danmunormal.svg";
import svg_48danmutop from "../../../assets/svg/48danmutop.svg";
import { DANMAKU } from "../../../danmaku/block";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { ev, PLAYER_EVENT } from "../../event";
import { options } from "../../option";
import { Slider } from "../../widget/slider";

/** 弹幕控制 */
@customElement('label')
export class Danmaku extends HTMLLabelElement {

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

    #wrap = Element.add('div', { class: 'bofqi-danmaku-wrap' });

    /** 不透明度 */
    #opacity = new Slider();

    /** 防挡字幕 */
    #preventShade = Element.add('input', { attribute: { type: 'checkbox' } });

    /** 顶端弹幕 */
    #top = Element.add('div', { class: 'bofqi-danmaku-block', innerHTML: svg_48danmutop + svg_24danmuforbid, data: { label: '顶端弹幕' } });

    /** 底端弹幕 */
    #bottom = Element.add('div', { class: 'bofqi-danmaku-block', innerHTML: svg_48danmubottom + svg_24danmuforbid, data: { label: '底端弹幕' } });

    /** 滚动弹幕 */
    #scroll = Element.add('div', { class: 'bofqi-danmaku-block', innerHTML: svg_48danmunormal + svg_24danmuforbid, data: { label: '滚动弹幕' } });

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'bofqi-area-danmaku');
        this.innerHTML = svg_24danmuon + svg_24danmuoff;

        this.#opacity.$hint = true;
        this.#opacity.formatHint(v => {
            return Math.floor(+v) + '%';
        });

        this.#wrap.append(
            Element.add('div', { class: 'bofqi-danmaku-wrap-item', data: { label: '不透明度' }, children: this.#opacity }),
            Element.add('div', { class: 'bofqi-danmaku-wrap-item', data: { label: '防档字幕' }, children: this.#preventShade }),
            Element.add('div', { class: ['bofqi-danmaku-wrap-item', 'space-between'], children: [this.#top, this.#bottom, this.#scroll] }),
        );


        this.addEventListener('click', this.#toggle);
        this.#opacity.addEventListener('change', () => {
            options.danmaku.opacity = Math.max(0.01, Math.min(1, +this.#opacity.$value / 100));
        });
        this.#preventShade.addEventListener('change', () => {
            options.danmaku.preventShade = this.#preventShade.checked;
        });
        this.#top.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.TOP;
        });
        this.#bottom.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.BOTTOM;
        });
        this.#scroll.addEventListener('click', () => {
            options.danmaku.block ^= DANMAKU.SCROLL;
        });

        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { visible, opacity, preventShade, block } = detail.danmaku;

            this.classList.toggle('off', !visible);
            this.#opacity.$value = <any>Math.max(1, Math.min(100, opacity * 100));
            this.#preventShade.checked = preventShade;
            this.#top.classList.toggle('block', Boolean(block & DANMAKU.TOP));
            this.#bottom.classList.toggle('block', Boolean(block & DANMAKU.BOTTOM));
            this.#scroll.classList.toggle('block', Boolean(block & DANMAKU.SCROLL));
        });
    }

    /** 键盘事件回调 */
    #onKeyDown = ({ key, shiftKey, ctrlKey, altKey, metaKey }: KeyboardEvent) => {
        try {
            const { activeElement } = document;
            if (activeElement === document.body || activeElement === this.#player || this.#player.contains(activeElement) && !(activeElement?.hasAttribute('contenteditable') || activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
                switch (key) {
                    // 不能区分小键盘，但能识别 Shift 后的值
                    case 'D': case 'd': {
                        // 弹幕开关
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
        options.danmaku.visible = !options.danmaku.visible;
    }
}