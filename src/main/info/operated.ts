import { coinAdd } from "../../io/com/bilibili/api/x/web-interface/coin/add";
import { coinTodayExp } from "../../io/com/bilibili/api/x/web-interface/coin/today/exp";
import { toastr } from "../../toastr";
import { cookie } from "../../utils/cookie";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { MAIN_EVENT, mainEv } from "../event";

/** 投币弹窗 */
@customElement('div')
export class Operated extends HTMLDivElement {

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

    #i = Element.add('i', { appendTo: this, class: 'i' });

    #header = Element.add('header', { appendTo: this, innerText: '2' });

    #mc = Element.add('form', { appendTo: this, innerHTML: `<label value="1"><input type="radio" name="coin" value="1"></label><label value="2"><input type="radio" name="coin" value="2" checked></label>` });

    #buttom = Element.add('div', { appendTo: this, class: 'buttom' });

    #button = Element.add('button', { appendTo: this.#buttom, innerText: '确定' });

    #tips = Element.add('div', { appendTo: this.#buttom, class: 'tips', data: { value: '2', exp: '0' } });

    constructor() {
        super();

        this.classList.add('operated');
        this.popover = 'manual';

        this.addEventListener('toggle', () => {
            coinTodayExp()
                .then(({ code, message, data }) => {
                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                    this.#tips.dataset.exp = <any>data;
                })
                .catch(e => {
                    toastr.error('获取今日经验值出错', e);
                    console.error(e);
                });
        }, { once: true });
        this.#i.addEventListener('click', () => {
            this.hidePopover();
        });
        this.#mc.addEventListener('change', () => {
            const d = new FormData(this.#mc);
            const i = Number(d.get('coin'));
            if (!Number.isNaN(i)) {
                this.#header.innerText = this.#tips.dataset.value = <any>i;
            }
        });
        this.#button.addEventListener('click', () => {
            const csrf = cookie.get('bili_jct');
            const { aid } = this.dataset;
            const d = new FormData(this.#mc);
            const i = <1>Number(d.get('coin'));
            if (csrf && aid && !Number.isNaN(i)) {
                coinAdd(csrf, aid, i)
                    .then(({ code, message }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                        this.hidePopover();
                        mainEv.trigger(MAIN_EVENT.RELATION_FLASH, void 0);
                    })
                    .catch(e => {
                        toastr.error('投币出错', e);
                        console.error(e);
                    })
            }
        });
    }
}