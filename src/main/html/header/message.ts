import { unread } from "../../../io/com/bilibili/api/x/msgfeed/unread";
import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import { customElement } from "../../../utils/Decorator/customElement";

/** 消息 */
@customElement('div')
export class Message extends HTMLDivElement {

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
    // disconnectedCallback() { }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    constructor() {
        super();

        this.classList.add('message-wrap');
        this.innerHTML = `<a href="//message.bilibili.com/#/reply" target="_blank">回复我的</a>
<a href="//message.bilibili.com/#/at" target="_blank">@我的</a>
<a href="//message.bilibili.com/#/love" target="_blank">收到的赞</a>
<a href="//message.bilibili.com/#/system" target="_blank">系统通知</a>
<a href="//message.bilibili.com/#/whisper" target="_blank">我的消息</a>`;

        this.addEventListener('pointerover', ({ target }) => {
            (<HTMLElement>this.parentElement!.querySelector('.message'))?.removeAttribute('data-num');
            if (target instanceof HTMLAnchorElement) {
                target.removeAttribute('data-num');
            }
        });

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.isLogin) {
                    this.classList.add('d');
                    // 请求新消息信息
                    unread().then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        const { reply, at, like, sys_msg } = data;
                        const all = reply + at + like + sys_msg;
                        reply && ((<HTMLElement>this.children[0]).dataset.num = reply > 99 ? '99+' : <any>reply);
                        at && ((<HTMLElement>this.children[1]).dataset.num = at > 99 ? '99+' : <any>at);
                        like && ((<HTMLElement>this.children[2]).dataset.num = like > 99 ? '99+' : <any>like);
                        sys_msg && ((<HTMLElement>this.children[3]).dataset.num = sys_msg > 99 ? '99+' : <any>sys_msg);
                        all && ((<HTMLElement>this.parentElement!.querySelector('.message')).dataset.num = all > 99 ? '99+' : <any>all);
                    });
                }
            }).catch(e => {
                console.error(e);
            });
    }
}