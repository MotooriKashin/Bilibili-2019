import { Player } from "../..";
import svg_24exitpip from "../../../assets/svg/24exitpip.svg";
import svg_24pip from "../../../assets/svg/24pip.svg";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";

/** 画中画模式 */
@customElement('label')
export class ScreenPip extends HTMLLabelElement {

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
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'bofqi-area-screen-pip');
        this.innerHTML = svg_24pip + svg_24exitpip;

        this.addEventListener('click', () => {
            if (documentPictureInPicture.window) { } else {
                const parrent = this.#player.parentElement!;
                const prev = this.#player.nextElementSibling;
                documentPictureInPicture.requestWindow({
                    width: this.#player.clientWidth,
                    height: this.#player.clientHeight
                }).then(d => {
                    d.window.document.documentElement.style.colorScheme = 'light dark'; // 适配颜色模式
                    d.window.document.body.style.margin = '0'; // 取消外边距
                    d.window.document.body.append(this.#player);
                    d.addEventListener('pagehide', () => {
                        parrent.insertBefore(this.#player, prev);
                        documentPictureInPicture.window?.close();
                    }, { once: true });
                }).catch(e => {
                    toastr.error(e);
                    console.log(e);
                });
            }
        });
    }
}