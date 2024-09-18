import { IDanmaku } from "..";
import { Format } from "../../utils/fomat";

/** 普通弹幕 */
export abstract class Mode extends HTMLElement {

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

    /**
     * @see 文档 {@link https://info.bilibili.co/pages/viewpage.action?pageId=95154953}
     * @see 优先级 {@link https://www.tapd.bilibili.co/20062561/prong/stories/view/1120062561001659710}
     */
    static parseAction(dm: IDanmaku) {
        if (typeof dm.action === 'string') {
            const list = dm.action.split(';');
            list.forEach(d => {
                const ele = d.split(':');
                if (ele[0] && ele[1]) {
                    Reflect.set(dm, ele[0], ele[1]);
                }
            });
        }
    }

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

    /** 是否换行弹幕 */
    $wraps = false;

    constructor(
        /** 弹幕数据 */
        protected $dm: IDanmaku,
    ) {
        super();

        this.classList.add('dm');
        Mode.parseAction($dm);
        if ($dm.content) {
            const text = this.innerText = $dm.content.replace(/(\/n|\\n|\n|\r\n)/g, '\n');
            text.split('\n').length > 2 && (this.$wraps = true, this.classList.add('wraps'));
        }
        $dm.fontsize && this.style.setProperty('--fontsize', <any>$dm.fontsize);
        $dm.color || this.style.setProperty('--text-shadow', '#ffffff');
        this.style.color = Format.hexColor($dm.color);
        $dm.picture && (this.innerHTML = `<img src="//${$dm.picture}">`);
        $dm.colorful && this.classList.add('colorful');
    }
}