import { Danmaku } from "../danmaku";
import { DanmakuEvent } from "../danmaku/event";
import { toastr } from "../toastr";
import { CSSStyleSheet2HTMLStyleElement } from "../utils/CSSStyleSheet2HTMLStyleElement";
import { customElement } from "../utils/Decorator/customElement";
import { Format } from "../utils/fomat";
import { Area } from "./area";
import { Video } from "./area/wrap/video";
import { Auxiliary } from "./auxiliary";
import { ev, PLAYER_EVENT } from "./event";
import { FlvAgent } from "./flv";
import stylesheet from "./index.css" with {type: 'css'};
import { options } from "./option";

/** 播放器核心 */
@customElement(undefined, `bofqi-${Date.now()}`)
export class Player extends HTMLElement {

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

    /** 视频元素 */
    $video = new Video(this);

    /** 弹幕组件 */
    $danmaku = new Danmaku(this.$video);

    $area = this.#host.appendChild(new Area(this));

    $auxiliary = this.#host.appendChild(new Auxiliary(this));

    /** 是否处于全屏模式 */
    get $isFullScreen() {
        return this.matches(':fullscreen');
    }

    constructor() {
        super();

        // this.#host.adoptedStyleSheets = [stylesheet]; // 文档画中画模式会导致构造的样式表丢失，暂时取道 style 元素代替
        this.#host.appendChild(CSSStyleSheet2HTMLStyleElement(stylesheet));

        ev.bind(PLAYER_EVENT.DANMAKU_IDENTIFY, this.$danmaku.$indentify);
        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { visible, opacity, preventShade, block, weight, speedPlus, danmakuNumber, fontSize, fullScreenSync, fontBorder, fontFamily, bold, speedSync, mode7Scale } = detail.danmaku;

            visible ? this.$danmaku.$on() : this.$danmaku.$off();
            this.$danmaku.style.setProperty('--opacity', <any>opacity);
            this.$danmaku.$preventShade = preventShade;
            this.$danmaku.$block = block;
            this.$danmaku.$weiget = weight;
            this.$danmaku.$speedPlus = speedPlus;
            this.$danmaku.$danmakuNumber = danmakuNumber;
            this.$danmaku.$mode7Scale = mode7Scale;
            this.$danmaku.style.setProperty('--fontSize', <any>fontSize);
            fullScreenSync ? this.$danmaku.style.setProperty('--full-screen-sync', '1') : this.$danmaku.style.removeProperty('--full-screen-sync');
            this.$danmaku.style.setProperty('--fontBorder', <any>fontBorder);
            this.$danmaku.style.setProperty('--font-family', fontFamily);
            bold ? this.$danmaku.style.removeProperty('--font-weight') : this.$danmaku.style.setProperty('--font-weight', 'normal');
            this.$danmaku.$speedSync = speedSync;
        });

        this.$danmaku.bind(DanmakuEvent.DANMAKU_ADD, ({ detail }) => {
            ev.trigger(PLAYER_EVENT.DANMAKU_ADD, detail);
        });

        ev.trigger(PLAYER_EVENT.INITED, void 0);
        ev.trigger(PLAYER_EVENT.OPTINOS_CHANGE, options);
    }

    /** 本地文件处理 */
    fileHandle = (files: File[]) => {
        /** 互斥标记，一些类型的文件只加载首项 */
        const mutex: string[] = [];
        for (const file of files) {
            switch (true) {
                case file.name.endsWith('.mp4'):
                case file.name.endsWith('.flv'): {
                    if (!mutex.includes('video')) {
                        ev.trigger(PLAYER_EVENT.VIDEO_DESTORY, void 0);
                        const url = URL.createObjectURL(file);
                        new FlvAgent(this.$video, { type: 'mp4', url });
                        mutex.push('video');
                        toastr.success('加载视频文件', file.name, `大小：${Format.fileSize(file.size)}`);
                    }
                    break;
                }
                case file.name.endsWith('.vtt'): {
                    ev.trigger(PLAYER_EVENT.VTT_FILE_LOAD, file);
                    break;
                }
                case file.name.endsWith('.xml'): {
                    ev.trigger(PLAYER_EVENT.DANMAKU_IDENTIFY, void 0);
                    file.text().then(d => {
                        this.$danmaku.$fromXML(d);
                        toastr.success('加载弹幕文件', file.name, `大小：${Format.fileSize(file.size)}`);
                    }).catch(e => {
                        toastr.error('加载弹幕出错', e);
                        console.error(e);
                    });
                    break;
                }
                case file.name.endsWith('.dm.json'): {
                    ev.trigger(PLAYER_EVENT.DANMAKU_IDENTIFY, void 0);
                    file.text().then(d => {
                        this.$danmaku.$add(JSON.parse(d));
                        toastr.success('加载弹幕文件', file.name, `大小：${Format.fileSize(file.size)}`);
                    }).catch(e => {
                        toastr.error('加载弹幕出错', e);
                        console.error(e);
                    });
                    break;
                }
                case file.name.endsWith('.gz'): {
                    toastr.info(`压缩文件：${file.name}（${file.type}），尝试解压中~`);
                    const date = file.stream().pipeThrough(new DecompressionStream('gzip'));
                    new Response(date).blob().then(d => {
                        this.fileHandle([
                            new File([d], file.name.replace(/\.gz$/, ''), {
                                type: file.type,
                                lastModified: file.lastModified
                            })]);
                    }).catch(e => {
                        toastr.error('解压文件出错', e);
                        console.error(e);
                    });
                    break;
                }
                default: {
                    toastr.warn(`不支持的文件类型：${file.name}（${file.type}）`);
                }
            }
        }
    }

    /** 初始化所有组件 */
    identify() {
        ev.trigger(PLAYER_EVENT.VIDEO_DESTORY, void 0);
        ev.trigger(PLAYER_EVENT.DANMAKU_IDENTIFY, void 0);
        ev.trigger(PLAYER_EVENT.OTHER_IDENTITY, void 0);
    }
}