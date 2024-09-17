import { getList, IRecommendRoomList } from "../../../io/com/bilibili/live/api/xlive/web-interface/v1/webMain/getList";
import { getMoreRecList } from "../../../io/com/bilibili/live/api/xlive/web-interface/v1/webMain/getMoreRecList";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 正在直播 */
@customElement('div')
export class Live extends HTMLDivElement {

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

    #headline = Element.add('div', { appendTo: this.#left, class: 'headline', innerHTML: '<a target="blank" href="//live.bilibili.com/" class="name">正在直播</a><a href="//live.bilibili.com/" target="_blank" class="more">更多</a>' });

    #box = Element.add('div', { appendTo: this.#left, class: 'storey-box' });

    #tab = Element.add('form', { appendTo: this.#right, innerHTML: '<label><input type="radio" name="tab" value="0" checked>直播排行</label><label><input type="radio" name="tab" value="1">关注的主播</label><label><input type="radio" name="tab" value="2">为你推荐</label>' });

    #rank = Element.add('div', { appendTo: this.#right, class: 'rank' });

    constructor() {
        super();

        this.classList.add('module', 'live');

        this.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLDivElement && target.classList.contains('push')) {
                getMoreRecList()
                    .then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        const { recommend_room_list } = data;
                        this.recommend_room_list(recommend_room_list);
                    })
                    .catch(e => {
                        toastr.error('刷新直播推荐失败', e);
                        console.error(e);
                    })
                    .finally(() => {
                        target.innerHTML = '刷新';
                    });
            }
        });
        this.#tab.addEventListener('change', () => {
            const d = new FormData(this.#tab);
            const i = Number(d.get('tab'));
            switch (i) {
                case 0: {
                    this.#rank.classList.remove('hide');
                    break;
                }
                default: {
                    this.#rank.classList.add('hide');
                    break;
                }
            }
        });

        getList()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                const { recommend_room_list, online_total, ranking_list, dynamic } = data;
                this.#headline.insertAdjacentHTML('beforeend', `<div class="online">当前共有<span>${online_total}</span>个在线直播</div><a href="//vc.bilibili.com" target="_blank" class="fire">233秒居然能做这些！</a><div class="push"><b>${dynamic}</b>条新动态</div>`);
                this.recommend_room_list(recommend_room_list);
                if (ranking_list) {
                    this.#rank.innerHTML = https(ranking_list.map(d => `<div>
	<a href="//space.bilibili.com/${d.uid}" target="_blank" class="preview" style="background-image: url(${d.face}@.webp)"></a>
	<a href="//live.bilibili.com/${d.roomid}" target="_blank" class="r-i">
		<div>
			<span class="u-name">${d.uname}</span>
			<span class="u-online">${Format.carry(d.online)}</span>
		</div>
		<div title="${d.title}">${d.title}</div>
	</a>
</div>`).join(''));
                }
            })
            .catch(e => {
                toastr.error('获取直播推荐失败', e);
                console.error(e);
            });
    }

    private recommend_room_list(d: IRecommendRoomList[]) {
        this.#box.innerHTML = https(d.map(d => `<a target="_blank" href="//live.bilibili.com/${d.roomid}">
    <img loading="lazy" src="${d.cover}@.webp" alt="${d.title}">
    <div class="mask" style="background-image: url(${d.keyframe})"></div>
    <div class="snum"><span>${d.uname}</span><span class="online">${Format.carry(d.online)}</span></div>
    <p title="${d.title}">${d.title}</p>
    <div class="num">${d.area_v2_parent_name} · ${d.area_v2_name}</div>
</a>`).join(''));
    }
}