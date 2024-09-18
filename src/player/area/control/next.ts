import { Player } from "../..";
import svg_xiayiji from "../../../assets/svg/xiayiji.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { ev, PLAYER_EVENT } from "../../event";

/** 下一个 */
@customElement('label')
export class Next extends HTMLLabelElement {

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

    private $callNext?: () => void;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'hidden');
        this.innerHTML = svg_xiayiji;

        ev.bind(PLAYER_EVENT.CALL_NEXT_REGISTER, ({ detail }) => {
            if (detail) {
                this.$callNext = detail;
                this.classList.remove('hidden');
                navigator.mediaSession.setActionHandler('nexttrack', this.#callNext);
            } else {
                delete this.$callNext;
                this.classList.add('hidden');
                navigator.mediaSession.setActionHandler('nexttrack', null);
            }
        })
        this.addEventListener('click', this.#callNext);
    }

    #callNext = () => {
        this.$callNext?.();
        delete this.$callNext;
        this.classList.add('hidden');
    }
}