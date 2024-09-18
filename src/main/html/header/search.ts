import { searchDefault } from "../../../io/com/bilibili/api/x/web-interface/search/default";
import { searchSuggest } from "../../../io/com/bilibili/search/s/main/suggest";
import { cookie } from "../../../utils/cookie";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";

/** 搜索 */
@customElement('div')
export class Search extends HTMLDivElement {

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
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() { }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #rank = Element.add('a', { appendTo: this, attribute: { href: '//www.bilibili.com/ranking', target: '_blank' }, innerText: '排行榜' });

    #form = Element.add('form', { appendTo: this });

    #input = Element.add('input', { appendTo: this.#form, attribute: { type: 'text', autocomplete: 'off', name: 'keyword' } });

    #button = Element.add('button', { appendTo: this.#form });

    #suggest = Element.add('div', { appendTo: this, class: 'suggest' });

    #composition = true;

    #url = '';

    #abortSignal?: AbortController;

    constructor() {
        super();

        this.classList.add('search');
        this.#form.action = '//search.bilibili.com/all';
        this.#form.method = 'get';
        this.#form.target = '_blank';

        this.#form.addEventListener('compositionstart', () => {
            this.#composition = false;
        });
        this.#form.addEventListener('compositionend', () => {
            this.#composition = true;
            this.onInput();
        });
        this.#form.addEventListener('input', this.onInput);
        this.#form.addEventListener('submit', e => {
            if (!this.#input.value) {
                e.preventDefault();
                self.open(this.#url || '//search.bilibili.com');
            } else {
                try {
                    const data = <ISearchHistory[]>JSON.parse(localStorage.getItem('search_history')!);
                    const newDate = data.filter(d => d.value !== this.#input.value);
                    newDate.push({ isHistory: 1, value: this.#input.value, timestamp: Date.now() });
                    localStorage.setItem('search_history', JSON.stringify(newDate));
                } catch {
                    localStorage.setItem('search_history', JSON.stringify([{ isHistory: 1, value: this.#input.value, timestamp: Date.now() }]));
                }
            }
        });
        this.#suggest.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLDivElement && target.classList.contains('item')) {
                const { value } = target.dataset;
                if (value) {
                    this.#input.value = value;
                    this.#button.click();
                }
            } else if (target instanceof HTMLElement && target.classList.contains('cancel')) {
                target.parentElement?.remove();
                try {
                    const { ts } = target.dataset;
                    if (ts) {
                        const data = <ISearchHistory[]>JSON.parse(localStorage.getItem('search_history')!);
                        localStorage.setItem('search_history', JSON.stringify(data.filter(d => d.timestamp !== +ts)));
                    }
                } catch {
                    localStorage.removeItem('search_history');
                }
            }
        });

        searchDefault()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                this.#input.placeholder = data.show_name || data.name;
                this.#url = data.url;
            })
            .catch(console.error);

        this.initHistory();

    }

    private onInput = () => {
        if (this.#composition) {
            if (this.#input.value) {
                this.#abortSignal?.abort();
                this.#abortSignal = new AbortController();
                searchSuggest(this.#input.value, cookie.get('DedeUserID') || '0', this.#abortSignal.signal)
                    .then(({ code, message, result }) => {
                        if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                        this.#suggest.innerHTML = result.tag.map(d => `<div class="item" data-value="${d.term}"><div>${d.term}</div></div>`).join('');
                    })
                    .catch(console.error)
            } else {
                this.initHistory();
            }
        }
    }

    /** 获取本地历史记录 */
    private initHistory() {
        try {
            const data = <ISearchHistory[]>JSON.parse(localStorage.getItem('search_history')!);
            this.#suggest.innerHTML = '<div class="line">历史搜索</div>' + data.map(d => `<div class="item" data-value="${d.value}"><div>${d.value}</div><i class="cancel" data-ts="${d.timestamp}"></i></div>`).join('');
        } catch {
            localStorage.removeItem('search_history');
        }
    }
}

interface ISearchHistory {
    isHistory: number;
    timestamp: number;
    value: string;
}