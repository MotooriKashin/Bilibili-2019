import { Player } from "../..";
import { IDanmaku } from "../../../danmaku";
import { ATTR } from "../../../danmaku/attr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { ev, PLAYER_EVENT } from "../../event";

/** 弹幕项 */
@customElement('div')
export class DanmakuElem extends HTMLDivElement {

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

    /** 时间 */
    private $progress = Element.add('div', { class: 'progress', appendTo: this });

    /** 弹幕内容 */
    private $content = Element.add('div', { class: 'content', appendTo: this });

    /** 发送时间 */
    private $sent = Element.add('div', { class: 'sent', appendTo: this });

    /** 屏蔽显示 */
    private $block = Element.add('div', { class: 'block', appendTo: this, innerText: '已屏蔽' });

    /** 弹幕属性 */
    private $attr = Element.add('div', { class: 'attr', appendTo: this });

    constructor($dm: IDanmaku, player: Player) {
        super();

        this.classList.add('danmaku-elem', `mode${$dm.mode}`);
        $dm.color && this.classList.add('color');
        this.$progress.textContent = Format.fmSeconds($dm.progress / 1000);
        this.$content.appendChild(document.createElement('p')).textContent = $dm.content || '';
        if ($dm.attr) {
            if ($dm.attr & ATTR.PROTECT) {
                this.classList.add('protect');
            }
            if ($dm.attr & ATTR.LIVE) {
                this.classList.add('live');
            }
            if ($dm.attr & ATTR.LIKE) {
                this.classList.add('like');
            }
        }
        this.$sent.textContent = $dm.mode === 7
            ? '高级弹幕'
            : $dm.mode === 8
                ? '代码弹幕'
                : $dm.mode === 9
                    ? 'BAS弹幕'
                    : this.getDate($dm.ctime * 1000);

        this.addEventListener('dblclick', () => {
            player.$video.$seek($dm.progress / 1000)
        });
        this.addEventListener('contextmenu', () => {
            ev.trigger(PLAYER_EVENT.DANMAKU_CONTEXT, $dm);
        });
    }

    /**
     * 格式化日期
     * 
     * @param t 时间戳，毫秒
     */
    private getDate(time: number) {
        const date = new Date(time);
        return `${Format.integer(date.getMonth())}-${Format.integer(date.getDate())} ${Format.integer(date.getHours())}:${Format.integer(date.getMinutes())}`
    }
}