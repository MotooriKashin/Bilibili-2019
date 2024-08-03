import { REGION, region as dynamicRegion } from "../../../io/com/bilibili/api/x/web-interface/dynamic/region";
import { newlist } from "../../../io/com/bilibili/api/x/web-interface/newlist";
import { region as rankingRegion } from "../../../io/com/bilibili/api/x/web-interface/ranking/region";
import svg_icon_danmaku from "../../../player/assets/svg/icon-danmaku.svg";
import svg_icon_played from "../../../player/assets/svg/icon-played.svg";
import svg_reflesh from "../../../player/assets/svg/reflesh.svg";
import svg_sent from "../../../player/assets/svg/sent.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { AV } from "../../../utils/av";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 顶栏 */
@customElement('div')
export class Ranking extends HTMLDivElement {

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

    private $lCon = Element.add('div', { class: 'l-con' }, this, `<div class="headline"><i class="icon-t icon-promote"></i><a target="_blank" class="name"></a><button class="read-push">${svg_reflesh}刷新动态</button><a target="_blank" class="link-more">更多${svg_sent}</a></div><div class="storey-box"></div>`);

    private $rCon = Element.add('div', { class: 'r-con' }, this, `<header>排行</header><div class="tab-box"></div><a target="_blank" class="more-link">查看更多${svg_sent}</a>`);

    private $lForm = Element.add('form', undefined, <HTMLElement>this.$lCon.firstElementChild);

    private newList = false;

    constructor(
        name: string,
        href: string,
        private rid: REGION,
    ) {
        super();

        this.classList.add('bili-ranking');

        (<HTMLAnchorElement>this.$lCon.firstElementChild!.childNodes[1]).href = href;
        (<HTMLAnchorElement>this.$lCon.firstElementChild!.childNodes[3]).href = href;
        (<HTMLAnchorElement>this.$lCon.firstElementChild!.childNodes[1]).text = name;
        (<HTMLAnchorElement>this.$rCon.childNodes[2]).href = `/ranking/all/${rid}/1/3/`;

        const id = crypto.randomUUID();
        this.$lForm.innerHTML = `<label><input type="radio" name=${id} value="0" checked>有新动态</label><label><input type="radio" name=${id} value="1">最新投稿</label>`;

        this.$lCon.addEventListener('click', e => {
            const { target } = e;
            if (target instanceof HTMLButtonElement && target.classList.contains('read-push')) {
                target.disabled = true;
                this.fleshRegion().finally(() => {
                    target.disabled = false;
                });
            }
        });
        this.$lForm.addEventListener('change', () => {
            const d = new FormData(this.$lForm);
            const i = +[...d.values()][0];
            this.newList = Boolean(i);
            this.fleshRegion();
        });

        new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    this.fleshRegion();
                    this.rankRegion();
                    break;
                }
            }
        }).observe(this);
    }

    private fleshRegion() {
        return (this.newList ? newlist(this.rid) : dynamicRegion(this.rid)).then(d => {
            this.$lCon.lastElementChild!.innerHTML = AV.fromStr(https(d.map(d => `<a target="_blank" href="/video/av${d.aid}"><img loading="lazy" src="${d.pic}@.webp"><p class="t">${d.title}</p><p class="num"><span>${svg_icon_played}${Format.carry(d.stat.view)}</span><span>${svg_icon_danmaku}${Format.carry(d.stat.danmaku)}</span></p><div class="mask"></div><div class="duration">${Format.fmSeconds(d.duration)}</div><div class="wl" title="稍后再看" data-aid="${d.aid}"></div></a>`).join('')));
        });
    }

    private rankRegion() {
        rankingRegion(this.rid).then(d => {
            d && ((<HTMLElement>this.$rCon.childNodes[1]).innerHTML = AV.fromStr(https(d.map((d, i) => `<div class="item" data-v-aid="${d.aid}"><div class="number"><span>${i + 1}</span></div>${i ? '' : `<img loading="lazy" src="${d.pic}@.webp">`}<a class="ri" target="_blank" href="/video/av${d.aid}">${d.title}</a>${i ? '' : `<div class="wl" title="稍后再看" data-aid="${d.aid}"></div>`}</div>`).join(''))));
        })
    }
}