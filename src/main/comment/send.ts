import { Comment } from ".";
import { emoteWeb } from "../../io/com/bilibili/api/x/emote/user/panel/web";
import { nav } from "../../io/com/bilibili/api/x/web-interface/nav";
import { toastr } from "../../toastr";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { https } from "../../utils/https";
import { Avatar } from "./avatar";

/** 评论区 */
@customElement('div')
export class CommentSend extends HTMLDivElement {

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

    #left = Element.add('div', { appendTo: this });

    #avatar = Element.add('div', { appendTo: this.#left, class: 'avatar' });

    #face = Element.add('img', { appendTo: this.#avatar, class: 'avatar-face', attribute: { loading: 'lazy', src: '//static.hdslb.com/images/akari.jpg' } });

    #right = Element.add('div', { appendTo: this, class: 'send-right' });

    $submit = Element.add('form', { appendTo: this.#right });

    #textArea = Element.add('textarea', { appendTo: this.$submit, attribute: { name: 'msg', cols: '80', rows: '5', placeholder: '发一条友善的评论' } });

    #button = Element.add('button', { appendTo: this.$submit, innerText: '发表评论' });

    #emoji = Element.add('button', { appendTo: this.#right, class: 'emoji', innerHTML: `<i></i><span>表情</span>` });

    #emojiWrap = Element.add('div', { appendTo: this.#right, class: 'emoji-wrap' });

    #emojiTitle = Element.add('div', { appendTo: this.#emojiWrap, class: 'emoji-title' });

    #emojiBox = Element.add('form', { appendTo: this.#emojiWrap, class: 'emoji-box' });

    #emojiTab = Element.add('form', { appendTo: this.#emojiWrap, class: 'emoji-tab' });

    #id = crypto.randomUUID();

    #emote?: Awaited<ReturnType<typeof emoteWeb>>['data']

    constructor(
        cnt: Comment,
    ) {
        super();

        this.classList.add('comment-send');
        this.#textArea.required = true;
        this.#textArea.disabled = true;
        this.#button.disabled = true;
        this.#emojiWrap.popover = 'auto';
        this.#emoji.popoverTargetElement = this.#emojiWrap;

        this.$submit.addEventListener('submit', e => {
            e.preventDefault();
        });

        this.#emoji.addEventListener('click', () => {
            this.#textArea.focus();
        });

        this.#emojiTab.addEventListener('change', () => {
            this.#textArea.focus();
            const d = new FormData(this.#emojiTab);
            const i = +[...d.values()][0];
            if (i >= 0 && this.#emote) {
                const emote = this.#emote.packages[i];
                emote.type === 1 ? emote.meta.size === 1 ? this.#emojiWrap.style.removeProperty('--columns') : this.#emojiWrap.style.setProperty('--columns', '5') : this.#emojiWrap.style.setProperty('--columns', '4');
                this.#emojiTitle.textContent = emote.text;
                const id = crypto.randomUUID();
                this.#emojiBox.innerHTML = https(emote.emote.map(d => `<label>${d.type === 4 ? d.url : `<img loading="lazy" src="${d.url}@.webp" title="${d.text}">`}<input type="radio" name=${id} value="${d.text}"></label>`).join(''));
            }
        });
        this.#emojiBox.addEventListener('change', () => {
            this.#textArea.focus();
            const d = new FormData(this.#emojiBox);
            this.#textArea.setRangeText(<string>[...d.values()][0], this.#textArea.selectionStart, this.#textArea.selectionEnd, 'end');
        });
        this.#emojiWrap.addEventListener('toggle', () => {
            emoteWeb()
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    this.#emote = data;
                    this.#emojiTab.innerHTML = https(data.packages.map((d, i) => `<label><img loading="lazy" src="${d.url}@.webp" title="${d.text}"><input type="radio" name="${this.#id}" value="${i}"></label>`).join(''));
                    (<HTMLElement>this.#emojiTab.firstElementChild)?.click();
                })
                .catch(e => {
                    toastr.error('获取表情失败~', e);
                    console.error(e);
                });
        }, { once: true });
        this.addEventListener('toggle', () => {
            if (!this.matches(":popover-open")) {
                this.popover = null;
                this.style.removeProperty('position-anchor');
                this.#textArea.placeholder = `发一条友善的评论`;
                cnt.$root = cnt.$parent = cnt.$uname = '';
                delete cnt.$replyCurrent;
            } else {
                this.#textArea.placeholder = `回复 @${cnt.$uname} :`;
            }
        });

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });

                if (data.isLogin) {
                    this.#textArea.disabled = false;
                    this.#button.disabled = false;
                    this.#face.src = data.face;
                    data.pendant.image && this.$setPendant(data.pendant.image);
                    (data.officialVerify.type > 0 || data.vip.status) && this.$setIcon(Avatar[data.officialVerify.type > 0 ? data.officialVerify.type : 2]);
                }
            })
            .catch(e => {
                console.error(e);
            });
    }

    /** 头像框 */
    $setPendant(src: string) {
        this.#avatar.insertAdjacentHTML('beforeend', `<img class="avatar-pendant" loading="lazy" src="${https(src)}">`)
    }

    /** 头像图标 */
    $setIcon(type: string) {
        this.#avatar.insertAdjacentHTML('beforeend', `<img class="avatar-icon" src="//i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/${type}.svg">`);
    }

    /** 清空输入框 */
    $empty() {
        this.#textArea.value = '';
    }
}