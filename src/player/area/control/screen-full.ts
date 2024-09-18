import { Player } from "../..";
import svg_24exitfullscreen from "../../../assets/svg/24exitfullscreen.svg";
import svg_24fullscreen from "../../../assets/svg/24fullscreen.svg";
import { customElement } from "../../../utils/Decorator/customElement";

/** 全屏 */
@customElement('label')
export class ScreenFull extends HTMLLabelElement {

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

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'bofqi-area-screen-full');
        this.innerHTML = svg_24fullscreen + svg_24exitfullscreen;

        this.addEventListener('click', this.#toggle);
    }

    /** 键盘事件回调 */
    #onKeyDown = ({ key, shiftKey, ctrlKey, altKey, metaKey }: KeyboardEvent) => {
        try {
            const { activeElement } = document;
            if (activeElement === document.body || activeElement === this.#player || this.#player.contains(activeElement) && !(activeElement?.hasAttribute('contenteditable') || activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
                switch (key) {
                    // 不能区分小键盘，但能识别 Shift 后的值
                    case 'F': case 'f': {
                        // 全屏
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

    /** 全屏切换 */
    #toggle = () => {
        this.#player.$isFullScreen ? document.exitFullscreen() : this.#player.requestFullscreen();
    }
}