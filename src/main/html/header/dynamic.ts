import { add } from "../../../io/com/bilibili/api/x/v2/history/toview/add";
import { del } from "../../../io/com/bilibili/api/x/v2/history/toview/del";
import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import { feed_list } from "../../../io/com/bilibili/live/api/relation/v1/feed/feed_list";
import { dynamic_new, IDynamicArticle, IDynamicNewCard } from "../../../io/com/bilibili/vc/api/dynamic_svr/v1/dynamic_svr/dynamic_new";
import { dynamic_num } from "../../../io/com/bilibili/vc/api/dynamic_svr/v1/dynamic_svr/dynamic_num";
import { toastr } from "../../../toastr";
import { cookie } from "../../../utils/cookie";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { https } from "../../../utils/https";

/** 动态 */
@customElement('div')
export class Dynamic extends HTMLDivElement {

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

    #menu = Element.add('form', {
        class: 'dyn_menu', appendTo: this, innerHTML: `<label><input type="radio" name="menu" value="0" checked>视频</label>
<label><input type="radio" name="menu" value="1">直播</label>
<label><input type="radio" name="menu" value="2">专栏</label>
`});

    #list = Element.add('div', { class: 'dyn_list', appendTo: this });

    #wnd = Element.add('a', { class: 'wnd_bottom', appendTo: this, innerText: '查看全部', attribute: { href: '//t.bilibili.com', target: 'blank' } });

    #mid = 0;

    constructor() {
        super();

        this.classList.add('dynamic-wrap');

        this.addEventListener('click', e => {
            const { target } = e;
            if (target instanceof HTMLElement && target.classList.contains('wl')) {
                e.preventDefault();
                const d = target.classList.toggle('d');
                target.title = d ? '移除' : '稍后再看';
                const { aid } = target.dataset;
                const csrf = cookie.get('bili_jct');
                if (aid && csrf) {
                    if (d) {
                        add(csrf, aid)
                            .then(({ code, message }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                                toastr.success(`已添加稍后再看：av${aid}`);
                            })
                            .catch(e => {
                                target.classList.remove('d');
                                target.title = '稍后再看';
                                toastr.error('添加稍后再看出错', e)
                            })
                    } else {
                        del(csrf, aid)
                            .then(({ code, message }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                                toastr.success(`已移除稍后再看：av${aid}`);
                            })
                            .catch(e => {
                                target.classList.add('d');
                                target.title = '移除';
                                toastr.error('移除稍后再看出错', e);
                            })
                    }
                } else {
                    target.classList.remove('d');
                    target.title = '稍后再看';
                }
            }
        });
        this.#menu.addEventListener('change', () => {
            const d = new FormData(this.#menu);
            const i = +[...d.values()][0];
            switch (i) {
                case 0: {
                    this.dynamic_video();
                    break;
                }
                case 1: {
                    this.dynamic_live();
                    break;
                }
                case 2: {
                    this.dynamic_article();
                    break;
                }
                default: {
                    this.#list.replaceChildren();
                }
            }
        });

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.isLogin) {
                    this.classList.add('d');
                    this.#mid = data.mid;
                    // 请求新动态信息
                    const id = localStorage.getItem(`bp_t_offset_${data.mid}`);
                    dynamic_num(data.mid, id || '0', 8, 64, 512).then(d => {
                        d && ((<HTMLElement>this.parentElement!.querySelector('.dynamic')).dataset.num = d > 99 ? '99+' : <any>d);
                    });

                    (<HTMLElement>this.parentElement!.querySelector('.dynamic')).addEventListener('pointerenter', () => {
                        (<HTMLElement>this.parentElement!.querySelector('.dynamic'))?.removeAttribute('data-num');
                        this.dynamic_video();
                    }, { once: true });
                }
            }).catch(e => {
                console.error(e);
            });
    }

    private dynamic_video() {
        this.#mid && dynamic_new(this.#mid || 0, 8, 512)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                localStorage.setItem(`bp_t_offset_${this.#mid}`, <any>data.max_dynamic_id);
                this.#list.innerHTML = https(data.cards.map(d => {
                    const card: IDynamicNewCard = JSON.parse(d.card);
                    return `<div>
	<a href="//www.bilibili.com/video/av${card.aid}" target="_blank" title="${card.title}" style="background-image: url(${card.pic}@.webp)"><i class="wl" data-aid="${card.aid}" title="稍后再看"></i></a>
	<div class="r">
		<div class="title">
			<a href="//space.bilibili.com/${card.owner.mid}" target="_blank">${card.owner.name}</a>
			<span>${d.display.usr_action_txt || '投稿了'}</span>
		</div>
		<a href="//www.bilibili.com/video/av${card.aid}" target="_blank" title="${card.title}">${card.title}</a>
	</div>
</div>`
                }).join(''));
            })
            .catch(e => {
                toastr.error('获取新视频动态出错', e);
                console.error(e);
            });
    }

    private dynamic_article() {
        this.#mid && dynamic_new(this.#mid || 0, 64)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                localStorage.setItem(`bp_t_offset_${this.#mid}`, <any>data.max_dynamic_id);
                this.#list.innerHTML = https(data.cards.map(d => {
                    const card: IDynamicArticle = JSON.parse(d.card);
                    return `<div>
	<a href="//www.bilibili.com/read/cv${card.id}" target="_blank" title="${card.title}" style="background-image: url(${card.image_urls[0]}@.webp)"></a>
	<div class="r">
		<div class="title">
			<a href="//space.bilibili.com/${card.author.mid}" target="_blank">${card.author.name}</a>
			<span>${d.display.usr_action_txt || '投稿了'}</span>
		</div>
		<a href="//www.bilibili.com/read/cv${card.id}" target="_blank" title="${card.title}">${card.title}</a>
	</div>
</div>`
                }).join(''));
            })
            .catch(e => {
                toastr.error('获取新专栏动态出错', e);
                console.error(e);
            });
    }

    private dynamic_live() {
        this.#mid && feed_list()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                this.#list.innerHTML = https(data.list.map(d => `<div>
	<a class="live" href="${d.link}" target="_blank" title="${d.title}" style="background-image: url(${d.face}@.webp)"></a>
	<div class="r">
		<div class="title">
			<a href="//space.bilibili.com/${d.uid}" target="_blank">${d.uname}</a>
			<span class="live">正在直播</span>
		</div>
		<a href="${d.link}" target="_blank" title="${d.title}">${d.title}</a>
	</div>
</div>`).join(''))
            })
            .catch(e => {
                toastr.error('获取新直播动态失败', e);
                console.error(e);
            });
    }
}