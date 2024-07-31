import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";
import { ev, PLAYER_EVENT } from "../../../event-target";

/** 更多设置面板 */
@customElement('div')
export class MoreWrap extends HTMLDivElement {

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

    /** 位置指示器 */
    $triangle = Element.add('div', { class: 'bofqi-auxiliary-setting-more-triangle' }, this);

    /** 加载文件 */
    $loadFiles = Element.add('button', { class: 'bofqi-auxiliary-setting-more-list' }, this, '加载文件');

    /** 高级弹幕 */
    $danmaku7 = Element.add('button', { class: 'bofqi-auxiliary-setting-more-list' }, this, '高级弹幕');

    /** HTML5播放器 */
    $html5 = Element.add('button', { class: 'bofqi-auxiliary-setting-more-list' }, this, 'HTML5播放器');

    /** Flash播放器 */
    $flash = Element.add('button', { class: 'bofqi-auxiliary-setting-more-list' }, this, 'Flash播放器');

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-setting-more');
        this.popover = 'auto';

        this.$html5.disabled = true;
        this.$flash.disabled = true;

        this.$loadFiles.addEventListener('click', () => {
            showOpenFilePicker({
                multiple: true,
                types: [
                    {
                        description: '所有媒体',
                        accept: {
                            'application/bofqi': ['.mp4', '.json', '.xml', '.vtt', '.gz'],
                        }
                    },
                    {
                        description: "MP4",
                        accept: {
                            'video/mp4': ['.mp4'],
                        }
                    },
                    {
                        description: "弹幕",
                        accept: {
                            'application/danmaku+json': ['.json'],
                            'application/danmaku+xml': ['.xml'],
                            'application/danmkau+gzip': ['.gz'],
                        }
                    },
                    {
                        description: "字幕",
                        accept: {
                            'text/vtt': ['.vtt'],
                            'application/vtt+gzip': ['.gz'],
                        }
                    }
                ],
            })
                .then(d => Promise.all(d.map(d => d.getFile())))
                .then(d => {
                    ev.trigger(PLAYER_EVENT.LOCAL_FILE_LOAD, d);
                });
        });
    }
}