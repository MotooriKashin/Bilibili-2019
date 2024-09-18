import { folder } from "../../io/com/bilibili/api/x/v2/fav/folder";
import { favAdd } from "../../io/com/bilibili/api/x/v2/fav/video/add";
import { favDel } from "../../io/com/bilibili/api/x/v2/fav/video/del";
import { relation } from "../../io/com/bilibili/api/x/web-interface/archive/relation";
import { toastr } from "../../toastr";
import { cookie } from "../../utils/cookie";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { MAIN_EVENT, mainEv } from "../event";

/** 收藏弹窗 */
@customElement('div')
export class Collection extends HTMLDivElement {

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

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #uuid = crypto.randomUUID();

    #header = Element.add('header', { appendTo: this, innerText: '添加到收藏夹' });

    #i = Element.add('i', { appendTo: this.#header });

    #form = Element.add('form', { appendTo: this });

    #button = Element.add('button', { appendTo: this, innerText: '确定' });

    #favoured_0 = new Set<number>();

    #favoured_add: number[] = [];

    #favoured_del: number[] = [];

    constructor() {
        super();

        this.classList.add('collection');
        this.popover = 'manual';

        const id = crypto.randomUUID();
        this.#form.id = id;
        this.#button.setAttribute('form', id);

        this.addEventListener('toggle', () => {
            if (this.matches(':popover-open')) {
                const { aid } = this.dataset;
                aid && folder(aid)
                    .then(({ code, message, data }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                        this.#favoured_0.clear();
                        this.#form.innerHTML = data.map(d => {
                            d.favoured && this.#favoured_0.add(d.fid);
                            return `<label  data-value="${d.cur_count}/${d.max_count}"><input type="checkbox" name="fav" value="${d.fid}"${d.favoured ? ' checked' : ''}>${d.name}${d.state === 3 ? '<i>[私密]</i>' : ''}</label>`
                        }).join('')
                    })
                    .catch(e => {
                        toastr.error('获取收藏列表失败', e);
                        console.error(e);
                    })
            }
            this.#button.disabled = true;
        });
        this.#i.addEventListener('click', () => {
            this.hidePopover();
        });
        this.#form.addEventListener('change', () => {
            const d = new FormData(this.#form);
            const i = d.getAll('fav').map(d => +d);
            this.#favoured_add = [];
            this.#favoured_del = [];
            i.forEach(d => {
                this.#favoured_0.has(d) || this.#favoured_add.push(d);
            });
            this.#favoured_0.forEach(d => {
                i.includes(d) || this.#favoured_del.push(d);
            });

            this.#button.disabled = !(this.#favoured_add.length || this.#favoured_del.length);
        });
        this.#form.addEventListener('submit', e => {
            e.preventDefault();
            const csrf = cookie.get('bili_jct');
            const { aid } = this.dataset;
            if (csrf && aid) {
                const p: Promise<any>[] = [];
                this.#favoured_add.length && p.push(favAdd(csrf, aid, ...this.#favoured_add)
                    .then(({ code, message }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                        toastr.success('添加收藏成功');
                    })
                    .catch(e => {
                        toastr.error('添加收藏失败', e);
                        console.error(e);
                    }));
                this.#favoured_del.length && p.push(favDel(csrf, aid, ...this.#favoured_del)
                    .then(({ code, message }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                        toastr.success('取消收藏成功');
                    })
                    .catch(e => {
                        toastr.error('取消收藏失败', e);
                        console.error(e);
                    }));
                Promise.all(p)
                    .finally(() => {
                        relation.flesh();
                        mainEv.trigger(MAIN_EVENT.RELATION_FLASH, void 0);
                    });
            }
            this.hidePopover();
        });
    }
}