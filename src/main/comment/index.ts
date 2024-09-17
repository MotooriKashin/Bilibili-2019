import { pgcAppSeason } from "../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { toviewWeb } from "../../io/com/bilibili/api/x/v2/history/toview/web";
import { reply } from "../../io/com/bilibili/api/x/v2/reply";
import { action } from "../../io/com/bilibili/api/x/v2/reply/action";
import { replyAdd } from "../../io/com/bilibili/api/x/v2/reply/add";
import { replyMain } from "../../io/com/bilibili/api/x/v2/reply/main";
import { nav } from "../../io/com/bilibili/api/x/web-interface/nav";
import { toastr } from "../../toastr";
import { AV } from "../../utils/av";
import { cookie } from "../../utils/cookie";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { MAIN_EVENT, mainEv } from "../event";
import { ROUTER } from "../router";
import stylesheet from "./index.css" with {type: 'css'};
import { Reply } from "./reply";
import { CommentSend } from "./send";
import { SubReply } from "./sub-reply";

/** 评论区 */
@customElement(undefined, `comment-${Date.now()}`)
export class Comment extends HTMLElement {

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

    #host = this.attachShadow({ mode: 'closed' });

    #head = Element.add('div', { class: 'head', appendTo: this.#host, innerText: `评论`, data: { total: '-' } });

    #body = Element.add('div', { class: 'body', appendTo: this.#host });

    #header = Element.add('div', { class: 'header', appendTo: this.#body });

    #id = crypto.randomUUID();

    #order = Element.add('form', { appendTo: this.#header });

    #interaction = Element.add('div', { class: 'interaction', data: { num: '-' }, attribute: { title: 'B站已不提供页码数，估算数据仅供参考！' }, appendTo: this.#header });

    #send = this.#body.appendChild(new CommentSend(this));

    #list = Element.add('div', { class: 'list', appendTo: this.#body });

    #paging = Element.add('div', { class: 'paging', appendTo: this.#body });

    #imagePopover = Element.add('div', { class: 'image-popover', appendTo: this.#host });

    #imageCon = Element.add('div', { class: 'image-con', appendTo: this.#imagePopover });

    #oid: number | string = 0;

    set $oid(v) {
        if (v !== this.#oid) {
            this.#identify();
            this.#oid = v;
            this.#load();
        }
    }

    get $oid() {
        return this.#oid;
    }

    #pn = 1;

    set $pn(v) {
        if (v !== this.#pn) {
            this.#pn = v;
            this.#load();
        }
    }

    get $pn() {
        return this.#pn;
    }

    #sort: 0 | 2 = 2;

    set $sort(v) {
        if (v !== this.#sort) {
            this.#pn = 1;
            this.#sort = v;
            this.#load();
        }
    }

    get $sort() {
        return this.#sort;
    }

    #type = 1;

    set $type(v) {
        if (v !== this.#type) {
            this.#type = v;
            this.#load();
        }
    }

    get $type() {
        return this.#type;
    }

    #uid = 0;

    #hash = '';

    // 回复评论相关
    $root = '';

    $parent = '';

    $uname = '';

    $replyCurrent?: Reply;

    constructor(
        oid?: number | string,
        pn?: number,
        sort?: 0 | 2,
        type?: number,
        seek_rpid?: number,
    ) {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];
        this.#imagePopover.popover = 'auto';

        this.#order.addEventListener('change', () => {
            const d = new FormData(this.#order);
            this.$sort = <0>+[...d.values()][0];
        });
        this.#interaction.addEventListener('click', this.$onPageClick);
        this.#paging.addEventListener('click', this.$onPageClick);
        this.#send.addEventListener('submit', () => {
            const d = new FormData(this.#send.$submit);
            const message = <string>[...d.values()][0];
            const csrf = cookie.get('bili_jct');
            if (csrf && message) {
                replyAdd({ csrf, oid: this.#oid, message: (this.$uname && (this.$root !== this.$parent) ? `回复 @${this.$uname} :` : '') + message, type: this.#type, root: this.$root, parent: this.$parent })
                    .then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        this.$replyCurrent ? this.$replyCurrent.$replyBox.insertAdjacentElement('afterbegin', new SubReply(this, data.reply, 0)) : this.#list.insertAdjacentElement('afterbegin', new Reply(this, data.reply, 0));
                        this.#send.$empty();
                        this.matches(":popover-open") && this.#send.hidePopover();
                    })
                    .catch(e => {
                        toastr.error('弹幕发送错误', e);
                        console.error(e);
                    });
            }
        });
        this.#list.addEventListener('click', ({ target, screenX, screenY }) => {
            if (target instanceof HTMLImageElement && target.classList.contains('image')) {
                // 评论图片放大
                this.#imageCon.innerHTML = `<img loading="lazy" src="${target.src}">`;
                this.#imagePopover.style.transformOrigin = `${screenX}px ${screenY}px`;
                this.#imagePopover.showPopover();
            } else if (target instanceof HTMLSpanElement && target.classList.contains('reply')) {
                const id = crypto.randomUUID();
                target.style.setProperty('anchor-name', `--${id}`);
                this.#send.style.setProperty('position-anchor', `--${id}`);
                this.#send.popover = 'auto';
                this.#send.showPopover();
            } else if (target instanceof HTMLSpanElement && target.classList.contains('like-num')) {
                const csrf = cookie.get('bili_jct');
                const { rpid } = target.dataset;
                const liked = target.classList.contains('liked') ? 0 : 1;
                if (csrf && rpid) {
                    action(csrf, this.#oid, rpid, liked, this.#type)
                        .then(({ code, message }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                            (<Text>target.lastChild).data = target.classList.toggle('liked') ? <any>+(<Text>target.lastChild).data + 1 : <any>+(<Text>target.lastChild).data - 1;

                        })
                        .catch(e => {
                            toastr.error(`${liked ? '点赞' : '取消'}失败`, e);
                            console.error(e)
                        })
                }
            }
        });
        this.#imageCon.addEventListener('click', e => {
            const { target } = e;
            if (target === this.#imageCon) {
                this.#imagePopover.hidePopover();
            }
        });

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                data.isLogin && (this.#uid = data.mid);
            })
            .catch(e => {
                console.error(e);
            });

        // 初始化
        this.#identify();
        oid && (this.#oid = oid);
        pn && (this.#pn = pn);
        sort === undefined || (this.#sort = sort);
        seek_rpid && (this.#hash = <any>seek_rpid);
        type && (this.#type = type);
        this.#load();
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        url.hash.replace(/reply(\d+)/, (d, h) => {
            this.#hash = h;
            return d;
        });
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                aid && (this.$oid = aid);
                break;
            }
            case ROUTER.BANGUMI: {
                const path = url.pathname.split('/');
                let ssid = 0, epid = 0;
                switch (true) {
                    case /^ss\d+$/i.test(path[3]): {
                        ssid = +path[3].slice(2);
                        break;
                    }
                    case /^ep\d+$/i.test(path[3]): {
                        epid = +path[3].slice(2);
                        break;
                    }
                }
                if (ssid || epid) {
                    pgcAppSeason(ssid ? { season_id: ssid } : { ep_id: epid })
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            epid || (data.user_status.progress?.last_ep_id && (epid = data.user_status.progress?.last_ep_id));
                            data.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        epid || (epid = d.data.episodes[0]?.ep_id);
                                        if (epid) {
                                            const ep = d.data.episodes.find(d => d.ep_id === epid);
                                            ep?.aid && (this.$oid = ep.aid);
                                        }
                                        break;
                                    }
                                }
                            });
                            if (!this.$oid && ssid) {
                                pgcSection(ssid)
                                    .then(({ code, message, result }) => {
                                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                                        const eps = (<IEpisode[]>[]).concat(...(result.main_section?.episodes || []), ...result.section.map(d => d.episodes));
                                        const ep = epid ? eps.find(d => d.id === epid) : eps[0];
                                        ep?.aid && (this.$oid = ep.aid);
                                    })
                                    .catch(e => {
                                        console.error(e);
                                    });
                            }
                        })
                        .catch(e => {
                            console.error(e);
                        });
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                if (aid) {
                    this.$oid = aid;
                } else {
                    toviewWeb()
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            this.$oid = data.list[0].aid;
                        })
                        .catch(e => {
                            console.error(e);
                        });
                }
                break;
            }
        }
    }

    /** 加载弹幕 */
    #load() {
        if (this.#hash && this.#oid) {
            const hash = this.#hash;
            this.#hash = '';
            replyMain(this.#oid, undefined, undefined, hash)
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    if (data.replies) {
                        this.#list.replaceChildren();
                        data.top_replies?.forEach(d => {
                            this.#list.appendChild(new Reply(this, d, data.upper.mid));
                        });
                        data.replies.forEach(d => {
                            this.#list.appendChild(new Reply(this, d, data.upper.mid));
                        });
                        this.#head.dataset.total = <any>data.cursor.all_count;
                        const d = this.#host.querySelector<HTMLElement>(`[data-rpid="${hash}"]`);
                        if (d) {
                            d.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            d.style.backgroundImage = 'linear-gradient(45deg, var(--736ce721) 0%, var(--00a1d621) 67%, var(--00d4ff21) 100%)';
                            d.style.borderRadius = '1em';
                        }
                    }
                })
                .catch(e => {
                    toastr.error('获取评论出错', e);
                    console.error(e);
                });
        } else {
            this.#oid && reply(this.#oid, this.#pn, this.#sort, this.#type)
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    this.#list.replaceChildren();
                    data.top && this.#list.appendChild(new Reply(this, data.top, data.upper.mid));
                    data.replies.forEach(d => {
                        this.#list.appendChild(new Reply(this, d, data.upper.mid));
                    });
                    this.#head.dataset.total = <any>data.page.count;
                    this.$interaction(Math.floor(data.page.count / data.page.size));
                })
                .catch(e => {
                    toastr.error('获取评论出错', e);
                    console.error(e);
                });
        }
    }

    private $interaction(pages: number) {
        this.#interaction.dataset.num = <any>Math.floor(pages);
        if (pages > 1) {
            let html = '';
            if (this.#pn > 1) {
                html += '<a class="prev" data-value="-1">上一页</a><a data-value="1">1</a>';
            }

            if (this.#pn - 3 > 1) {
                html += `<a class="more">...</a>`;
            }
            if (this.#pn - 2 > 1) {
                html += `<a data-value="${this.#pn - 2}">${this.#pn - 2}</a>`;
            }
            if (this.#pn - 1 > 1) {
                html += `<a data-value="${this.#pn - 1}">${this.#pn - 1}</a>`;
            }

            html += `<a class="on">${this.#pn}</a>`;

            if (this.#pn + 1 > 1 && this.#pn + 1 <= pages) {
                html += `<a data-value="${this.#pn + 1}">${this.#pn + 1}</a>`;
            }
            if (this.#pn + 2 > 1 && this.#pn + 2 <= pages) {
                html += `<a data-value="${this.#pn + 2}">${this.#pn + 2}</a>`;
            }
            if (this.#pn + 3 > 1 && this.#pn + 3 <= pages) {
                if (this.#pn + 3 < pages) {
                    html += `<a class="more">...</a>`;
                }

                html += `<a data-value="${pages}">${pages}</a>`;
            }

            if (this.#pn < pages) {
                html += '<a  class="next" data-value="0">下一页</a>';
            }

            this.#interaction.innerHTML = html;

            this.#paging.innerHTML = html + `<span class="page-jump">共${pages}页，跳至<input>页</span>`;
            this.#paging.querySelector('input')?.addEventListener('change', e => {
                const input = <HTMLInputElement>e.target;
                const i = Number(input.value);
                input.value = '';
                i > 1 && (this.$pn = i, this.#order.scrollIntoView({ block: 'center' }));
            });
        } else {
            this.#interaction.replaceChildren();
            this.#paging.replaceChildren();
        }
    }

    private $onPageClick = (e: MouseEvent) => {
        const a = e.target;
        if (a instanceof HTMLAnchorElement) {
            const i = Number(a.dataset.value);
            switch (i) {
                case -1: {
                    this.#pn > 1 && this.$pn--;
                    break;
                }
                case 0: {
                    this.$pn++;
                    break;
                }
                default: {
                    i > 0 && (this.$pn = i);
                    break;
                }
            }
            this.#order.scrollIntoView({ block: 'center' });
        }
    }

    #identify = () => {
        this.#list.replaceChildren();
        this.#oid = 0;
        this.#pn = 1;
        this.#sort = 2;
        this.#type = 1;
        this.#order.innerHTML = `<label><input type="radio" name="${this.#id}" value="2" checked>按热度排序</label><label><input type="radio" name="${this.#id}" value="0">按时间排序</label>`;
    }
}