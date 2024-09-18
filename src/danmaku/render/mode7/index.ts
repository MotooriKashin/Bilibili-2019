import { Danmaku, IDanmaku } from "../..";
import { CSSStyleSheet2HTMLStyleElement } from "../../../utils/CSSStyleSheet2HTMLStyleElement";
import { customElement } from "../../../utils/Decorator/customElement";
import { Format } from "../../../utils/fomat";
import stylesheet from "./index.css" with {type: 'css'};

@customElement(undefined, `mode7-${Date.now()}`)
export class Mode7 extends HTMLElement {

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
        this.$dm.on = true;
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.$dm.on = false;
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    private $host = this.attachShadow({ mode: 'closed' });

    private $pre = this.$host.appendChild(document.createElement('pre'));

    constructor(
        /** 弹幕数据 */
        public $dm: IDanmaku,
        /** 弹幕管理器 */
        private $container: Danmaku,
    ) {
        super();

        // this.#host.adoptedStyleSheets = [stylesheet]; // 文档画中画模式会导致构造的样式表丢失，暂时取道 style 元素代替
        this.$host.appendChild(CSSStyleSheet2HTMLStyleElement(stylesheet));

        this.$pre.addEventListener('animationend', this.$animationend);
    }

    async execute($delay = 0) {
            this.$decode();
            $delay && this.$pre.style.setProperty('--delay', <any>$delay);
            this.$container.$host.appendChild(this);
    }

    /** 位移等比放大处理 */
    private $insetFix(v: number) {
        if (v > 0 && v < 1) {
            // 位移值在 0-1 之间的说明是百分比
            return Math.floor(v * 100) + 'cqi';
        }
        return this.$container.$mode7Scale ? `calc(100cqb / 440 * ${v})` : v + 'px';
    }

    private $insetFiy(v: number) {
        if (v > 0 && v < 1) {
            return Math.floor(v * 100) + 'cqb';
        }
        return this.$container.$mode7Scale ? `calc(100cqb / 440 * ${v})` : v + 'px';
    }

    private $decode() {
        try {
            typeof this.$dm.content === 'string' && (this.$dm.content = JSON.parse(this.$dm.content));
            const [startX, startY, opacity, duration, text, zRotate, yRotate, endX, endY, aTime, aDelay, stroked, family, linearSpeedUp, path] = <any>this.$dm.content;
            startX && this.$pre.style.setProperty('--startX', <any>this.$insetFix(startX));
            startY && this.$pre.style.setProperty('--startY', <any>this.$insetFiy(startY));
            opacity.split('-').forEach((d: number, i: number) => {
                if (i) {
                    d >= 0 && this.$pre.style.setProperty('--eOpacity', <any>d);
                } else {
                    d >= 0 && this.$pre.style.setProperty('--sOpacity', <any>d);
                }
            });
            duration >= 0 && this.$pre.style.setProperty('--duration', <any>(duration * 1000));
            if (text) {
                this.$pre.innerText = text.replace(/(\/n|\\n|\n|\r\n)/g, '\n');
                text.split('\n').length > 2 && this.$pre.classList.add('wraps');
            }
            zRotate && this.$pre.style.setProperty('--zRotate', <any>zRotate);
            yRotate && this.$pre.style.setProperty('--yRotate', <any>yRotate);
            this.$pre.style.setProperty('--endX', <any>this.$insetFix(endX ?? startX));
            this.$pre.style.setProperty('--endY', <any>this.$insetFiy(endY ?? startY));
            aTime && this.$pre.style.setProperty('--aTime', <any>aTime);
            aDelay && this.$pre.style.setProperty('--aDelay', <any>aDelay);
            stroked === 'false' && this.$pre.classList.add('no-stroked');
            family && (this.$pre.style.fontFamily = `${family}, Arial, Helvetica, sans-serif`);
            linearSpeedUp && linearSpeedUp !== '0' && (this.$pre.style.animationTimingFunction = 'ease-in');
            if (path) {
                this.$pre.style.setProperty('--path', <any>path);
                this.$pre.classList.add('path');
            }
            // 字体大小
            this.$container.$mode7Scale ? this.$pre.style.setProperty('--fontsize', <any>this.$dm.fontsize) : (this.$pre.style.fontSize = this.$dm.fontsize + 'px');
            // 字体颜色
            this.$dm.color || this.$pre.style.setProperty('--text-shadow', '#ffffff');
            this.$pre.style.color = Format.hexColor(this.$dm.color || 0);
        } catch { }
    }

    /** 运动结束处理 */
    private $animationend = ({ animationName }: AnimationEvent) => {
        if (animationName === 'opacity') {
            this.$pre.removeEventListener('animationend', this.$animationend);
            this.remove();
        }
    }
}