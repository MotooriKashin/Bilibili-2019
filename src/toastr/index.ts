import { customElement } from "../utils/Decorator/customElement";
import { Element } from "../utils/element";
import { TOTP } from "../utils/TOTP";
import { Toast } from "./toast";

@customElement(undefined, `toastr-${TOTP.now()}`)
class Toastr extends HTMLElement {

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
        this.popover = 'manual';
        this.showPopover();
    }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #host = this.attachShadow({ mode: 'closed' });

    #style = this.#host.appendChild(Element.add('style', undefined, undefined, __BILI_TOASTR_STYLE__));

    #container = this.#host.appendChild(Element.add('div', { class: 'container' }));

    /** 设定默认通知存在时间：单位/秒（会被通知实例自己设定的时间覆盖） */
    set $delay(v: number) {
        v ? this.style.setProperty('--delay', v + 's') : this.style.removeProperty('--delay');
    }

    set $position(v: 'top-left' | 'bottom-left' | 'bottom-right' | '') {
        switch (v) {
            case "": {
                this.#container.classList.remove('top-left');
                this.#container.classList.remove('bottom-left');
                this.#container.classList.remove('bottom-right');
                break;
            }
            default: {
                this.#container.classList.remove('top-left');
                this.#container.classList.remove('bottom-left');
                this.#container.classList.remove('bottom-right');
                this.#container.classList.add(v);
            }
        }
    }

    info(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        this.#container.appendChild(div);

    }

    success(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        div.$type = 'success';
        this.#container.appendChild(div);
    }

    warn(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        div.$type = 'warn';
        this.#container.appendChild(div);
    }

    error(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        div.$type = 'error';
        this.#container.appendChild(div);
    }
}

export const toastr = new Toastr();

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_TOASTR_STYLE__: string;
}
