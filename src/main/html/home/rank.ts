import { Home } from ".";
import { dynamicRegion, REGION } from "../../../io/com/bilibili/api/x/web-interface/dynamic/region";
import { newlist } from "../../../io/com/bilibili/api/x/web-interface/newlist";
import { rankRegion } from "../../../io/com/bilibili/api/x/web-interface/ranking/region";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 排行型分区 */
@customElement('div')
export class Rank extends HTMLDivElement {

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

    #header = Element.add('header', { appendTo: this.#right, innerHTML: `<h3>排行</h3><form><label><input type="radio" name="tab" value="0" checked>全部</label><label><input type="radio" name="tab" value="1">原创</label></form><select><option selected>三日</option><option>一周</option></select>` });

    #rank = Element.add('div', { appendTo: this.#right, class: 'rank' });

    #i = 0;

    constructor(
        private $rid = REGION.DOUGA,
        href = '/v/douga',
        name = '动画',
        backgroundPosition?: string,
    ) {
        super();

        this.classList.add('module', 'm-rank');
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
                    rankRegion(this.$rid)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            this.#rank.innerHTML = https(data.map(d => {
                                Home.avs[<any>d.aid] = d;
                                return `<a href="/video/av${d.aid}" target="_blank" data-aid="${d.aid}" class="vt">
	<div class="preview" style="background-image: url(${d.pic}@.webp)"></div>
	<div class="r-i">${d.title}</div>
</a>`}).join(''));
                        })
                        .catch(e => {
                            console.error('获取视频排行出错', e);
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