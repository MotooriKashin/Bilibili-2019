import { IReplies } from "../../../io/com/bilibili/api/x/v2/reply";
import { cursor } from "../../../io/com/bilibili/api/x/v2/reply/dialog/cursor";
import svg_like_number from "../../../player/assets/svg/like-number.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
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

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    constructor(private reply: IReplies, private upid: number) {
        super();
        this.classList.add('sub-comment-wrap');
        this.dataset.rpid = reply.rpid_str;

        this.emote();
        this.jump_url();
        this.pictures();

        this.innerHTML = `<a target="_blank" class="reply-face" href="//space.bilibili.com/${reply.mid_str}"><img loading="lazy" src="${https(reply.member.avatar)}"></a>
<div class="reply-con">
    <div class="reply-user">
        <a target="_blank" class="name" href="//space.bilibili.com/${reply.mid_str}"${reply.member.vip.nickname_color ? ` style="color:${reply.member.vip.nickname_color}"` : ''}>${reply.member.uname}</a>
        <img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/ic_user level_${reply.member.is_senior_member ? LEVEL.at(-1) : LEVEL[reply.member.level_info.current_level]}.svg">
        ${upid === reply.mid ? '<span class="reply-is-up">UP</span>' : ''}
        ${reply.member.fans_detail ? `<span class="reply-fans"><span class="reply-fans-name" style="border-color: ${Format.hexColor(reply.member.fans_detail.medal_color_border)};color: ${Format.hexColor(reply.member.fans_detail.medal_color_name)}; background-image: linear-gradient(90deg,${Format.hexColor(reply.member.fans_detail.medal_color)},${Format.hexColor(reply.member.fans_detail.medal_color_end)});">${reply.member.fans_detail.medal_name}</span><span class="reply-fans-level" style="border-color: ${Format.hexColor(reply.member.fans_detail.medal_color_border)};color: ${Format.hexColor(reply.member.fans_detail.medal_color_level)};background-color: ${Format.hexColor(reply.member.fans_detail.medal_level_bg_color)};">${reply.member.fans_detail.level}</span></span>` : ''}
        ${reply.member.nameplate?.image ? `<span class="reply-nameplate" title="${reply.member.nameplate.name}"><img loading="lazy" src="${https(reply.member.nameplate.image)}@.webp"></span>` : ''}
        <p class="reply-text">${reply.content.message}</p>
    </div>
    <div class="reply-info">
        ${reply.floor ? `<span>#${reply.floor}</span>` : ''}
        <span>${Format.eTime(reply.ctime)}</span>
        <span>${reply.reply_control.location || ''}</span>
        <span class="like-num${reply.action ? ' liked' : ''}" data-rpid="${reply.rpid_str}">${svg_like_number}${reply.like}</span>
        ${reply.up_action?.like ? '<span>UP主觉得很赞</span>' : ''}
        ${reply.up_action?.reply ? '<span>UP主有回复</span>' : ''}
        ${reply.label?.content ? `<span>${reply.label.content}</span>` : ''}
        <span class="reply" data-root="${+reply.root_str || reply.rpid_str}" data-parent=${reply.rpid_str} data-uname=${reply.member.uname}>回复</span>
        ${reply.dialog_str && reply.dialog_str !== reply.rpid_str ? `<span class="dialog" data-oid="${reply.oid_str}" data-dialog="${reply.dialog_str}" data-root="${reply.root_str}">查看对话</span>` : ''}
    </div>
</div>`;

        this.addEventListener('click', e => {
            const { target } = e;
            if (target instanceof HTMLSpanElement) {
                if (target.classList.contains('dialog')) {
                    // 处理查看对话
                    const { oid, dialog, root } = target.dataset;
                    oid && dialog && root && cursor(oid, root, dialog).then(d => {
                        if (d.replies.length) {
                            const popover = Element.add('div', { class: "reply-box", 'data-loading': '加载更多……' });
                            popover.popover = 'auto';
                            d.replies.forEach(d => {
                                popover.appendChild(new SubReply(d, this.upid));
                            });
                            target.insertAdjacentElement('afterend', popover);
                            popover.addEventListener('toggle', () => {
                                popover.matches(":popover-open") || popover.remove();
                            });
                            popover.showPopover();
                            if (popover.scrollHeight - popover.scrollTop < popover.clientHeight * 1.2) {
                                popover.dataset.loading = '';
                            } else {
                                let { next } = d.cursor; const { max_floor } = d.dialog;
                                const scrollend = () => {
                                    if (popover.scrollHeight - popover.scrollTop < popover.clientHeight * 1.2) {
                                        if (next < max_floor) {
                                            if (d.replies.length) {
                                                cursor(oid, root, dialog, next).then(d => {
                                                    d.replies.forEach(d => {
                                                        popover.appendChild(new SubReply(d, this.upid));
                                                    });
                                                    next = d.cursor.next;
                                                })
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
                this.reply.content.message = this.reply.content.message.replaceAll(d[0], `<img loading="lazy" class="emote" src="${https(d[1].gif_url || d[1].url)}@100w_100h.webp" alt="${d[1].text}">`)
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
                this.reply.content.message = this.reply.content.message.replaceAll(`@${d[0]}`, `<a target="_blank" href="//space.bilibili.com/${d[1]}">@${d[0]}</a>`)
            })
        }
    }

    /** 处理图片 */
    private pictures() {
        this.reply.content.pictures?.forEach(d => {
            this.reply.content.message += `<img loading="lazy" class="topopover" src="${https(d.img_src)}@.webp">`;
        });
        this.reply.content.rich_text?.note?.images?.forEach(d => {
            this.reply.content.message += `<img loading="lazy" class="topopover" src="${https(d)}@.webp">`;
        });
    }
}