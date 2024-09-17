import { rcmd } from "../../../io/com/bilibili/api/x/web-interface/index/top/rcmd";
import { locs } from "../../../io/com/bilibili/api/x/web-show/res/locs";
import { toastr } from "../../../toastr";
import { AV } from "../../../utils/av";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";

/** 主推荐位 */
@customElement('div')
export class Chief extends HTMLDivElement {

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
    connectedCallback() {
        this.carouselPointerLeave();
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.carouselPointerEnter();
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #carousel = Element.add('div', { appendTo: this, class: 'carousel' });

    #recommend = Element.add('div', { appendTo: this, class: 'recommend' });

    #rec = Element.add('div', { appendTo: this, class: 'rec', innerText: '刷新' });

    #box = Element.add('div', { appendTo: this.#carousel, class: 'box' });

    #trig = Element.add('form', { appendTo: this.#carousel });

    #rollTimer?: ReturnType<typeof setInterval>;

    constructor() {
        super();

        this.classList.add('chief');

        this.#carousel.addEventListener('pointerenter', this.carouselPointerEnter);
        this.#carousel.addEventListener('pointerleave', this.carouselPointerLeave);
        this.#trig.addEventListener('change', () => {
            const d = new FormData(this.#trig);
            const i = [...d.values()][0];
            const next = this.#box.querySelector(`[data-i="${i}"]`);
            if (next instanceof HTMLElement) {
                this.#box.querySelector(".show")?.classList.remove('show');
                next.classList.add('show');
            }
        });
        this.#rec.addEventListener('click', this.rcmd);

        locs(4694)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                // 主推荐滚动图
                const chief = data[4694];
                let form = ''
                this.#box.innerHTML = https(chief.filter(d => !d.ad_cb && !d.null_frame).map((d, i) => {
                    form += `<input value="${i}" name="i" type="radio"${i ? '' : 'checked'}>`;
                    return `<a href="${d.url}" title="${d.name}" data-i="${i}" target="_blank" style="background-image:url(${d.pic}@.webp)"${i ? '' : ' class="show"'}></a>`
                }).join(''));
                this.#trig.innerHTML = form;
            })
            .catch(e => {
                toastr.error('获取轮播推荐失败', e);
                console.error(e);
            });
        this.rcmd();
    }

    private rcmd = () => {
        rcmd()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                this.#recommend.innerHTML = https(AV.fromStr(data.item.map(d => `<a href="/video/av${d.id}" target="_blank" title="${d.title}" style="background-image: url(${d.pic}@.webp)">
	<div class="mark"><p class="title">${d.title}</p><p>up主：${d.owner.name}</p><p>播放：${Format.carry(d.stat.view)}</p></div>
    <i class="wl" data-aid="${d.id}" title="稍后再看"></i>
</a>`).join('')))
            })
            .catch(e => {
                toastr.error('获取推荐数据失败', e);
                console.error(e);
            })
    }

    private carouselPointerLeave = () => {
        this.#rollTimer = setInterval(() => {
            const now = this.#box.querySelector('.show');
            if (now) {
                const next = now.nextSibling || this.#box.firstElementChild;
                if (next instanceof HTMLElement && next !== now) {
                    next.classList.toggle('show');
                    now.classList.toggle('show');
                    const trig = this.#trig.querySelector(`[value="${next.dataset.i}"]`);
                    trig && ((<HTMLInputElement>trig).checked = true);
                }
            }
        }, 5e3);
    }

    private carouselPointerEnter = () => {
        clearInterval(this.#rollTimer);
    }
}