import { Danmaku, IDanmaku } from "../../..";
import { DanmakuEvent } from "../../../event";
import { DisplayObject, rootSprite } from "../Display/DisplayObject";
import { CommentData } from "./CommentData";
import { Sound } from "./Sound";

export class Player {

    static triggers: Function[] = [];

    #state: 'playing' | 'stop' | 'pause' = 'playing';

    /** 播放器播放状态 */
    get state() {
        return this.#state;
    }

    /** 播放头的位置（以毫秒为单位）。 */
    get time() {
        return this.Danmaku.$currentTime;
    }

    /** 当前弹幕列表 */
    get commentList() {
        // TODO: 暂时不提供弹幕给脚本
        return [];
    }

    /**
     * 弹幕刷新速度(毫秒) 默认:170  
     * 取值范围 10-500  
     * 精度上限0.1秒
     */
    refreshRate = 170;

    /** 播放器宽度 */
    get width() {
        return this.Danmaku.$width;
    }

    /** 播放器高度 */
    get height() {
        return this.Danmaku.$height;
    }

    /** 播放器中视频宽度 */
    get videoWidth() {
        return this.Danmaku.$width;
    }

    /** 播放器中视频高度 */
    get videoHeight() {
        return this.Danmaku.$height;
    }

    constructor(private Danmaku: Danmaku) {
        this.Danmaku.addEventListener('pause', () => {
            this.#state = 'pause';
        });
        this.Danmaku.addEventListener('play', () => {
            this.#state = 'playing';
        });
        this.Danmaku.addEventListener('ended', () => {
            this.#state = 'stop';
        });
        Reflect.defineProperty(rootSprite, 'video', { get: () => this });
    }

    /** 开始播放媒体文件 */
    play() {
        this.Danmaku.$play();
    }

    /**
     * 暂停视频流的回放。
     * 如果视频已经暂停，则调用此方法将不会执行任何操作。
     * 要在暂时视频后恢复播放，请调用 play()。
     */
    pause() {
        this.Danmaku.$pause();
    }

    /**
     * 搜索与指定位置最接近的关键帧（在视频行业中也称为 I 帧）。
     * 关键帧位于从流的开始处算起的偏移位置（以毫秒为单位）。  
     * 视频流通常是使用以下两种类型的帧进行编码的：关键帧（或 I 帧）和 P 帧。
     * 关键帧包含完整图像；而 P 帧是一个中间帧，它在两个关键帧之间提供额外的视频信息。
     * 通常，视频流每 10 到 50 帧中有一个关键帧。
     * 
     * @param offset 要在视频文件中移动到的时间近似值（以毫秒为单位）。
     */
    seek(offset: number) {
        this.Danmaku.$seek(offset / 1000);
    }

    /**
     * 跳至只定AV号指定页的视频
     * 
     * @param av 要跳转的视频(如AV120040)。
     * @param page 要跳转的视频页数。
     * @param newwindow 是否打开新窗口进行跳转
     */
    jump(av: string, page = 1, newwindow = false) {
        self.open(`/video/${av.toLowerCase()}?p=${page}`, newwindow ? '_blank' : '_self');
    }

    /**
     * 监听发送弹幕  
     * **注意：**此函数不会因播放器暂停而终止执行
     * 
     * @param f 发送弹幕时执行的回调函数
     * @param timeout 监听超时时间
     */
    commentTrigger(f: (cd: CommentData) => void, timeout = 1000) {
        const timer = setTimeout(() => {
            this.Danmaku.unbind(DanmakuEvent.DANMAKU_SEND, <any>callback);
        }, timeout);
        function callback(e: CustomEvent<IDanmaku>) {
            f(new CommentData(e.detail));
            clearTimeout(timer);
        }
        this.Danmaku.one(DanmakuEvent.DANMAKU_SEND, <any>callback);
        Player.triggers.push(() => { this.Danmaku.unbind(DanmakuEvent.DANMAKU_SEND, <any>callback); })

    }

    /**
     * 监听键盘输入  
     * **注意：**
     *    - 此函数不会因播放器暂停而终止执行
     *    - 此函数只能监听数字键盘 0-9 及 上下左右 Home, End, Page UP, Page Down, W, S, A, D
     * 
     * @param f 键盘按下时的回调函数
     * @param timeout 监听超时时间
     * @param up 是否为监听keyUp事件
     */
    keyTrigger(f: (key: number) => void, timeout = 1000, up = false) {
        const timer = setTimeout(() => {
            if (up) {
                this.Danmaku.removeEventListener('keyup', callback);
            } else {
                this.Danmaku.removeEventListener('keydown', callback);
            }
        }, timeout);
        function callback(e: KeyboardEvent) {
            switch (e.code) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'w':
                case 's':
                case 'a':
                case 'd':
                case 'Home':
                case 'End':
                case 'PageUp':
                case 'PageDown': {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    f(e.keyCode);
                    clearTimeout(timer);
                }

            }
        }
        if (up) {
            this.Danmaku.addEventListener('keyup', callback, { once: true });
            Player.triggers.push(() => { this.Danmaku.removeEventListener('keyup', callback) });
        } else {
            this.Danmaku.addEventListener('keydown', callback, { once: true });
            Player.triggers.push(() => { this.Danmaku.removeEventListener('keydown', callback) })
        }
    }

    /**
     * 设置播放器遮罩
     * 
     * @param obj 作为遮罩的图形对象
     * @deprecated 暂未实现
     */
    setMask(obj: DisplayObject<HTMLElement>) { }

    /**
     * 建立声音元件
     * 
     * @param t 播放声音类型
     * @param onLoad 载入完成时的回调函数
     */
    createSound(t: string, onLoad?: (ev: Event) => void) {
        return new Sound(t, onLoad);
    }
}