import { Player } from "../..";
import svg_24more from "../../../assets/svg/24more.svg";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";

/** 播放器更多设置 */
@customElement('button')
export class More extends HTMLButtonElement {

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

    #wrap = Element.add('div', { class: 'bofqi-more-wrap', innerHTML: '<div class="bofqi-wrap-triangle"></div>' });

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-info-more');
        this.innerHTML = svg_24more;

        this.#wrap.popover = 'auto';
        this.popoverTargetElement = this.#wrap;

        this.#wrap.addEventListener('click', () => this.#wrap.hidePopover());

        this.add(
            {
                text: '加载文件',
                callback: () => {
                    toastr.info('请选择要打开的视频、弹幕或字幕文件');
                    showOpenFilePicker({
                        multiple: true,
                        types: [
                            {
                                description: '所有媒体',
                                accept: {
                                    'application/bofqi': ['.mp4', '.flv', '.json', '.xml', '.vtt', '.gz'],
                                }
                            },
                            {
                                description: "MP4",
                                accept: {
                                    'video/mp4': ['.mp4', '.flv'],
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
                        .then(player.fileHandle)
                        .catch(e => {
                            toastr.error(e);
                            console.error(e);
                        });
                }
            },
            { text: '高级弹幕' },
            { text: 'HTML5播放器', disable: true },
            { text: 'Flash播放器', disable: true }
        );
    }

    /** 添加选项 */
    add(...items: Item[]) {
        const f = document.createDocumentFragment();
        items.forEach(({ text, disable, callback }) => {
            const button = document.createElement('button');
            button.textContent = text;
            disable && (button.disabled = true);
            callback && button.addEventListener('click', callback);
            f.appendChild(button);
        });
        this.#wrap.appendChild(f);
    }
}

interface Item {
    /** 按钮文字 */
    text: string;
    /** 是否禁用 */
    disable?: boolean;
    /** 点击回调 */
    callback?: () => void;
}