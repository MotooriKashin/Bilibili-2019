import { Home } from ".";
import { list } from "../../../io/com/bilibili/api/pgc/web/rank/list";
import { TYPE } from "../../../io/com/bilibili/api/pgc/web/timeline";
import { dynamicRegion, REGION } from "../../../io/com/bilibili/api/x/web-interface/dynamic/region";
import { newlist } from "../../../io/com/bilibili/api/x/web-interface/newlist";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 影视型分区 */
@customElement('div')
export class Region extends HTMLDivElement {

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

    #tab = Element.add('form', { appendTo: this.#headline, innerHTML: '<label><input type="radio" name="tab" value="0" checked>有新动态</label><label><input type="radio" name="tab" value="1">最新投稿</label>' });

    #box = Element.add('div', { appendTo: this.#left, class: 'storey-box', innerHTML: '<a><img loading="lazy" src="//i0.hdslb.com/bfs/archive/be27fd62c99036dce67efface486fb0a88ffed06.jpg@.webp" alt="正在加载"><p>正在加载...</p></a>' });

    #push = Element.add('div', { appendTo: this.#headline, class: 'push', innerText: '刷新' });

    #header = Element.add('header', { appendTo: this.#right, innerHTML: `<h3>排行</h3><select><option selected>三日</option><option>一周</option></select>` });

    #rank = Element.add('div', { appendTo: this.#right, class: 'rank' });

    #i = 0;

    constructor(
        private $rid = REGION.DOUGA,
        private type: TYPE,
        href = '/v/douga',
        name = '动画',
        backgroundPosition?: string,
    ) {
        super();

        this.classList.add('module', 'm-region');
        this.#headline.insertAdjacentHTML('afterbegin', `<a target="blank" href="${href}" class="name">${name}</a><a href="${href}" target="_blank" class="more">更多</a>`);
        backgroundPosition && this.#headline.style.setProperty('--background-position', backgroundPosition);
        this.#tab.addEventListener('change', () => {
            const d = new FormData(this.#tab);
            this.#i = Number(d.get('tab'));
            this.region();
        });
        this.#push.addEventListener('click', this.region);

        new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    this.region();
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
                    break;
                }
            }
        }).observe(this);
    }

    private region = () => {
        (this.#i ? newlist(this.$rid) : dynamicRegion(this.$rid))
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                this.#box.innerHTML = https(data.archives.map(d => `<a target="_blank" href="/video/av${d.aid}">
    <img loading="lazy" src="${d.pic}@.webp" alt="${d.title}">
    <div class="mask"></div><span class="dur">${Format.fmSeconds(d.duration)}</span>
    <p title="${d.title}">${d.title}</p>
    <i class="wl" data-aid="${d.aid}" title="稍后再看"></i>
    <div class="num"><span class="play">${Format.carry(d.stat.view)}</span><span class="danmu">${Format.carry(d.stat.danmaku)}</span></div>
</a>`).join(''));
            })
            .catch(e => {
                console.error('获取视频动态出错', e);
                console.error(e);
            });
    }
}