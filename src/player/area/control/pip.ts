import { customElement } from "../../../utils/Decorator/customElement";
import svg_screen_pip from "../../assets/svg/screen-pip.svg";
import { PLAYER_EVENT, ev } from "../../event-target";

/** 播放器画中画控制 */
@customElement('button')
export class Pip extends HTMLButtonElement {

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
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    constructor() {
        super();

        this.classList.add('bofqi-control-button', 'bofqi-control-fullscreen-pip');

        this.insertAdjacentHTML('afterbegin', svg_screen_pip);

        this.addEventListener('click', () => {
            ev.trigger(PLAYER_EVENT.PICTURE_IN_PICTURE, void 0);
        });
    }
}