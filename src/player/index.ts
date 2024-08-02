import { Danmaku, DanmakuEvent } from "../danmaku/index.js";
import DashPlayer, { IDashPlayerOption, IMPDJsonData, IQualityChangeRendered, IQualityChangeRequested, IVideoInfoEvent } from "../dash-player/index.js";
import flvjs from "../flv.js";
import { customElement } from "../utils/Decorator/customElement";
import { Area } from "./area";
import { video } from "./area/wrap/video/index.js";
import { Auxiliary } from "./auxiliary";
import { ev, PLAYER_EVENT } from "./event-target";
import { options } from "./option.js";
import { PLAYER_MODE, PLAYER_STATE } from "./state.js";

/** 播放器核心 */
@customElement('figure')
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
    connectedCallback() {
        self.addEventListener('keydown', this.onKeyDown);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        self.removeEventListener('keydown', this.onKeyDown);
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 播放器左侧面板 */
    $area = this.appendChild(new Area());

    /** 播放器右侧面板 */
    $auxiliary = this.appendChild(new Auxiliary());

    /** flv.js实例 */
    flvPlayer?: flvjs.Player;

    /** dashjs实例 */
    dashPlayer?: DashPlayer;

    /** 弹幕组件 */
    danmaku = new Danmaku(video);

    constructor() {
        super();

        this.insertAdjacentHTML('beforeend', `<style>${__BOFQI_STYLE__}</style>`);
        this.classList.add('video-state-pause');
        this.$area.$wrap.appendChild(this.danmaku);

        ev.bind(PLAYER_EVENT.PLAYER_MODE, ({ detail }) => {
            this.style.setProperty('--mode-wide', detail & PLAYER_MODE.WIDE ? '1' : '0');
            this.style.setProperty('--mode-fullscreen', detail & PLAYER_MODE.FULL ? '1' : '0');
            this.classList.toggle('mode-fullscreen-web', Boolean(detail & PLAYER_MODE.WEB));
            detail & PLAYER_MODE.FULL ? this.requestFullscreen() : (document.fullscreenElement === this && document.exitFullscreen());
        });
        ev.bind(PLAYER_EVENT.PICTURE_IN_PICTURE, () => {
            if (documentPictureInPicture.window) { } else {
                const parrent = this.parentElement!;
                const prev = this.nextElementSibling;
                documentPictureInPicture.requestWindow({
                    width: this.clientWidth,
                    height: this.clientHeight
                }).then(d => {
                    d.window.document.body.append(this);
                    // [...document.styleSheets].forEach((styleSheet) => {
                    //     try {
                    //         const cssRules = [...styleSheet.cssRules]
                    //             .map((rule) => rule.cssText)
                    //             .join("");
                    //         const style = document.createElement("style");

                    //         style.textContent = cssRules;
                    //         d.window.document.head.appendChild(style);
                    //     } catch (e) {
                    //         const link = document.createElement("link");

                    //         link.rel = "stylesheet";
                    //         link.type = styleSheet.type;
                    //         link.media = <string><unknown>styleSheet.media;
                    //         link.href = <string>styleSheet.href;
                    //         d.window.document.head.appendChild(link);
                    //     }
                    // });
                    d.addEventListener('pagehide', () => {
                        // parrent.appendChild(this);
                        parrent.insertBefore(this, prev);
                        documentPictureInPicture.window?.close();
                    }, { once: true });
                });
            }
        });
        ev.bind(PLAYER_EVENT.LOCAL_FILE_LOAD, ({ detail }) => {
            this.fileLoad(detail)
        });
        ev.bind(PLAYER_EVENT.DANMAKU_IDENTIFY, this.danmaku.identify);
        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { visible, opacity, preventShade, block, weight, speedPlus, danmakuNumber, fontSize, fullScreenSync, fontBorder, fontFamily, bold, speedSync } = detail.danmaku;

            visible ? this.danmaku.on() : this.danmaku.off();
            this.danmaku.style.setProperty('--opacity', <any>opacity);
            this.danmaku.$preventShade = preventShade;
            this.danmaku.$block = block;
            this.danmaku.$weiget = weight;
            this.danmaku.$speedPlus = speedPlus;
            this.danmaku.$danmakuNumber = danmakuNumber;
            this.danmaku.style.setProperty('--fontSize', <any>fontSize);
            fullScreenSync ? this.danmaku.style.setProperty('--full-screen-sync', '1') : this.danmaku.style.removeProperty('--full-screen-sync');
            this.danmaku.style.setProperty('--fontBorder', <any>fontBorder);
            this.danmaku.style.setProperty('--font-family', fontFamily);
            bold ? this.danmaku.style.removeProperty('--font-weight') : this.danmaku.style.setProperty('--font-weight', 'normal');
            this.danmaku.$speedSync = speedSync;
        });
        ev.one(PLAYER_EVENT.INITED, () => {
            ev.trigger(PLAYER_EVENT.OPTINOS_CHANGE, options);
        });

        this.danmaku.bind(DanmakuEvent.DANMAKU_ADD, ({ detail }) => {
            ev.trigger(PLAYER_EVENT.DANMAKU_ADD, detail);
        });

        video.addEventListener('play', () => {
            this.classList.toggle('video-state-pause', video.paused);
            this.classList.remove('video-state-buff');
        });
        video.addEventListener('pause', () => {
            this.classList.toggle('video-state-pause', video.paused);
        });
        video.addEventListener('playing', () => {
            this.classList.remove('video-state-buff');
        });
        video.addEventListener('waiting', () => {
            this.classList.add('video-state-buff');
        });
        video.addEventListener('ended', () => {
            this.classList.toggle('video-state-pause', video.ended);
        });
        video.addEventListener('emptied', () => {
            this.classList.toggle('video-state-pause', video.paused);
        });

        document.addEventListener('fullscreenchange', () => {
            if ((document.fullscreenElement === this) !== Boolean(PLAYER_STATE.mode & PLAYER_MODE.FULL)) {
                PLAYER_STATE.mode ^= PLAYER_MODE.FULL;
                this.style.setProperty('--mode-fullscreen', PLAYER_STATE.mode & PLAYER_MODE.FULL ? '1' : '0');
            }
            ev.trigger(PLAYER_EVENT.FULLSCREEN_CHANGE, document.fullscreenElement === this);
        });

        self.addEventListener('beforeunload', () => {
            try {
                this.identify();
            } catch { }
        });


        ev.trigger(PLAYER_EVENT.INITED, void 0);
    }

    /**
     * 跳帧播放
     * 
     * @param t 目标时间：/s
     */
    seek = (t: number) => {
        video.seek(t);
    }

    /** 播放 */
    play = () => {
        video.play();
    }

    /** 暂停 */
    pause = () => {
        video.pause();
    }

    /** 加载本地文件 */
    private fileLoad(files: File[]) {
        /** 互斥标记，一些类型的文件只加载首项 */
        const mutex: string[] = [];
        for (const file of files) {
            switch (true) {
                case file.name.endsWith('.mp4'): {
                    if (!mutex.includes('video')) {
                        const url = URL.createObjectURL(file);
                        this.flvjs({ type: 'mp4', url });
                        mutex.push('video');
                        ev.trigger(PLAYER_EVENT.LOCAL_MEDIA_LOAD, void 0);
                    }
                    break;
                }
                case file.name.endsWith('.vtt'): {
                    this.$area.$control.$closedCaption.load(file);
                    break;
                }
                case file.name.endsWith('.xml'): {
                    ev.trigger(PLAYER_EVENT.DANMAKU_IDENTIFY, void 0);
                    file.text().then(d => {
                        this.danmaku.fromXML(d);
                    })
                    break;
                }
                case file.name.endsWith('.dm.json'): {
                    ev.trigger(PLAYER_EVENT.DANMAKU_IDENTIFY, void 0);
                    file.text().then(d => {
                        this.danmaku.add(JSON.parse(d));
                    })
                    break;
                }
                case file.name.endsWith('.gz'): {
                    const date = file.stream().pipeThrough(new DecompressionStream('gzip'));
                    return new Response(date).blob().then(d => {
                        this.fileLoad([
                            new File([d], file.name.replace(/\.gz$/, ''), {
                                type: file.type,
                                lastModified: file.lastModified
                            })]);
                    })
                }
                default: {
                    ev.trigger(PLAYER_EVENT.TOAST, `不支持的文件类型：${file.name}（${file.type}）`);
                }
            }
        }
    }

    /**
     * 加载flv资源
     * 
     * @param mediaDataSource flv信息
     * @param config 播放器配置
     * @param seekTime 播放时间戳：/s 
     */
    flvjs(
        mediaDataSource: flvjs.MediaDataSource,
        config: flvjs.Config = {
            enableWorker: false,
            stashInitialSize: 1024 * 64,
            accurateSeek: true,
            seekType: 'range',
            rangeLoadZeroStart: false,
            lazyLoadMaxDuration: 100,
            lazyLoadRecoverDuration: 50,
            deferLoadAfterSourceOpen: false,
            fixAudioTimestampGap: false,
            reuseRedirectedURL: true,
        },
        seekTime = 0,
    ) {
        this.playerDistroy();
        this.contains(video) || (this.$area.$wrap.insertBefore(video, this.danmaku));
        flvjs.LoggingControl.forceGlobalTag = true;
        flvjs.LoggingControl.enableVerbose = false;
        this.flvPlayer = flvjs.createPlayer(mediaDataSource, config);
        this.flvPlayer.attachMediaElement(video);
        this.flvPlayer.load();
        seekTime && this.seek(seekTime);
        this.bindFlvPlayer();
        return this.flvPlayer;
    }

    /** 监听flvPlayer事件 */
    protected bindFlvPlayer() {
        this.flvPlayer?.on(flvjs.Events.STATISTICS_INFO, () => {
            if (this.flvPlayer?.type === 'FlvPlayer') {
                ev.trigger(PLAYER_EVENT.VIDEO_INFO_FLV, [
                    (<flvjs.FlvPlayer>this.flvPlayer).mediaInfo,
                    (<flvjs.FlvPlayer>this.flvPlayer).statisticsInfo]
                );
            } else if (this.flvPlayer?.type === 'NativePlayer') {
                ev.trigger(PLAYER_EVENT.VIDEO_INFO_NATIVE, [
                    (<flvjs.NativePlayer>this.flvPlayer).mediaInfo,
                    (<flvjs.NativePlayer>this.flvPlayer).statisticsInfo]
                );
            }
        });
        this.flvPlayer?.on(flvjs.Events.ERROR, () => {
            ev.trigger(PLAYER_EVENT.MEDIA_ERROR, void 0);
        });
    }

    /**
     * 加载dash资源
     * 
     * @param mpd dash mpd
     * @param options 播放器设置
     * @param videoQuality 当前清晰度
     * @param highAudioQuality Hires或者杜比全景声清晰度
     * @param seekTime 播放时间戳：/s 
     */
    dashjs(
        mpd: IMPDJsonData,
        options: IDashPlayerOption = {
            defaultAudioQuality: 30280,
            defaultVideoQuality: 80,
            enableHEVC: false,
            enableAV1: false,
            isAutoPlay: false,
            isDynamic: false,
            enableMultiAudioTracks: false,
            abrStrategy: DashPlayer.STRING.ABR_BOLA,
            stableBufferTime: 20,
        },
        videoQuality = 0,
        seekTime = 0,
    ) {
        this.playerDistroy();
        this.contains(video) || (this.$area.$wrap.insertBefore(video, this.danmaku));
        this.dashPlayer = new DashPlayer(video, options);
        this.dashPlayer.initialize(mpd)
            .then(() => {
                if (videoQuality === 0) {
                    this.dashPlayer?.setAutoSwitchQualityFor('audio', false);
                    this.dashPlayer?.setAutoSwitchQualityFor('video', true);
                }
                seekTime && this.seek(seekTime);
            });
        this.bindDashPlayer();
        return this.dashPlayer;
    }

    /** 监听DashPlayer事件 */
    protected bindDashPlayer() {
        this.dashPlayer?.on(DashPlayer.EVENTS.QUALITY_CHANGE_REQUESTED, (e: IQualityChangeRequested) => {
            ev.trigger(PLAYER_EVENT.QUALITY_CHANGE_REQUESTED, e);
        });
        this.dashPlayer?.on(DashPlayer.EVENTS.QUALITY_CHANGE_RENDERED, (e: IQualityChangeRendered) => {
            ev.trigger(PLAYER_EVENT.QUALITY_CHANGE_RENDERED, e);
        });
        this.dashPlayer?.on(DashPlayer.EVENTS.VIDEO_INFO, (e: IVideoInfoEvent) => {
            ev.trigger(PLAYER_EVENT.VIDEO_INFO_DASH, e);
        });
        this.dashPlayer?.on(DashPlayer.EVENTS.ERROR, () => {
            ev.trigger(PLAYER_EVENT.MEDIA_ERROR, void 0);
        });

    }

    protected onKeyDown = ({ key, code, shiftKey, ctrlKey, altKey, metaKey, isComposing }: KeyboardEvent) => {
        try {
            const { activeElement } = document;
            if (
                activeElement?.hasAttribute('contenteditable')
                || activeElement instanceof HTMLInputElement
                || activeElement instanceof HTMLTextAreaElement
            ) { } else {
                switch (key) {
                    // 不能区分小键盘，但能识别 Shift 后的值
                    case 'F': case 'f': {
                        // 全屏
                        shiftKey || ctrlKey || altKey || metaKey || ev.trigger(PLAYER_EVENT.PLAYER_MODE, PLAYER_STATE.mode ^= PLAYER_MODE.FULL);
                        break;
                    }
                    case 'd': case 'D': {
                        // 弹幕开关
                        shiftKey || ctrlKey || altKey || metaKey || (options.danmaku.visible = !options.danmaku.visible);
                        break;
                    }
                    case 'm': case 'M': {
                        // 音量开关
                        shiftKey || ctrlKey || altKey || metaKey || (video.muted = !video.muted);
                        break;
                    }
                    case ' ': {
                        // 播放/暂停
                        shiftKey || ctrlKey || altKey || metaKey || (PLAYER_STATE.mode & PLAYER_MODE.FULL && video.toggle());
                        break;
                    }
                    case 'ArrowRight': {
                        // 快进 5 秒
                        shiftKey || ctrlKey || altKey || metaKey || (video.currentTime += 5);
                        break;
                    }
                    case 'ArrowLeft': {
                        // 快退 5 秒
                        shiftKey || ctrlKey || altKey || metaKey || (video.currentTime -= 5);
                        break;
                    }
                }
                // switch (code) {
                //     // 能区分小键盘，但不识别 Shift 后的值
                // }
            }
        } catch { }
    }

    /** 销毁当前播放器 */
    protected playerDistroy() {
        this.flvPlayer?.destroy();
        this.dashPlayer?.destroy();
        delete this.flvPlayer;
        delete this.dashPlayer;
    }

    /** 初始化播放器 */
    identify() {
        video.pause();
        this.classList.add('video-state-pause');
        this.danmaku.identify();
        this.playerDistroy();
        ev.trigger(PLAYER_EVENT.IDENTIFY, void 0);
    }
}

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BOFQI_STYLE__: string;
}