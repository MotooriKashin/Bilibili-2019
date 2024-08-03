import { pgcAppSeason } from "../../../io/com/bilibili/api/pgc/view/v2/app/season";
import { cards } from "../../../io/com/bilibili/api/x/article/cards";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
import { TOTP } from "../../../utils/TOTP";
import css_video_info from "./style/video-info.css";

@customElement(undefined, `video-info-${TOTP.now()}`)
export class VideoInfo extends HTMLElement {

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
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() { }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #host = this.attachShadow({ mode: 'closed' });

    private $title = this.#host.appendChild(Element.add('div', { class: 'v-title' }));

    private $info = this.#host.appendChild(Element.add('div', { class: 'v-info' }));

    private $preview = this.#host.appendChild(Element.add('div', { class: 'v-preview' }));

    private $data = this.#host.appendChild(Element.add('div', { class: 'v-data' }));

    constructor() {
        super();
        this.$title.insertAdjacentHTML('beforebegin', `<style>${css_video_info}</style>`);
        this.popover = 'auto';

        document.addEventListener('pointerover', this.onPointerover);
    }

    private onPointerover = ({ target }: PointerEvent) => {
        const node = (<HTMLElement>target)?.closest<HTMLElement>('[data-v-aid]');
        if (node) {
            const { vAid } = node.dataset;
            if (vAid) {
                const id = crypto.randomUUID();
                node.style.setProperty('anchor-name', `--${id}`);
                this.style.setProperty('position-anchor', `--${id}`);
                this.onMouseoverAid(vAid);
            }
        } else {
            const node = (<HTMLElement>target)?.closest<HTMLElement>('[data-v-ssid]');
            if (node) {
                const { vSsid } = node.dataset;
                if (vSsid) {
                    const id = crypto.randomUUID();
                    node.style.setProperty('anchor-name', `--${id}`);
                    this.style.setProperty('position-anchor', `--${id}`);
                    this.onMouseoverSsid(vSsid);
                }
            } else {
                this.hidePopover();
            }
        }
    }

    private onMouseoverAid = (
        aid: string | number,
    ) => {
        cards({ av: <number>aid }).then(d => {
            const card = d[`av${aid}`];
            if (card) {
                this.$title.innerText = card.title;
                this.$info.innerHTML = `<span>${card.owner.name}</span><span>${Format.eTime(card.pubdate)}</span>`;
                this.$preview.innerHTML = https(`<img loading="lazy" src="${card.pic}@.webp"><p>${card.desc}</p>`);
                this.$data.innerHTML = `<span class="play"><i></i>${Format.carry(card.stat.view)}</span><span class="danmu"><i></i>${Format.carry(card.stat.danmaku)}</span><span class="star"><i></i>${Format.carry(card.stat.favorite)}</span><span class="coin"><i></i>${Format.carry(card.stat.coin)}</span>`;
                this.showPopover();
            }
        })
    }

    private onMouseoverSsid = (
        ssid: string | number,
    ) => {
        pgcAppSeason({ season_id: ssid }).then(d => {
            if (d) {
                this.$title.innerHTML = d.title;
                this.$info.innerHTML = `<span>${d.type_desc}</span>`;
                this.$preview.innerHTML = https(`<img loading="lazy" src="${d.cover}@.webp"><p>${d.evaluate}</p>`);
                this.$data.innerHTML = `<span class="play"><i></i>${Format.carry(d.stat.views)}</span><span class="danmu"><i></i>${Format.carry(d.stat.danmakus)}</span><span class="star"><i></i>${Format.carry(d.stat.favorites)}</span><span class="coin"><i></i>${Format.carry(d.stat.coins)}</span>`;
                this.showPopover();
            }
        })
    }

    showPopover() {
        document.body.contains(this) || document.body.appendChild(this);
        super.showPopover();
    }
}