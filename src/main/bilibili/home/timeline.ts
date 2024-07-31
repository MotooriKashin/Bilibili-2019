import { list } from "../../../io/com/bilibili/api/pgc/web/rank/list";
import { IEpisodes, TYPE, timeline } from "../../../io/com/bilibili/api/pgc/web/timeline";
import { REGION } from "../../../io/com/bilibili/api/x/web-interface/dynamic/region";
import svg_sent from "../../../player/assets/svg/sent.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { AV } from "../../../utils/av";
import { Element } from "../../../utils/element";
import { https } from "../../../utils/https";

/** 顶栏 */
@customElement('div')
export class Timeline extends HTMLDivElement {

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

    private $lCon = Element.add('div', { class: 'l-con' }, this, `<div class="headline"><i class="icon-t icon-promote"></i><a target="_blank" class="name"></a></div>`);

    private $rCon = Element.add('div', { class: 'r-con' }, this, `<header>排行</header><div class="tab-box"></div><a target="_blank" class="more-link">查看更多${svg_sent}</a>`);

    private $lTab = Element.add('form', { class: 'bili-tab' }, <HTMLElement>this.$lCon.firstElementChild);

    private $timingBox = Element.add('div', { class: 'timing-box' }, this.$lCon);

    private episodes: IEpisodes[][] = [];

    #tab = 0;

    set $tab(v: number | string) {
        this.#tab = +v || 0;
        this.flushTabs();
    }

    constructor(
        name: string,
        href: string,
        private type: TYPE,
        private rid: REGION,
    ) {
        super();

        this.classList.add('bili-timeline');
        (<HTMLAnchorElement>this.$lCon.firstElementChild!.childNodes[1]).href = href;
        (<HTMLAnchorElement>this.$lCon.firstElementChild!.childNodes[1]).text = name;
        (<HTMLAnchorElement>this.$rCon.childNodes[2]).href = `/ranking/bangumi/${rid}/1/3/`;
        (<HTMLElement>this.$lCon.firstElementChild).insertAdjacentHTML('beforeend', `<a target="_blank" class="c-clink" href="${href}/timeline">新番时间表${svg_sent}</a>`);

        const id = crypto.randomUUID();
        this.$lTab.insertAdjacentHTML('afterbegin', `<label><input type="radio" name=${id} value="0" checked>最新</label>
<label><input type="radio" name=${id} value="1">一</label>
<label><input type="radio" name=${id} value="2">二</label>
<label><input type="radio" name=${id} value="3">三</label>
<label><input type="radio" name=${id} value="4">四</label>
<label><input type="radio" name=${id} value="5">五</label>
<label><input type="radio" name=${id} value="6">六</label>
<label><input type="radio" name=${id} value="7">日</label>`);

        this.$lTab.addEventListener('change', () => {
            const form = new FormData(this.$lTab);
            this.$tab = +[...form.values()][0];
        });

        timeline(type).then(d => {
            d.forEach(d => {
                this.episodes[d.day_of_week] || (this.episodes[d.day_of_week] = []);
                this.episodes[d.day_of_week] = this.episodes[d.day_of_week].concat(d.episodes);
                this.episodes[0] || (this.episodes[0] = []);
                this.episodes[0] = this.episodes[0].concat(d.episodes.filter(d => d.published));
            });
            this.episodes.forEach(d => {
                d.sort((a, b) => a.pub_ts > b.pub_ts ? 1 : -1)
            });
            this.$tab = 0;
        });

        list(type).then(d => {
            (<HTMLElement>this.$rCon.childNodes[1]).innerHTML = AV.fromStr(https(d.map((d, i) => `<div class="item"><div class="number"><span>${i + 1}</span></div><a class="ri-title" target="_blank" href="${d.url}">${d.title}<span class="ri-total">${d.new_ep.index_show}</span></a></div>`).join('')))
        })
    }

    private flushTabs() {
        this.$timingBox.innerHTML = AV.fromStr(https(this.episodes[this.#tab].map(d => `<div class="timing-card"><a target="_blank" class="pic" href="/bangumi/play/ss${d.season_id}"><img loading="lazy" src="${d.square_cover || d.cover}@.webp"></a><a target="_blank" class="t" href="/bangumi/play/ss${d.season_id}">${d.title}</a><p class="update${d.published ? ' published' : ''}"><a target="_blank" href="/bangumi/play/ep${d.episode_id}">${d.pub_index}</a></p></div>`).join('')))
    }
}