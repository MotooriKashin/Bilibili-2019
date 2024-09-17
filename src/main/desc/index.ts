import { activityInfo } from "../../io/com/bilibili/api/x/activity/subject/info";
import { toviewWeb } from "../../io/com/bilibili/api/x/v2/history/toview/web";
import { detail } from "../../io/com/bilibili/api/x/web-interface/view/detail";
import { toastr } from "../../toastr";
import { AV } from "../../utils/av";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { Format } from "../../utils/fomat";
import { mainEv, MAIN_EVENT } from "../event";
import { ROUTER } from "../router";
import stylesheet from "./index.css" with {type: 'css'};

/** 信息区 */
@customElement(undefined, `desc-${Date.now()}`)
export class Desc extends HTMLElement {

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

    #host = this.attachShadow({ mode: 'closed' });

    #container = Element.add('div', { class: 'container', appendTo: this.#host });

    #left = Element.add('div', { class: 'left', appendTo: this.#container });

    #right = Element.add('div', { class: 'right', appendTo: this.#container });

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => { this.$navigate(...detail) });
    }

    /** 页面路由 */
    private async $navigate(router: ROUTER, url = new URL(location.href)) {
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                if (aid) {
                    detail(aid)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            // 视频信息
                            const { View, Tags } = data;
                            View.mission_id && activityInfo(View.mission_id, aid)
                                .then(({ code, message, data }) => {
                                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                                    this.#left.insertAdjacentHTML('afterbegin', `<div class="inside-wrp">
    <div>${data.dic}</div>
    <a target="_blank" href="${data.act_url}" title="${data.name}" style="background-image: url(${data.cover}@.webp);"></a>
</div>`)
                                })
                                .catch(e => {
                                    toastr.error('获取活动信息出错', e);
                                    console.error(e);
                                });
                            this.#left.innerHTML = `<div class="s_tag">${Tags.map(d => `<a href="${d.jump_url || `https://search.bilibili.com/all?keyword=${d.tag_name}`}" target="_blank">${d.tag_name}</a>`).join('')}</div>
<div class="v-desc">
    <div></div>
    <div>${Format.superLink(View.desc)}</div>
</div>`;
                        })
                        .catch(e => {
                            toastr.error('获取视频信息失败', e);
                            console.error(e);
                        });
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                if (aid) {
                    this.$navigate(ROUTER.AV, new URL(`https://www.bilibili.com/video/av${aid}`));
                } else {
                    toviewWeb()
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            aid || (aid = data.list[0].aid);
                            this.$navigate(ROUTER.AV, new URL(`https://www.bilibili.com/video/av${aid}`));
                        })
                        .catch(e => {
                            toastr.error('请求稍后再看信息错误~', e);
                            console.error(e);
                        });
                }
                break;
            }
        }
    }
}