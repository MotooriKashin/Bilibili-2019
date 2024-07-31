import { season } from "../../../io/com/bilibili/api/pgc/view/web/season";
import { followAdd } from "../../../io/com/bilibili/api/pgc/web/follow/add";
import { followDel } from "../../../io/com/bilibili/api/pgc/web/follow/del";
import { ICardsOut } from "../../../io/com/bilibili/api/x/article/cards";
import { detail } from "../../../io/com/bilibili/api/x/web-interface/view/detail";
import svg_heart from "../../../player/assets/svg/heart.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { cookie } from "../../../utils/cookie";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 视频介绍 */
@customElement('div')
export class Desc extends HTMLDivElement {

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

    private $desc = Element.add('div', { class: 'desc' }, this);

    private $tag = Element.add('div', { class: 'tag' }, this.$desc);

    private $m = Element.add('div', { class: 'm' }, this.$desc);

    private $cover = Element.add('a', { class: 'bangumi-cover', target: '_blank' }, this.$desc);

    private $info = Element.add('div', { class: 'bangumi-info', target: '_blank' }, this.$desc);

    private $title = Element.add('div', { class: 'bangumi-title' }, this.$info);

    private $a = Element.add('a', { target: '_blank' }, this.$title);

    private $follow = Element.add('button', { class: "btn-follow" }, this.$title, `${svg_heart}追番`);

    private $list = Element.add('div', { class: 'bangumi-list' }, this.$info);

    private $section = Element.add('form', { class: 'bangumi-section' }, this.$list);

    private $episode = Element.add('div', { class: 'bangumi-episode' }, this.$list);

    private $detail = Element.add('div', { class: 'bangumi-detail' }, this.$info);

    constructor() {
        super();
        this.insertAdjacentHTML('beforeend', `<style>${__BILI_DESC_STYLE__}</style>`);

        this.$section.addEventListener('change', () => {
            const d = new FormData(this.$section);
            const i = +[...d.values()][0];
            if (i) {
                season({ season_id: i }).then(d => {
                    this.bangumi(d);
                })
            }
        });
        this.$follow.addEventListener('click', () => {
            const csrf = cookie.get('bili_jct');
            const { ssid } = this.$follow.dataset;
            if (csrf && ssid) {
                (this.$follow.classList.contains('followed') ? followDel(csrf, ssid) : followAdd(csrf, ssid)).then(({ toast }) => {
                    this.$follow.textContent = toast;
                    this.$follow.classList.toggle('followed');
                });
            }
        });
    }

    update(data: Awaited<ReturnType<typeof detail>>) {
        this.desc(<ICardsOut><unknown>data.View);
        let p = '';
        data.Tags.forEach(d => {
            p += `<a target="_blank" href="//search.bilibili.com/all?keyword=${d.tag_name}">${d.tag_name}</a>`
        });
        this.$tag.innerHTML = p;
    }

    desc(data: ICardsOut) {
        this.identify();
        this.$m.innerHTML = Format.superLink(data.desc);
    }

    bangumi(data: Awaited<ReturnType<typeof season>>, epid?: number) {
        this.identify();
        this.$desc.classList.add('bangumi');
        this.$cover.href = this.$a.href = `//www.bilibili.com/bangumi/media/md${data.media_id}`;
        this.$cover.innerHTML = `<img loading="lazy" src="${https(data.cover)}@.webp">`;
        this.$a.text = data.title;
        this.$follow.dataset.ssid = <any>data.season_id;

        const id = crypto.randomUUID();
        this.$section.innerHTML = data.seasons.map(d => {
            return `<label class="season-item">${d.season_title}<input type="radio" name=${id} value="${d.season_id}" ${d.season_id === data.season_id ? ' checked' : ''}></label>`;
        }).join('');
        this.$episode.innerHTML = data.episodes.map(d => {
            return `<a class="episode-item${d.ep_id === epid ? ' on' : ''}" href="/bangumi/play/ep${d.ep_id}" data-index="${/^\d+$/.test(d.title) ? `第${d.title}话` : d.title}"><span>${d.long_title}</span><span class="badge" style="background-color: ${d.badge_info.bg_color || '#fb7299'};">${d.badge_info.text}</span></a>`
        }).join('');
        this.$detail.innerHTML = `<p><label>风格：</label>${data.styles.map(d => `<span>${d}</span>`).join('')}</p>
<p><label>主创：</label>${data.staff}</p>
<p><label>演员：</label>${data.actors}</p>
<p><label>简介：</label>${data.evaluate}</p>`;
    }

    private identify = () => {
        this.$desc.classList.remove('bangumi');
        this.$tag.replaceChildren();
        this.$m.replaceChildren();
        this.$cover.replaceChildren();
        this.$a.replaceChildren();
        this.$section.replaceChildren();
        this.$episode.replaceChildren();
        this.$detail.replaceChildren();
    }
}


//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_DESC_STYLE__: string;
}