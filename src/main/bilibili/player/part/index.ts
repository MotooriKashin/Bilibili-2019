import { pagelist } from "../../../../io/com/bilibili/api/x/player/pagelist";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";

/** 播放器右侧面板 */
@customElement('div')
export class Part extends HTMLDivElement {

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

    private $spread = Element.add('button', { class: 'spread' }, undefined, '展开');

    constructor() {
        super();
        this.classList.add('bili-part');

        this.$spread.addEventListener('click', () => {
            this.$spread.textContent = this.classList.toggle('spread') ? '收起' : '展开';
        });
    }

    update(
        data: Awaited<ReturnType<typeof pagelist>>,
        aid: number,
        cid: number,
    ) {
        if (data.length > 1) {
            let p = '';
            data.forEach(d => {
                p += `<a href="/video/av${aid}/?p=${d.page}"${d.cid === cid ? ' class="on"' : ''} title="${d.part}">${d.page}、${d.part}</a>`;
            });
            this.innerHTML = p;
            this.scrollHeight > 25 && this.appendChild(this.$spread);
        }
    }

    updateToview(
        data: Awaited<ReturnType<typeof pagelist>>,
        aid: number,
        cid: number,
    ) {
        if (data.length > 1) {
            let p = '';
            data.forEach(d => {
                p += `<a href="/watchlater/#/av${aid}/p${d.page}"${d.cid === cid ? ' class="on"' : ''} title="${d.part}">${d.page}、${d.part}</a>`;
            });
            this.innerHTML = p;
            this.scrollHeight > 25 && this.appendChild(this.$spread);
        }
    }

    updateMedialist(
        data: Awaited<ReturnType<typeof pagelist>>,
        aid: number,
        cid: number,
    ) {
        if (data.length > 1) {
            let p = '';
            const url = new URL(location.href);
            data.forEach(d => {
                url.searchParams.set('aid', <any>aid);
                url.searchParams.set('p', <any>d.page);
                p += `<a href="${url.href}"${d.cid === cid ? ' class="on"' : ''} title="${d.part}">${d.page}、${d.part}</a>`;
            });
            this.innerHTML = p;
            this.scrollHeight > 25 && this.appendChild(this.$spread);
        }
    }

    identify = () => {
        this.replaceChildren();
    }
}