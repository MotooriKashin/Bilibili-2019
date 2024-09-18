import { Comment } from ".";
import { IReplies } from "../../io/com/bilibili/api/x/v2/reply";
import { cursor } from "../../io/com/bilibili/api/x/v2/reply/dialog/cursor";
import { toastr } from "../../toastr";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { Format } from "../../utils/fomat";
import { https } from "../../utils/https";
import { Avatar } from "./avatar";
import { LEVEL } from "./icon-level";

/** 评论楼中楼 */
@customElement('div')
export class SubReply extends HTMLDivElement {

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

    #right = Element.add('div', { appendTo: this, class: 'sub-con' });

    #avatar = Element.add('a', { appendTo: this.#left, class: 'avatar-sub', attribute: { target: '_blank' } });

    #text = Element.add('div', { appendTo: this.#right, class: 'text' });

    #info = Element.add('div', { appendTo: this.#right, class: 'info' });

    constructor(
        private cnt: Comment,
        private reply: IReplies,
        private upid: number,
    ) {

        super();

        this.classList.add('sub-reply');
        this.dataset.rpid = reply.rpid_str;

        this.emote();
        this.jump_url();

        this.#avatar.innerHTML = https(`<img loading="lazy" src="${reply.member.avatar}" class="avatar-face">${reply.member.pendant.image ? `<img class="avatar-pendant" loading="lazy" src="${reply.member.pendant.image}">` : ''}${reply.member.official_verify.type >= 0 || reply.member.vip.vipStatus ? `<img class="avatar-icon" src="//i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/${reply.member.official_verify.type >= 0 ? Avatar[reply.member.official_verify.type] : Avatar[2]}.svg">` : ''}`);
        this.#text.innerHTML = `<a target="_blank" class="name" href="//space.bilibili.com/${reply.mid_str}"${reply.member.vip.nickname_color ? ` style="color:${reply.member.vip.nickname_color}"` : ''} data-mid="${reply.mid_str}">${reply.member.uname}</a>
<img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/ic_user level_${reply.member.is_senior_member ? LEVEL.at(-1) : LEVEL[reply.member.level_info.current_level]}.svg">
${upid === reply.mid ? '<span class="is-up">UP</span>' : ''}
${reply.member.fans_detail ? `<span class="fans"><span class="fans-name" style="border-color: ${Format.hexColor(reply.member.fans_detail.medal_color_border)};color: ${Format.hexColor(reply.member.fans_detail.medal_color_name)}; background-image: linear-gradient(90deg,${Format.hexColor(reply.member.fans_detail.medal_color)},${Format.hexColor(reply.member.fans_detail.medal_color_end)});">${reply.member.fans_detail.medal_name}</span><span class="fans-level" style="border-color: ${Format.hexColor(reply.member.fans_detail.medal_color_border)};color: ${Format.hexColor(reply.member.fans_detail.medal_color_level)};background-color: ${Format.hexColor(reply.member.fans_detail.medal_level_bg_color)};">${reply.member.fans_detail.level}</span></span>` : ''}
${reply.member.nameplate?.image ? `<img class="nameplate" loading="lazy" src="${https(reply.member.nameplate.image)}@.webp" title="${reply.member.nameplate.name}">` : ''}
<span class="content">${reply.content.message}</span>`;
        this.#info.innerHTML = `${reply.floor ? `<span>#${reply.floor}</span>` : ''}
<span>${Format.eTime(reply.ctime)}</span>
${reply.reply_control.location ? `<span>${reply.reply_control.location}</span>` : ''}
<span class="like-num${reply.action ? ' liked' : ''}" data-num="${reply.like}" data-rpid="${reply.rpid_str}"><i></i></span>
<span class="hate-num" data-rpid="${reply.rpid_str}"><i></i></span>
${reply.up_action?.like ? '<span>UP主觉得很赞</span>' : ''}
${reply.up_action?.reply ? '<span>UP主有回复</span>' : ''}
${reply.label?.content ? `<span>${reply.label.content}</span>` : ''}
<span class="reply">回复</span>
${reply.dialog_str && reply.dialog_str !== reply.rpid_str ? `<span class="dialog" data-oid="${reply.oid_str}" data-dialog="${reply.dialog_str}" data-root="${reply.root_str}" data-rpid="${reply.rpid_str}">查看对话</span>` : ''}`;

        this.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLSpanElement && target.classList.contains('reply')) {
                cnt.$root = +reply.root_str ? reply.root_str : reply.rpid_str;
                cnt.$parent = reply.rpid_str;
                cnt.$uname = reply.member.uname;
            }
        });
        this.addEventListener('click', e => {
            const { target } = e;
            if (target instanceof HTMLSpanElement) {
                if (target.classList.contains('dialog')) {
                    // 处理查看对话
                    const { oid, dialog, root, rpid } = target.dataset;
                    oid && dialog && root && cursor(oid, root, dialog)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            if (data.replies.length) {
                                const popover = Element.add('div', { class: "dialog-box", data: { loading: '加载更多……' } });
                                const id = crypto.randomUUID();
                                target.style.setProperty('anchor-name', `--${id}`);
                                popover.style.setProperty('position-anchor', `--${id}`);
                                popover.popover = 'auto';
                                data.replies.forEach(d => {
                                    const sr = new SubReply(this.cnt, d, this.upid);
                                    popover.appendChild(sr);
                                    if (d.rpid_str === rpid) {
                                        sr.style.backgroundImage = 'linear-gradient(45deg, var(--736ce721) 0%, var(--00a1d621) 67%, var(--00d4ff21) 100%)';
                                        sr.style.borderRadius = '1em';
                                    }
                                });
                                target.insertAdjacentElement('afterend', popover);
                                popover.addEventListener('toggle', () => {
                                    popover.matches(":popover-open") || popover.remove();
                                });
                                popover.showPopover();
                                if (popover.scrollHeight - popover.scrollTop < popover.clientHeight * 1.2) {
                                    popover.dataset.loading = '';
                                } else {
                                    let { next } = data.cursor; const { max_floor } = data.dialog;
                                    const scrollend = () => {
                                        if (popover.scrollHeight - popover.scrollTop < popover.clientHeight * 1.2) {
                                            if (next < max_floor) {
                                                if (data.replies.length) {
                                                    cursor(oid, root, dialog, next).then(({ code, message, data }) => {
                                                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                                                        data.replies.forEach(d => {
                                                            const sr = new SubReply(this.cnt, d, this.upid);
                                                            popover.appendChild(sr);
                                                            if (d.rpid_str === rpid) {
                                                                sr.style.backgroundImage = 'linear-gradient(45deg, var(--736ce721) 0%, var(--00a1d621) 67%, var(--00d4ff21) 100%)';
                                                                sr.style.borderRadius = '1em';
                                                            }
                                                        });
                                                        next = data.cursor.next;
                                                    }).catch(e => {
                                                        toastr.error('获取更多对话失败', e);
                                                        console.error(e);
                                                    });
                                                } else {
                                                    popover.dataset.loading = '一滴也没有啦~';
                                                    popover.removeEventListener('scrollend', scrollend);
                                                }
                                            } else {
                                                popover.dataset.loading = '一滴也没有啦~';
                                                popover.removeEventListener('scrollend', scrollend);
                                            }
                                        }
                                    }
                                    popover.addEventListener('scrollend', scrollend);
                                }
                            }
                        }).catch(e => {
                            toastr.error('获取对话失败', e);
                            console.error(e);
                        });
                    e.stopPropagation();
                }
            }
        });
    }

    /** 处理表情 */
    private emote() {
        if (this.reply.content.emote) {
            Object.entries(this.reply.content.emote).forEach(d => {
                this.reply.content.message = this.reply.content.message.replaceAll(d[0], `<img loading="lazy" src="${https(d[1].gif_url || d[1].url)}@100w_100h.webp" alt="${d[1].text}">`)
            });
        }
    }

    /** 处理超链接 */
    private jump_url() {
        this.at_name_to_mid_str();
        this.reply.content.message = Format.superLink(this.reply.content.message);
    }

    /** 处理@ */
    private at_name_to_mid_str() {
        if (this.reply.content.at_name_to_mid_str) {
            Object.entries(this.reply.content.at_name_to_mid_str).forEach(d => {
                this.reply.content.message = this.reply.content.message.replaceAll(`@${d[0]}`, `<a target="_blank" href="//space.bilibili.com/${d[1]}"  data-mid="${d[1]}">@${d[0]}</a>`)
            })
        }
    }
}