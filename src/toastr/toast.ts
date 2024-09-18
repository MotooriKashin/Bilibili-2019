import { customElement } from "../utils/Decorator/customElement";

@customElement('div')
export class Toast extends HTMLDivElement {

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
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 通知类型 */
    set $type(v: 'success' | 'warn' | 'error' | '') {
        switch (v) {
            case "": {
                this.classList.remove('success');
                this.classList.remove('warn');
                this.classList.remove('error');
                break;
            }
            default: {
                this.classList.remove('success');
                this.classList.remove('warn');
                this.classList.remove('error');
                this.classList.add(v);
                break;
            }
        }
    }

    /** 设定通知存在时间：单位/秒（为 0 时将永远存在直到重新设定） */
    set $delay(v: number) {
        if (v) {
            this.style.setProperty('--delay', v + 's');
            this.classList.remove('hold');
        } else {
            this.style.removeProperty('--delay');
            this.classList.add('hold');
        }
    }

    constructor(...args: string[]) {
        super();

        this.innerText = args.join('\n');
        this.addEventListener('animationend', this.onAnimationEnd)
    }

    private onAnimationEnd = ({ animationName }: AnimationEvent) => {
        if (animationName === 'toastr') {
            this.addEventListener('transitionend', () => {
                this.remove();
            }, { once: true });
            this.classList.add('hide');
            this.removeEventListener('animationend', this.onAnimationEnd);
        }
    }

    /** 补充通知内容 */
    appendText(...args: string[]) {
        this.innerText += '\n' + args.join('\n');
    }
}