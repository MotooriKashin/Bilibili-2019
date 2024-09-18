import { customElement } from "../utils/Decorator/customElement";
import { Toast } from "./toast";
import stylesheet from "./index.css" with {type: 'css'};

@customElement(undefined, `toastr-${Date.now()}`)
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

    #container = this.#host.appendChild(document.createElement('div'))

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

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];
        this.#container.classList.add('container');
    }

    info(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        this.#container.appendChild(div);
        return div;
    }

    success(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        div.$type = 'success';
        this.#container.appendChild(div);
        return div;
    }

    warn(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        div.$type = 'warn';
        this.#container.appendChild(div);
        return div;
    }

    error(...args: string[]) {
        document.body.contains(this) || document.body.appendChild(this);
        const div = new Toast(...args);
        div.$type = 'error';
        this.#container.appendChild(div);
        return div;
    }
}

/** 通知组件 */
export const toastr = new Toastr();
