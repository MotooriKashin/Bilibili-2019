import { Player } from "../..";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { ev, PLAYER_EVENT } from "../../event";

/** 洗脑循环 */
@customElement('label')
export class Quality extends HTMLLabelElement {

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
        this.insertAdjacentElement('afterend', this.#wrap);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.#wrap.remove();
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    #wrap = Element.add('ul', { class: 'bofqi-quality-wrap' });

    #auto = Element.add('li', { class: 'selected', data: { value: '0' }, appendTo: this.#wrap, innerText: '自动' });

    #value = 0;

    get $value() {
        return this.#value;
    }

    set $value(v) {
        this.#wrap.querySelector('.selected')?.classList.remove('selected');
        const li = this.#wrap.querySelector(`[data-value="${v}"]`);
        if (li) {
            li.classList.add('selected');
            this.dataset.label = li.textContent!.split(' ').at(-1);
        }
    }

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'bofqi-control-quality');

        this.dataset.label = '自动';

        ev.bind(PLAYER_EVENT.VIDEO_DESTORY, this.#identify);
        ev.bind(PLAYER_EVENT.LOAD_VIDEO_FILE, this.#identify);
        this.#wrap.addEventListener('click', e => {
            const li = e.target;
            if (li instanceof HTMLLIElement) {
                const qn = Number(li.dataset.value) || 0;
                ev.trigger(PLAYER_EVENT.QUALITY_CHANGE, qn);
            }
        });
        ev.bind(PLAYER_EVENT.QUALITY_CHANGE_RENDERED, ({ detail }) => {
            if (detail.mediaType === 'video') {
                if (detail.isAutoSwitch) {
                    this.$value = 0;
                } else {
                    this.$value = detail.newQualityNumber;
                }
            }
        });
        ev.bind(PLAYER_EVENT.QUALITY_SET_FOR, ({ detail }) => {
            this.$value = detail;
        });
    }

    update(qns: [number, string][]) {
        this.#wrap.replaceChildren(this.#auto);
        qns.forEach(d => {
            Element.add('li', { data: { value: <any>d[0] }, appendTo: this.#wrap, innerText: d[1] });
        });
        this.classList.toggle('disabled', !Boolean(qns.length));
    }

    #identify = () => {
        this.dataset.label = '自动';
        this.#wrap.replaceChildren(this.#auto);
        this.classList.add('disabled');
    }
}