import { customElement } from "../../../utils/Decorator/customElement";
import svg_screen_full from "../../assets/svg/screen-full.svg";
import { PLAYER_EVENT, ev } from "../../event-target";
import { PLAYER_MODE, PLAYER_STATE } from "../../state";

/** 播放器全屏控制 */
@customElement('button')
export class Fullscreen extends HTMLButtonElement {

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

    /** 全屏时鼠标显隐控制句柄 */
    protected cursorTimer?: number;
    /** 全屏时控制栏显隐控制句柄 */
    protected opacityTimer?: number;
    /** 是否显示鼠标 */
    protected isCursor = true;
    /** 是否显示控制栏 */
    protected isOpacity = true;

    constructor() {
        super();

        this.classList.add('bofqi-control-button', 'bofqi-control-fullscreen');

        this.insertAdjacentHTML('afterbegin', svg_screen_full);

        this.addEventListener('click', () => {
            ev.trigger(PLAYER_EVENT.PLAYER_MODE, PLAYER_STATE.mode ^= PLAYER_MODE.FULL);
        });


        ev.bind(PLAYER_EVENT.FULLSCREEN_CHANGE, ({ detail }) => {
            if (detail) {
                self.addEventListener('pointermove', this.pointerMove);
            } else {
                clearTimeout(this.cursorTimer);
                clearTimeout(this.opacityTimer);
                self.removeEventListener('pointermove', this.pointerMove);
                this.cursor();
                this.opacity();
            }
        });
    }

    /** 全屏移动鼠标响应 */
    protected pointerMove = (ev: MouseEvent) => {
        clearTimeout(this.cursorTimer);
        clearTimeout(this.opacityTimer);
        if (ev.clientY) {
            if (ev.clientY < this.parentElement!.parentElement!.clientHeight / 3 * 2) {
                // 仅显示鼠标
                this.cursor();
                this.noCursor(2000);
                this.noOpacity(2000);
            } else {
                // 显示鼠标和控制栏
                this.cursor();
                this.opacity();
                this.noCursor(2000);
                this.noOpacity(2000);
            }
        }
    }

    /** 显示鼠标 */
    protected cursor() {
        this.isCursor || this.parentElement!.parentElement!.classList.remove('no-cursor');
        this.isCursor = true;
    }

    /** 隐藏鼠标 */
    protected noCursor(time = 5000) {
        this.cursorTimer = setTimeout(() => {
            this.parentElement!.parentElement!.classList.add('no-cursor');
            this.isCursor = false;
        }, time);
    }

    /** 显示控制栏 */
    protected opacity() {
        if (!this.isOpacity) {
            this.parentElement!.parentElement!.classList.remove('hide');
            this.isOpacity = true;
        }
    }

    /** 隐藏控制栏 */
    protected noOpacity(time = 5000) {
        this.opacityTimer = setTimeout(() => {
            this.parentElement!.parentElement!.classList.add('hide');
            this.isOpacity = false;
        }, time);
    }
}