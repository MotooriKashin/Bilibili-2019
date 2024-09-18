import { Video } from ".";
import { customElement } from "../../../../utils/Decorator/customElement";
import { ev, PLAYER_EVENT } from "../../../event";
import { options } from "../../../option";

/** 播放器字幕节点 */
@customElement('track')
export class Track extends HTMLTrackElement {

    /**
     * 需要监听变动的属性。
     * 与实例方法`attributeChangedCallback`配合使用。
     * 此字符串序列定义了`attributeChangedCallback`回调时的第一个参数的可能值。
     */
    static observedAttributes = ['src'];

    /**
     * 在属性更改、添加、移除或替换时调用。
     * 需要与静态属性`observedAttributes`配合使用。
     * 此回调的第一个参数在`observedAttributes`数组中定义。
     */
    attributeChangedCallback(name: 'src', oldValue: string, newValue: string) {
        switch (name) {
            case 'src': {
                // 更新播放源
                if (!newValue) {
                    this.track.mode = 'disabled';
                    this.remove();
                } else {
                    this.#video.contains(this) || this.#video.appendChild(this);
                    this.track.mode = 'showing';
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #video: Video

    /** 是否初始化 */
    $hasTrack = false;

    /** 等比缩放 */
    private $scale = false;

    constructor(video: Video) {
        super();

        this.#video = video;
        new ResizeObserver((e) => {
            for (const entry of e) {
                for (const size of entry.borderBoxSize) {
                    video.style.setProperty('--cue-scale', <any>(this.$scale ? (size.inlineSize || 1) / 1139 : 1));
                }
            }
        }).observe(video);
        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            this.$styleFlush(detail);
        });

        this.$styleFlush();
    }

    private $styleFlush(ops = options) {
        const { fontSize, scale, color, shadow, opacity, fontFamily } = ops.subtile;
        this.#video.style.setProperty('--cue-font-size', `${28 * fontSize}px`);
        this.#video.style.setProperty('--cue-scale', <any>((this.$scale = scale) ? (this.#video.getBoundingClientRect().width || 1) / 1139 : 1));
        this.#video.style.setProperty('--cue-color', color);
        switch (shadow) {
            case '重墨': {
                this.#video.style.setProperty('--cue-shadow', '#000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px, #000 -1px 0px 1px');
                break;
            }
            case '描边': {
                this.#video.style.setProperty('--cue-shadow', '#000 0px 0px 1px, #000 0px 0px 1px ,#000 0px 0px 1px');
                break;
            }
            case '45°投影': {
                this.#video.style.setProperty('--cue-shadow', '#000 1px 1px 2px, #000 0px 0px 1px');
                break;
            }
            default: {
                this.#video.style.removeProperty('--cue-shadow');
                break;
            }
        }
        this.#video.style.setProperty('--cue-background', `rgba(0, 0, 0, ${opacity / 100})`);
        switch (fontFamily) {
            case '':
            case '默认':
            case 'inherit': {
                this.#video.style.removeProperty('--cue-font-family');
                break;
            }
            default: {
                this.#video.style.setProperty('--cue-font-family', fontFamily);
                break;
            }
        }
    }

    /**
     * 更新字幕轨
     * 
     * @param url 字幕链接
     * @param srclang 字幕语言，必须是合法的[BCP 47](https://people.w3.org/rishida/utils/subtags/)语言标签。
     * @param label 字幕标签，给浏览器显示用
     */
    attach(url: string, srclang: string, label: string) {
        this.src = url;
        this.srclang = srclang;
        this.label = label;
        this.$hasTrack = true;
    }

    /** 显示字幕 */
    show = () => {
        this.track.mode = 'showing';
    }

    /** 隐藏字幕 */
    hide = () => {
        this.track.mode = 'hidden';
    }

    /** 显示/隐藏 */
    toggle = () => {
        this.track.mode = this.track.mode === 'showing' ? 'disabled' : 'showing';
    }

    identify = () => {
        this.hide();
        this.removeAttribute('src');
        this.removeAttribute('srclang');
        this.removeAttribute('label');
        this.$hasTrack = false;
    }
}
