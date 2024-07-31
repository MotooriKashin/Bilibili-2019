import { customElement } from "../../../utils/Decorator/customElement";
import svg_screen_wide_on from "../../assets/svg/screen-wide-on.svg";
import svg_screen_wide from "../../assets/svg/screen-wide.svg";
import { PLAYER_EVENT, ev } from "../../event-target";
import { PLAYER_MODE, PLAYER_STATE } from "../../state";

/** 播放器宽屏控制 */
@customElement('button')
export class Wide extends HTMLButtonElement {

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
    // connectedCallback() {  }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    constructor() {
        super();

        this.classList.add('bofqi-control-button');

        this.insertAdjacentHTML('beforeend', svg_screen_wide);

        this.addEventListener('click', () => {
            ev.trigger(PLAYER_EVENT.PLAYER_MODE, PLAYER_STATE.mode ^= PLAYER_MODE.WIDE);
        });

        ev.bind(PLAYER_EVENT.PLAYER_MODE, ({ detail }) => {
            this.innerHTML = detail & PLAYER_MODE.WIDE ? svg_screen_wide_on : svg_screen_wide;
        });
    }
}