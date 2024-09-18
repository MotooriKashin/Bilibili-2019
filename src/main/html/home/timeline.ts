import { Home } from ".";
import { list } from "../../../io/com/bilibili/api/pgc/web/rank/list";
import { IEpisodes, timeline, TYPE } from "../../../io/com/bilibili/api/pgc/web/timeline";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 时间轴型分区 */
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

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    #left = Element.add('div', { appendTo: this, class: ['left', 'zone'] });

    #right = Element.add('div', { appendTo: this, class: 'right' });

    #headline = Element.add('div', { appendTo: this.#left, class: 'headline' });

    #form = Element.add('form', { appendTo: this.#headline, innerHTML: '<label><input type="radio" name="tab" value="0" checked>最新</label><label><input type="radio" name="tab" value="1">一</label><label><input type="radio" name="tab" value="2">二</label><label><input type="radio" name="tab" value="3">三</label><label><input type="radio" name="tab" value="4">四</label><label><input type="radio" name="tab" value="5">五</label><label><input type="radio" name="tab" value="6">六</label><label><input type="radio" name="tab" value="7">日</label>' });

    #box = Element.add('div', { appendTo: this.#left, class: 'timeline-box', innerHTML: '<div></div>' });

    #header = Element.add('header', { appendTo: this.#right, innerHTML: `<h3>排行</h3><select><option selected>三日</option><option>一周</option></select>` });

    #rank = Element.add('div', { appendTo: this.#right, class: 'rank' });

    #episodes: IEpisodes[][] = [];

    #tab = 0;

    set $tab(v: number | string) {
        this.#tab = +v || 0;
        this.flushTabs();
    }

    constructor(
        private type: TYPE,
        href: string,
        name: string,
        tlink: string,
        backgroundPosition?: string,
    ) {
        super();

        this.classList.add('module', 'm-timeline');
        this.#headline.insertAdjacentHTML('afterbegin', `<a target="blank" href="${href}" class="name">${name}</a><a href="${tlink}" target="_blank" class="c-clink more">新番时间表</a>`);
        backgroundPosition && this.#headline.style.setProperty('--background-position', backgroundPosition);
        this.#form.addEventListener('change', () => {
            const form = new FormData(this.#form);
            this.$tab = +[...form.values()][0];
        });

        timeline(type)
            .then(({ code, message, result }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                result.forEach(d => {
                    this.#episodes[d.day_of_week] || (this.#episodes[d.day_of_week] = []);
                    this.#episodes[d.day_of_week] = this.#episodes[d.day_of_week].concat(d.episodes);
                    this.#episodes[0] || (this.#episodes[0] = []);
                    this.#episodes[0] = this.#episodes[0].concat(d.episodes.filter(d => d.published));
                });
                this.#episodes.forEach(d => {
                    d.sort((a, b) => a.pub_ts > b.pub_ts ? 1 : -1)
                });
                this.$tab = 0;
            })
            .catch(e => {
                toastr.error(`获取${name}时间轴出错`, e);
                console.error(e);
            });
        list(type)
            .then(({ code, message, result }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                this.#rank.innerHTML = https(result.list.map(d => {
                    Home.sss[d.season_id] = d;
                    return `<a href="${d.url}" target="_blank" title="${d.title} 播放:${Format.carry(d.stat.view)}" data-ssid="${d.season_id}" class="vt">
	<span>${d.title}</span>
	<span>${d.new_ep.index_show}</span>
</a>`}).join(''));
            })
            .catch(e => {
                toastr.error(`获取${name}排行出错`, e);
                console.error(e);
            });
    }

    private flushTabs() {
        this.#box.innerHTML = https(this.#episodes[this.#tab].map(d => `<div>
	<a href="/bangumi/play/ss${d.season_id}" target="_blank" title="${d.title}" class="pic" style="background-image: url(${d.square_cover || d.cover}@.webp)"></a>
	<div class="r-text">
		<a href="/bangumi/play/ss${d.season_id}" target="_blank" title="${d.title}" class="t">${d.title}</a>
		<a href="/bangumi/play/ep${d.episode_id}" target="_blank"${d.published ? ' class="published"' : ''}>${d.pub_index}</a>
	</div>
</div>`).join(''));
    }
}