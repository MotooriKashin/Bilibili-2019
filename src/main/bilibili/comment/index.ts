import { ROUTER } from "..";
import { pgcAppSeason } from "../../../io/com/bilibili/api/pgc/view/v2/app/season";
import { pgcSection } from "../../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { emoteWeb } from "../../../io/com/bilibili/api/x/emote/user/panel/web";
import { toviewWeb } from "../../../io/com/bilibili/api/x/v2/history/toview/web";
import { reply } from "../../../io/com/bilibili/api/x/v2/reply";
import { action } from "../../../io/com/bilibili/api/x/v2/reply/action";
import { replyAdd } from "../../../io/com/bilibili/api/x/v2/reply/add";
import { replyMain } from "../../../io/com/bilibili/api/x/v2/reply/main";
import { favResourceList } from "../../../io/com/bilibili/api/x/v3/fav/resource/list";
import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import svg_emoji from "../../../player/assets/svg/emoji.svg";
import { AV } from "../../../utils/av";
import { cookie } from "../../../utils/cookie";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { https } from "../../../utils/https";
import { IdCard } from "./card";
import { CommentItem } from "./commnet";
import { SubReply } from "./sub-reply";

/** 评论区 */
@customElement('div')
export class Comment extends HTMLDivElement {

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

    #id = crypto.randomUUID();

    private $head = Element.add('div', { class: 'comment-head' }, this, '评论');

    private $body = Element.add('div', { class: 'comment' }, this);

    private $header = Element.add('div', { class: 'comment-header' }, this.$body);

    private $tabs = Element.add('form', { class: 'tabs-order' }, this.$header, `<label><input type="radio" name=${this.#id} value="2" checked>按热度排序</label>
<label><input type="radio" name=${this.#id} value="0">按时间排序</label>`);

    private $interaction = Element.add('div', { class: 'interaction', 'data-num': '-', title: 'B站已不提供页码数，估算数据仅供参考！' }, this.$header);

    private $send = Element.add('div', { class: 'comment-send' }, this.$body);

    private $userFace = Element.add('div', { class: 'user-face' }, this.$send, `<img class="face" loading="lazy" src="//static.hdslb.com/images/akari.jpg">`);

    private $ipt = Element.add('textarea', { class: 'ipt-txt', cols: "80", rows: "5", placeholder: "发一条友善的评论" }, this.$send);

    private $submit = Element.add('button', { class: 'comment-submit' }, this.$send, '发表评论');

    private $emote = Element.add('button', { class: 'comment-emote' }, this.$send, `${svg_emoji}表情`);

    private $emotePopover = Element.add('div', { class: 'emote-popover', popover: 'auto' }, this.$send);

    private $emoteTitle = Element.add('div', { class: 'emoji-title' }, this.$emotePopover);

    private $emoteWrap = Element.add('form', { class: 'emoji-wrap' }, this.$emotePopover);

    private $emoteTabs = Element.add('form', { class: 'emoji-tabs' }, this.$emotePopover);

    private $list = Element.add('div', { class: 'comment-list' }, this.$body);

    private $paging = Element.add('div', { class: 'comment-paging' }, this.$body);

    private $imagePopover = Element.add('div', { class: 'comment-popover', popover: 'auto' }, this);

    private $imageCon = Element.add('div', { class: 'image-con' }, this.$imagePopover);

    #oid: string | number = 0;

    get oid() {
        return this.#oid;
    }

    set oid(v) {
        if (v !== this.#oid) {
            this.identify();
            this.#oid = v;
            this.init();
        }
    }

    #pn = 1;

    get pn() {
        return this.#pn;
    }

    set pn(v) {
        this.#pn = v;
        this.init();
    }

    #sort: 0 | 2 = 2;

    get sort() {
        return this.#sort;
    }

    set sort(v) {
        this.#sort = v;
        this.init();
    }

    #type = 1;

    get type() {
        return this.#type;
    }

    set type(v) {
        this.#type = v;
        this.init();
    }

    seek_rpid?: number;

    #emote?: Awaited<ReturnType<typeof emoteWeb>>;

    #aid = 0;

    #ssid = 0;

    #epid = 0;

    constructor() {
        super();
        this.insertAdjacentHTML('beforeend', `<style>${__BILI_COMMENT_STYLE__}</style>`);
        this.$ipt.required = true;
        this.$emote.popoverTargetElement = this.$emotePopover;

        new IdCard();

        this.$tabs.addEventListener('change', () => {
            const d = new FormData(this.$tabs);
            this.#pn = 1;
            this.sort = <0>+[...d.values()][0];
        });
        this.$interaction.addEventListener('click', this.onPageClick);
        this.$paging.addEventListener('click', this.onPageClick);
        this.addEventListener('click', ({ target, screenX, screenY }) => {
            if (target instanceof HTMLImageElement && target.classList.contains('topopover')) {
                // 评论图片放大
                this.$imageCon.innerHTML = `<img loading="lazy" src="${target.src}">`;
                this.$imagePopover.style.transformOrigin = `${screenX}px ${screenY}px`;
                this.$imagePopover.showPopover();
            } else if (target instanceof HTMLSpanElement && target.classList.contains('reply')) {
                // 回复评论
                const { root, parent, uname } = target.dataset;
                if (root && parent && uname) {
                    const id = crypto.randomUUID();
                    target.style.setProperty('anchor-name', `--${id}`);
                    this.$send.style.setProperty('position-anchor', `--${id}`);
                    this.$send.popover = 'auto';
                    this.$send.showPopover();

                    this.$ipt.placeholder = `回复 @${uname} :`;
                    this.$ipt.dataset.root = root;
                    this.$ipt.dataset.parent = parent;
                }
            } else if (target instanceof HTMLSpanElement && target.classList.contains('like-num')) {
                const csrf = cookie.get('bili_jct');
                const { rpid } = target.dataset;
                if (csrf && rpid) {
                    action(csrf, this.#oid, rpid, target.classList.contains('liked') ? 0 : 1, this.#type)
                        .then(d => {
                            if (d === 0) {
                                (<Text>target.lastChild).data = target.classList.toggle('liked') ? <any>+(<Text>target.lastChild).data + 1 : <any>+(<Text>target.lastChild).data - 1;
                            }
                        })
                }
            }
        });
        this.$imageCon.addEventListener('click', e => {
            const { target } = e;
            if (target === this.$imageCon) {
                this.$imagePopover.hidePopover();
            }
        });
        this.$send.addEventListener('toggle', () => {
            if (!this.$send.matches(":popover-open")) {
                this.$send.popover = null;
                this.$send.style.insetInlineStart = '';
                this.$send.style.insetBlockStart = '';
                this.$send.style.removeProperty('position-anchor');
                this.$ipt.placeholder = `发一条友善的评论`;
                this.$ipt.dataset.root = '';
                this.$ipt.dataset.parent = '';
                this.$ipt.value = '';
            }
        });
        this.$submit.addEventListener('click', () => {
            if (this.$ipt.checkValidity()) {
                const csrf = cookie.get('bili_jct');
                const { root, parent } = this.$ipt.dataset;
                if (csrf) {
                    replyAdd({ csrf, oid: this.#oid, message: root && parent ? this.$ipt.placeholder + this.$ipt.value : this.$ipt.value, type: this.#type, root, parent })
                        .then(({ code, data }) => {
                            if (code === 0) {
                                if (root && parent) {
                                    for (const d of this.$list.childNodes) {
                                        if (d instanceof CommentItem && d.dataset.rpid === parent) {
                                            d.$reply.insertAdjacentElement('afterbegin', new SubReply(data.reply, 0));
                                            break;
                                        }
                                    }
                                } else {
                                    this.$list.insertAdjacentElement('afterbegin', new CommentItem(data.reply, 0))
                                }
                            }
                        })
                        .finally(() => {
                            this.$ipt.value = '';
                            root && parent && this.$send.hidePopover();
                        })
                }
            }
        });
        this.$emotePopover.addEventListener('toggle', () => {
            if (this.$emotePopover.matches(":popover-open")) {
                this.#emote || emoteWeb().then(d => {
                    this.#emote = d;
                    const id = crypto.randomUUID();
                    this.$emoteTabs.innerHTML = https(d.map((d, i) => `<label><img loading="lazy" src="${d.url}@.webp" title="${d.text}"><input type="radio" name=${id} value="${i}"></label>`).join(''));
                    (<HTMLElement>this.$emoteTabs.firstElementChild)?.click();
                });
            }
        }, { once: true });
        this.$emoteWrap.addEventListener('change', () => {
            this.$ipt.focus();
            const d = new FormData(this.$emoteWrap);
            this.$ipt.setRangeText(<string>[...d.values()][0], this.$ipt.selectionStart, this.$ipt.selectionEnd, 'end');
        });
        this.$emoteTabs.addEventListener('change', () => {
            this.$ipt.focus();
            const d = new FormData(this.$emoteTabs);
            const i = +[...d.values()][0];
            if (i >= 0 && this.#emote) {
                const emote = this.#emote[i];
                this.$emoteTitle.textContent = emote.text;
                const id = crypto.randomUUID();
                this.$emoteWrap.innerHTML = https(emote.emote.map(d => `<label>${d.type === 4 ? d.url : `<img loading="lazy" src="${d.url}@.webp" title="${d.text}">`}<input type="radio" name=${id} value="${d.text}"></label>`).join(''));
            }
        });

        nav().then(d => {
            if (d.isLogin) {
                this.$userFace.innerHTML = https(`<img class="face" loading="lazy" src="${d.face}@.webp">${d.pendant.image ? `<img class="pendant" loading="lazy" src="${d.pendant.image}@.webp">` : ''}${d.officialVerify.desc ? `<i title="${d.officialVerify.type === 1 ? '企业/团体认证' : '个人认证'}" class="auth ${d.officialVerify.type === 1 ? 'o-auth' : 'p-auth'}"></i>` : ''}`);
            } else {
                this.$ipt.placeholder = '请登录后评论';
                this.$ipt.disabled = true;
                this.$submit.disabled = true;
                this.$emote.disabled = true;
            }
        })
    }

    async navigate(router: ROUTER, url: URL | Location) {
        url instanceof Location && (url = new URL(url.href));
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        this.#aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        this.#aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                if (this.#aid) {
                    this.oid = this.#aid;
                } else {
                    console.error('解析av号出错~');
                }
                break;
            }
            case ROUTER.BANGUMI: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^ss\d+$/i.test(path[3]): {
                        this.#ssid = +path[3].slice(2);
                        break;
                    }
                    case /^ep\d+$/i.test(path[3]): {
                        this.#epid = +path[3].slice(2);
                        break;
                    }
                }
                if (this.#ssid || this.#epid) {
                    pgcAppSeason(this.#ssid ? { season_id: this.#ssid } : { ep_id: this.#epid })
                        .then(async season => {
                            this.#ssid || (this.#ssid = season.season_id);
                            season.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        this.#epid || (this.#epid = d.data.episodes[0]?.ep_id);
                                        if (this.#epid) {
                                            const ep = d.data.episodes.find(d => d.ep_id === this.#epid);
                                            if (ep) {
                                                this.#aid = ep.aid;
                                            }
                                        }
                                        break;
                                    }
                                }
                            });
                            if (!this.#aid && this.#ssid) {
                                const d = await pgcSection(this.#ssid);
                                const eps = d.main_section.episodes.concat(...d.section.map(d => d.episodes));
                                const ep = this.#epid ? eps.find(d => d.id === this.#epid) : eps[0];
                                if (ep) {
                                    this.#aid = ep.aid;
                                }
                            }
                            this.#aid && (this.oid = this.#aid);
                        });
                } else {
                    console.error('解析Bangumi出错~');
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        this.#aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        this.#aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                toviewWeb().then(toview => {
                    this.#aid || (toview.length && (this.#aid = toview[0].aid));
                    if (this.#aid) {
                        this.oid = this.#aid;
                    } else {
                        console.error('解析稍后再看出错~');
                    }
                })
                break;
            }
            case ROUTER.MEDIALIST: {
                const path = url.pathname.split('/');
                const ml = +path[2].slice(2);
                if (ml) {
                    favResourceList(ml).then(({ medias }) => {
                        this.#aid = Number(url.searchParams.get('aid')) || medias[0].id;
                        if (this.#aid) {
                            this.oid = this.#aid;
                        } else {
                            console.error('解析播放列表出错~');
                        }
                    })
                } else {
                    console.error('解析播放列表出错~');
                }
                break;
            }
        }
    }

    init(
        oid?: number | string,
        pn?: number,
        sort?: 0 | 2,
        type?: number,
        seek_rpid?: number,
    ) {
        oid && (this.#oid = oid);
        pn && (this.#pn = pn);
        sort === undefined || (this.#sort = sort);
        type && (this.#type = type);
        seek_rpid && (this.seek_rpid = seek_rpid);
        if (this.#oid) {
            if (this.seek_rpid) {
                const { seek_rpid } = this;
                delete this.seek_rpid;
                replyMain(this.oid, undefined, seek_rpid)
                    .then(d => {
                        if (d.replies) {
                            this.$list.replaceChildren();
                            d.top.upper && d.replies.unshift(d.top.upper);
                            d.replies.forEach(k => {
                                this.$list.appendChild(new CommentItem(k, d.upper?.mid));
                            });
                        }
                    }).finally(() => {
                        document.querySelector(`[data-rpid="${seek_rpid}"]`)?.scrollIntoView({ behavior: 'smooth' })
                    })
            } else {
                reply(this.oid, this.pn, this.sort, this.type)
                    .then(d => {
                        if (d.replies) {
                            this.$list.replaceChildren();
                            this.pn === 1 && d.upper.top && d.replies.unshift(d.upper.top);
                            d.replies.forEach(k => {
                                this.$list.appendChild(new CommentItem(k, d.upper?.mid));
                            });
                            this.$head.dataset.num = <any>d.page.count;
                            this.interaction(Math.floor(d.page.count / d.page.size));
                        }
                    })
            }
        }
    }

    private interaction(pages: number) {
        this.$interaction.dataset.num = <any>Math.floor(pages);
        if (pages > 1) {
            let html = '';
            if (this.pn > 1) {
                html += '<a class="prev" data-value="-1">上一页</a><a data-value="1">1</a>';
            }

            if (this.pn - 3 > 1) {
                html += `<a class="more">...</a>`;
            }
            if (this.pn - 2 > 1) {
                html += `<a data-value="${this.pn - 2}">${this.pn - 2}</a>`;
            }
            if (this.pn - 1 > 1) {
                html += `<a data-value="${this.pn - 1}">${this.pn - 1}</a>`;
            }

            html += `<a class="on">${this.pn}</a>`;

            if (this.pn + 1 > 1 && this.pn + 1 <= pages) {
                html += `<a data-value="${this.pn + 1}">${this.pn + 1}</a>`;
            }
            if (this.pn + 2 > 1 && this.pn + 2 <= pages) {
                html += `<a data-value="${this.pn + 2}">${this.pn + 2}</a>`;
            }
            if (this.pn + 3 > 1 && this.pn + 3 <= pages) {
                if (this.pn + 3 < pages) {
                    html += `<a class="more">...</a>`;
                }

                html += `<a data-value="${pages}">${pages}</a>`;
            }

            if (this.pn < pages) {
                html += '<a  class="next" data-value="0">下一页</a>';
            }

            this.$interaction.innerHTML = html;

            this.$paging.innerHTML = html + `<span class="page-jump">共${pages}页，跳至<input>页</span>`;
            this.$paging.querySelector('input')?.addEventListener('change', e => {
                const input = <HTMLInputElement>e.target;
                const i = Number(input.value);
                input.value = '';
                i > 1 && (this.pn = i);
            });
        } else {
            this.$interaction.replaceChildren();
            this.$paging.replaceChildren();
        }
    }

    private onPageClick = (e: MouseEvent) => {
        const a = e.target;
        if (a instanceof HTMLAnchorElement) {
            const i = Number(a.dataset.value);
            switch (i) {
                case -1: {
                    this.pn > 1 && this.pn--;
                    break;
                }
                case 0: {
                    this.pn++;
                    break;
                }
                default: {
                    i > 0 && (this.pn = i);
                    break;
                }
            }
        }
        document.querySelector('.tabs-order')?.scrollIntoView();
    }

    private identify = () => {
        this.#aid = 0;
        this.#ssid = 0;
        this.#epid = 0;
        this.#oid = 0;
        this.#pn = 1;
        this.#sort = 2;
        this.#type = 1;
        (<HTMLInputElement>this.$tabs.firstChild!.firstChild).checked = true;
        this.$list.replaceChildren();
        this.$paging.replaceChildren();
    }
}


//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_COMMENT_STYLE__: string;
}