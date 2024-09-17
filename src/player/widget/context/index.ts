import { customElement } from "../../../utils/Decorator/customElement";

/** 右键菜单 */
@customElement('ul')
export class Context extends HTMLUListElement {

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
    // attributeChangedCallback(name: string, oldValue: string, newValue: string) {}

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #clientX = 0;

    #clientY = 0;

    #maxWidth = 0;

    #maxHeight = 0;

    /** 右键菜单 */
    constructor(private $target: HTMLElement) {
        super();
        this.popover = 'auto';
        this.classList.add('bpui-context');

        this.$target.addEventListener('contextmenu', this.onContextMenu);
        this.addEventListener('click', e => {
            e.stopPropagation();
            this.hidePopover();
            this.remove();
        });
        new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    this.positionfix();
                    break;
                }
            }
        }).observe(this);
    }

    /** 右键菜单响应 */
    private onContextMenu = (ev: MouseEvent) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        const { clientX, clientY } = ev;
        const { clientWidth: maxWidth, clientHeight: maxHeight } = document.documentElement;
        this.#clientX = clientX;
        this.#clientY = clientY;
        this.#maxWidth = maxWidth;
        this.#maxHeight = maxHeight;
        this.$target.insertAdjacentElement('afterend', this);
        this.showPopover();
        document.addEventListener('click', () => {
            this.remove();
        }, { once: true });
        this.positionfix();
        this.dispatchEvent(new CustomEvent('open', { detail: ev }));
    }

    private positionfix() {
        const { clientWidth, clientHeight } = this;
        if (this.#clientX + clientWidth > this.#maxWidth) {
            this.style.insetInlineStart = '';
            this.style.insetInlineEnd = '0';
        } else {
            this.style.insetInlineStart = `${this.#clientX}px`;
            this.style.insetInlineEnd = '';
        }
        if (this.#clientY + clientHeight > this.#maxHeight) {
            this.style.insetBlockStart = '';
            this.style.insetBlockEnd = '0';
        } else {
            this.style.insetBlockStart = `${this.#clientY}px`;
            this.style.insetBlockEnd = '';
        }
    }
}