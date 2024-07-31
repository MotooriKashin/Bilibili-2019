import { Danmaku, IDanmaku } from "..";
import { customElement } from "../../utils/Decorator/customElement";
import { Format } from "../../utils/fomat";
import { ATTR } from "../attr";

/** 普通弹幕 */
@customElement('div')
export class Mode0 extends HTMLDivElement {

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

    /** 弹幕中换行符数量 */
    protected $wraps = 0;

    /** 是否允许渲染 */
    protected $render = true;

    /** 开始运动时间戳 */
    $starttimeStamp = 0;

    /** 结束运动时间戳 */
    $endtimeStamp = 0;

    /** 动画时长 */
    $duration = 0;

    /** 动画速度 */
    $speed = 1;

    /** 弹幕宽度 */
    $width = 0;

    /** 弹幕高度 */
    $height = 0;

    constructor(
        /** 弹幕管理组件 */
        protected $container: Danmaku,
        /** 弹幕数据 */
        public $dm: IDanmaku) {
        super();
        this.parseAction();

        this.classList.add('mode0');
        if ($dm.content) {
            const text = $dm.content.replace(/(\/n|\\n|\n|\r\n)/g, '\n');
            this.innerText = text;
            this.$wraps = text.split('\n').length;
        }
        $dm.fontsize && this.style.setProperty('--font-size', $dm.fontsize + 'px');
        if (this.$wraps > 10) {
            // 双排版弹幕
            this.classList.add('wraps');
        }
        $dm.color || this.style.setProperty('--text-shadow', '#ffffff');
        this.style.color = Format.hexColor($dm.color);
        if ($dm.picture) {
            // 图片弹幕
            this.innerHTML = `<img src="//${$dm.picture}" style="block-size: 1.125em;">`;
            this.style.blockSize = `1.125em`;
        }
        if ($dm.colorful) {
            // 大会员弹幕
            this.classList.add('colorful');
        }
        if (this.$wraps < 2 && (<any>$dm).attr & ATTR.LIKE) {
            this.classList.add('like');
            this.innerHTML = `
<span class="bg"><svg viewBox="0 0 33 34" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><linearGradient x1="7.083%" y1="100%" x2="91.088%" y2="0%" id="dm-1-svgo-a"><stop stop-color="#FF8558" offset="0%"></stop><stop stop-color="#FFE658" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M32 .5H17.5C8.387.5 1 7.887 1 17s7.387 16.5 16.5 16.5H32"></path><path d="M31.5 0v1H17C8.163 1 1 8.163 1 17c0 8.731 6.994 15.83 15.685 15.997L17 33h14.5v1H17C7.611 34 0 26.389 0 17 0 7.72 7.437.175 16.677.003L17 0h14.5z" fill="url(#dm-1-svgo-a)" fill-rule="nonzero" transform="translate(.5)"></path></g></svg></span>
<span class="bg1"><svg viewBox="0 0 117 34" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><linearGradient x1="0%" y1="50%" x2="93.237%" y2="49.773%" id="dm-2-svgo-a"><stop stop-color="#FFB158" offset="0%"></stop><stop stop-color="#FFE658" offset="21.558%"></stop><stop stop-color="#BC77FF" stop-opacity="0" offset="100%"></stop><stop stop-color="#BC77FF" stop-opacity="0" offset="100%"></stop></linearGradient><linearGradient x1=".731%" y1="50%" x2="89.119%" y2="49.996%" id="dm-2-svgo-b"><stop stop-color="#FFE658" offset="0%"></stop><stop stop-color="#BC77FF" stop-opacity="0" offset="100%"></stop><stop stop-color="#BC77FF" stop-opacity="0" offset="100%"></stop></linearGradient></defs><g fill-rule="nonzero" fill="none"><path fill="url(#dm-2-svgo-a)" d="M117 33v1H0v-1z"></path><path fill="url(#dm-2-svgo-b)" d="M117 0v1H0V0z"></path></g></svg></span>
<span class="bg2"><svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="dm-0-svgo-c"><stop stop-color="#FFE4AB" offset="0%"></stop><stop stop-color="#FFC573" offset="100%"></stop></linearGradient><filter x="-12.5%" y="-6.2%" width="125%" height="125%" filterUnits="objectBoundingBox" id="dm-0-svgo-a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation=".5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.20074847 0" in="shadowBlurOuter1"></feColorMatrix></filter><path d="M5.878 7.66V18H3.996A1.993 1.993 0 012 16.01V9.65c0-1.1.894-1.99 1.996-1.99h1.882zm5.17-5.493c.868.42 1.44 1.478 1.44 2.892 0 .846-.105 1.713-.316 2.601H16a2 2 0 011.942 2.479L16.68 15.26A3.6 3.6 0 0113.184 18H7.333l.001-10.853c1.047-.762 1.658-2.096 1.834-4.038.087-.964 1.005-1.364 1.88-.942z" id="dm-0-svgo-b"></path></defs><g transform="translate(-1 -2)" fill-rule="nonzero" fill="none"><use fill="#000" filter="url(#dm-0-svgo-a)" xlink:href="#dm-0-svgo-b"></use><use fill="url(#dm-0-svgo-c)" xlink:href="#dm-0-svgo-b"></use></g></svg></span>
<span class="content">${this.innerHTML}</span>`;
        }
    }

    /**
     * @see 文档 {@link https://info.bilibili.co/pages/viewpage.action?pageId=95154953}
     * @see 优先级 {@link https://www.tapd.bilibili.co/20062561/prong/stories/view/1120062561001659710}
     */
    private parseAction() {
        if (typeof this.$dm.action === 'string') {
            const list = this.$dm.action.split(';');
            list.forEach(d => {
                const ele = d.split(':');
                if (ele[0] && ele[1]) {
                    Reflect.set(this.$dm, ele[0], ele[1]);
                }
            });
        }
    }
}