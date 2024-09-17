import { Comment } from ".";
import { IReplies } from "../../io/com/bilibili/api/x/v2/reply";
import { replyReply } from "../../io/com/bilibili/api/x/v2/reply/reply";
import { toastr } from "../../toastr";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { Format } from "../../utils/fomat";
import { https } from "../../utils/https";
import { Avatar } from "./avatar";
import { LEVEL } from "./icon-level";
import { SubReply } from "./sub-reply";

/** 评论 */
@customElement('div')
export class Reply extends HTMLDivElement {

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

    #right = Element.add('div', { appendTo: this, class: 'reply-con' });

    #avatar = Element.add('a', { appendTo: this.#left, class: 'avatar', attribute: { target: '_blank' } });

    #user = Element.add('div', { appendTo: this.#right, class: 'user' });

    #text = Element.add('div', { appendTo: this.#right, class: 'text' });

    #info = Element.add('div', { appendTo: this.#right, class: 'info' });

    $replyBox = Element.add('div', { appendTo: this.#right, class: 'reply-box' });

    constructor(
        private cnt: Comment,
        private reply: IReplies,
        private upid: number,
    ) {

        super();

        this.classList.add('reply-item');
        this.dataset.rpid = reply.rpid_str;

        this.emote();
        this.jump_url();
        this.pictures();

        this.#avatar.innerHTML = https(`<img loading="lazy" src="${reply.member.avatar}" class="avatar-face">${reply.member.pendant.image ? `<img class="avatar-pendant" loading="lazy" src="${reply.member.pendant.image}">` : ''}${reply.member.official_verify.type >= 0 || reply.member.vip.vipStatus ? `<img class="avatar-icon" src="//i0.hdslb.com/bfs/seed/jinkela/short/user-avatar/${reply.member.official_verify.type >= 0 ? Avatar[reply.member.official_verify.type] : Avatar[2]}.svg">` : ''}`);
        this.#avatar.href = `//space.bilibili.com/${reply.member.mid}`;
        this.#user.innerHTML = `<a target="_blank" class="name" href="//space.bilibili.com/${reply.mid_str}"${reply.member.vip.nickname_color ? ` style="color:${reply.member.vip.nickname_color}"` : ''} data-mid="${reply.mid_str}">${reply.member.uname}</a>
<img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/ic_user level_${reply.member.is_senior_member ? LEVEL.at(-1) : LEVEL[reply.member.level_info.current_level]}.svg">
${upid === reply.mid ? '<span class="is-up">UP</span>' : ''}
${reply.member.fans_detail ? `<span class="fans"><span class="fans-name" style="border-color: ${Format.hexColor(reply.member.fans_detail.medal_color_border)};color: ${Format.hexColor(reply.member.fans_detail.medal_color_name)}; background-image: linear-gradient(90deg,${Format.hexColor(reply.member.fans_detail.medal_color)},${Format.hexColor(reply.member.fans_detail.medal_color_end)});">${reply.member.fans_detail.medal_name}</span><span class="fans-level" style="border-color: ${Format.hexColor(reply.member.fans_detail.medal_color_border)};color: ${Format.hexColor(reply.member.fans_detail.medal_color_level)};background-color: ${Format.hexColor(reply.member.fans_detail.medal_level_bg_color)};">${reply.member.fans_detail.level}</span></span>` : ''}
${reply.member.nameplate?.image ? `<img class="nameplate" loading="lazy" src="${https(reply.member.nameplate.image)}@.webp" title="${reply.member.nameplate.name}">` : ''}
${reply.member.user_sailing?.cardbg ? `<a class="sailing" title="${reply.member.user_sailing.cardbg.name}"><img loading="lazy" src="${https(reply.member.user_sailing.cardbg.image)}@.webp"><div class="sailing-info" style="color: ${reply.member.user_sailing.cardbg.fan.color}">${reply.member.user_sailing.cardbg.fan.num_prefix}<br>${reply.member.user_sailing.cardbg.fan.num_desc}</div></a>` : ''}`;
        this.#text.innerHTML = `${reply.reply_control.is_up_top ? '<span class="stick">置顶</span>' : ''}${reply.content.message}`;
        this.#info.innerHTML = `${reply.floor ? `<span>#${reply.floor}</span>` : ''}
<span>${Format.eTime(reply.ctime)}</span>
${reply.reply_control.location ? `<span>${reply.reply_control.location}</span>` : ''}
<span class="like-num${reply.action ? ' liked' : ''}" data-num="${reply.like}" data-rpid="${reply.rpid_str}"><i></i></span>
<span class="hate-num" data-rpid="${reply.rpid_str}"><i></i></span>
${reply.up_action?.like ? '<span>UP主觉得很赞</span>' : ''}
${reply.up_action?.reply ? '<span>UP主有回复</span>' : ''}
${reply.label?.content ? `<span>${reply.label.content}</span>` : ''}
<span class="reply">回复</span>`;
        reply.replies?.forEach(d => {
            this.$replyBox.appendChild(new SubReply(cnt, d, upid));
        });
        if (reply.replies.length < reply.rcount) {
            Element.add('div', { class: 'view-more', appendTo: this.$replyBox, innerHTML: `${reply.reply_control.sub_reply_entry_text}，<a>点击查看</a>` })
                .addEventListener('click', () => {
                    this.replyReply(reply.rpid_str, reply.oid_str);
                }, { once: true });
        }

        this.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLSpanElement && target.classList.contains('reply')) {
                cnt.$replyCurrent = this;
                if (!this.$replyBox.contains(target)) {
                    cnt.$root = +reply.root_str ? reply.root_str : reply.rpid_str;
                    cnt.$parent = reply.rpid_str;
                    cnt.$uname = reply.member.uname;
                }
            }
        });
    }

    /** 处理表情 */
    private emote() {
        if (this.reply.content.emote) {
            Object.entries(this.reply.content.emote).forEach(d => {
                this.reply.content.message = this.reply.content.message.replaceAll(d[0], `<img loading="lazy" class="small" src="${https(d[1].gif_url || d[1].url)}@100w_100h.webp" alt="${d[1].text}">`)
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

    /** 处理图片 */
    private pictures() {
        this.reply.content.pictures?.forEach(d => {
            this.reply.content.message += `<img loading="lazy" class="image" src="${https(d.img_src)}@.webp">`;
        });
        this.reply.content.rich_text?.note?.images?.forEach(d => {
            this.reply.content.message += `<img loading="lazy" class="image" src="${https(d)}@.webp">`;
        });
    }

    private replyReply(
        root: number | string,
        oid: number | string,
        pn = 1,
        type = this.cnt.$type,
    ) {
        replyReply(root, oid, pn, type)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.replies?.length) {
                    this.$replyBox.replaceChildren(...data.replies.map(t => new SubReply(this.cnt, t, this.upid)));
                    this.$interaction(Math.floor(data.page.count / data.page.size), data.page.num, root, oid);
                } else {
                    toastr.warn('未获取到更多评论数据~');
                }
            })
            .catch(e => {
                toastr.error('获取楼中楼评论失败', e);
                console.error(e);
            })
    }

    private $interaction(
        pages: number,
        pn: number,
        root: number | string,
        oid: number | string,
    ) {
        if (pages > 1) {
            const $interaction = Element.add('div', { class: 'interaction', appendTo: this.$replyBox });
            $interaction.dataset.num = <any>Math.floor(pages);
            let html = '';
            if (pn > 1) {
                html += '<a class="prev" data-value="-1">上一页</a><a data-value="1">1</a>';
            }

            if (pn - 3 > 1) {
                html += `<a class="more">...</a>`;
            }
            if (pn - 2 > 1) {
                html += `<a data-value="${pn - 2}">${pn - 2}</a>`;
            }
            if (pn - 1 > 1) {
                html += `<a data-value="${pn - 1}">${pn - 1}</a>`;
            }

            html += `<a class="on">${pn}</a>`;

            if (pn + 1 > 1 && pn + 1 <= pages) {
                html += `<a data-value="${pn + 1}">${pn + 1}</a>`;
            }
            if (pn + 2 > 1 && pn + 2 <= pages) {
                html += `<a data-value="${pn + 2}">${pn + 2}</a>`;
            }
            if (pn + 3 > 1 && pn + 3 <= pages) {
                if (pn + 3 < pages) {
                    html += `<a class="more">...</a>`;
                }

                html += `<a data-value="${pages}">${pages}</a>`;
            }

            if (pn < pages) {
                html += '<a  class="next" data-value="0">下一页</a>';
            }

            $interaction.innerHTML = html;
            $interaction.addEventListener('click', e => {
                const a = e.target;
                if (a instanceof HTMLAnchorElement) {
                    const i = Number(a.dataset.value);
                    switch (i) {
                        case -1: {
                            pn > 1 && this.replyReply(root, oid, pn - 1);
                            break;
                        }
                        case 0: {
                            this.replyReply(root, oid, pn + 1);
                            break;
                        }
                        default: {
                            i > 0 && this.replyReply(root, oid, i);
                            break;
                        }
                    }
                }
            });
        }
    }
}