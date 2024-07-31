import { customElement } from "../utils/Decorator/customElement";
import { DANMAKU } from "./block";
import { Mode1 } from "./render/mode1";
import { Mode4 } from "./render/mode4";
import { Mode5 } from "./render/mode5";
import { Mode6 } from "./render/mode6";
import { Mode7 } from "./render/mode7";
import { Mode8 } from "./render/mode8";
import { rootSprite } from "./render/mode8/Display/DisplayObject";
import { Mode9 } from "./render/mode9";
import ParserWorker from './render/mode9/bas-parser';

/**
 * 弹幕组件  
 * 需要引入`/style/index.css`
 */
@customElement('div')
export class Danmaku extends HTMLDivElement {

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
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /**
     * 事件监听（只监听一次）
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    one<K extends keyof IDanmakuEvent>(type: K, listener: (evt: CustomEvent<IDanmakuEvent[K]>) => void) {
        this.addEventListener('bofqi' + type, <EventListener>listener, { once: true });
    }

    /**
     * 事件监听
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    bind = <K extends keyof IDanmakuEvent>(type: K, listener: (evt: CustomEvent<IDanmakuEvent[K]>) => void) => {
        this.addEventListener('bofqi' + type, <EventListener>listener);
    }

    /**
     * 取消事件监听
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    unbind = <K extends keyof IDanmakuEvent>(type: K, listener: (evt: CustomEvent<IDanmakuEvent[K]>) => void) => {
        this.removeEventListener('bofqi' + type, <EventListener>listener);
    }

    /**
     * 分发事件
     * 
     * @param type 事件类型
     * @param detail 分发给回调的数据
     */
    trigger = <K extends keyof IDanmakuEvent>(type: K, detail: IDanmakuEvent[K]) => {
        // Promise.resolve().then(() => {
        // 原生`dispatchEvent`方法只能同步发送消息，使用`Promise`转为异步以合乎正常事件处理流程
        this.dispatchEvent(new CustomEvent('bofqi' + type, { detail }));
        // });
    }


    /** 原始弹幕序列 */
    $dms: IDanmaku[] = [];

    /** 弹幕时间轴序列 */
    protected $timeLine: IDanmaku[] = [];

    /** 排序延时句柄 */
    #timer?: number;

    /** 弹幕渲染起始游标 */
    #i = 0;

    /** 弹幕基准存活时间 */
    $duration = 4500;

    /** 速度 */
    $speedPlus = 1;

    /** 同步视频速度 */
    $speedSync = false;

    /** 弹幕速率倍率 */
    $rate = 1;

    /** 弹幕区域宽度 */
    $width = 0;

    /** 弹幕区域高度 */
    $height = 0;

    get $heightFix() {
        return this.$preventShade ? this.$height * 0.85 : this.$height;
    }

    /** 当前弹幕数 */
    $danmakuNow = 0;

    /** 显示区域：0-100(0为无限，50为半屏，100为满屏 */
    $danmakuArea = 0;

    /** 弹幕渲染起始时间戳 */
    $playTimeStamp = 0;

    /** 弹幕渲染暂停时间戳 */
    $pauseTimeStamp = 0;

    /** 当前弹幕时间戳：/s */
    $currentTime = 0;

    /** 渲染句柄 */
    #animationTimer?: number;

    /** 弹幕可见性 */
    #visible = true;

    /** 上次渲染弹幕的时间戳 */
    $progress = 0;

    /** 提前渲染时间 */
    #preTime = 500;

    /** 同屏弹幕密度 */
    $danmakuNumber = 0;

    /** 防挡字幕 */
    $preventShade = false;

    #block = 0;

    /**
     * 弹幕屏蔽类型
     * 根据{@link DANMAKU}的二进制位判定
     */
    get $block() {
        return this.#block;
    }

    set $block(v) {
        v & DANMAKU.LIKE ? this.style.setProperty('--like', '0') : this.style.removeProperty('--like');
        v & DANMAKU.VIP ? this.style.setProperty('--colorful', '0') : this.style.removeProperty('--colorful');
        this.#block = v;
    }

    /** 弹幕屏蔽等级 */
    $weiget = 0;

    private $worker?: Worker;

    /** BAS代码解析 Worker */
    get worker() {
        if (!this.$worker) {
            this.$worker = new ParserWorker();
            this.$worker.addEventListener('message', e => {
                if (!e.data.error) {
                    this.$dms = this.$dms.concat(e.data.map((d: IDanmakuBAS) => {
                        Mode9.pretreatDanmaku(d);
                        return d;
                    }));
                    this.sort();
                }
            });
        }
        return this.$worker;
    }

    constructor(
        /** 关联的视频元素 */
        private $video: HTMLVideoElement
    ) {
        super();

        this.classList.add('b-danmaku');

        // 绑定代码弹幕容器
        rootSprite.$host = this;

        this.$video.addEventListener('play', () => {
            if (!this.$video.paused) {
                this.$playTimeStamp = performance.now();
                this.style.removeProperty('--animation-play-state');
                this.time();
                this.dispatchEvent(new Event('play'));
            }
        });
        this.$video.addEventListener('pause', () => {
            if (this.$video.paused) {
                this.$pauseTimeStamp = performance.now();
                this.style.setProperty('--animation-play-state', 'paused');
                this.pause();
                this.dispatchEvent(new Event('pause'));
            }
        });
        this.$video.addEventListener('playing', () => {
            this.$playTimeStamp = performance.now();
            this.style.removeProperty('--animation-play-state');
            this.time();
            this.dispatchEvent(new Event('play'));
        });
        this.$video.addEventListener('waiting', () => {
            this.$pauseTimeStamp = performance.now();
            this.style.setProperty('--animation-play-state', 'paused');
            this.pause();
            this.dispatchEvent(new Event('pause'));
        });
        this.$video.addEventListener('ended', () => {
            if (this.$video.ended) {
                this.$pauseTimeStamp = performance.now();
                this.style.setProperty('--animation-play-state', 'paused');
                this.pause();
                this.dispatchEvent(new Event('ended'));
            }
        });
        this.$video.addEventListener('emptied', () => {
            if (this.$video.paused) {
                this.$pauseTimeStamp = performance.now();
                this.style.setProperty('--animation-play-state', 'paused');
                this.pause();
                this.dispatchEvent(new Event('pause'));
            }
        });
        this.$video.addEventListener('ratechange', () => {
            this.$rate = this.$video.playbackRate;
        });
        this.$video.addEventListener('timeupdate', () => {
            this.$currentTime = this.$video.currentTime * 1e3;
            this.$video.paused && this.pause();
        });

        this.addEventListener('click', () => {
            this.$video.paused ? this.$video.play() : this.$video.pause();
        });

        new ResizeObserver(d => {
            for (const entry of d) {
                for (const size of entry.borderBoxSize) {
                    this.$width = size.inlineSize;
                    this.$height = size.blockSize;
                    this.style.setProperty('--wraps', <any>(size.blockSize / 440));
                }
            }
            this.modeIdentity();
        }).observe(this);
    }

    /** 弹幕排序 */
    private sort() {
        clearTimeout(this.#timer);
        this.#timer = setTimeout(() => {
            this.$dms.sort((a, b) => this.compare(a.idStr, b.idStr));
            this.$dms.sort((a, b) => this.compare(a.progress, b.progress));
            this.$timeLine = this.$dms;
            this.#i = 0;
        });
    }

    /** 排序比较算法 */
    private compare(num1: number | string | bigint = 0, num2: number | string | bigint = 0) {
        typeof num1 === 'string' && (num1 = BigInt(num1));
        typeof num2 === 'string' && (num2 = BigInt(num2));
        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        } else {
            return 0;
        }
    }

    /** 添加弹幕 */
    add(dms: IDanmaku | IDanmaku[]) {
        Array.isArray(dms) || (dms = [dms]);
        const arr: IDanmaku[] = [];
        const bas: IDanmaku[] = [];
        for (const d of dms) {
            switch (d.mode) {
                case 9: {
                    bas.push(d);
                    break;
                }
                default: {
                    arr.push(d);
                    break;
                }
            }
        }
        this.$dms = this.$dms.concat(arr);
        bas.length && this.worker.postMessage(bas);
        this.sort();
        this.trigger(DanmakuEvent.DANMAKU_ADD, dms);
    }

    /**
     * 解析xml弹幕
     * 
     * @param xml xml文本字符串或文档
     */
    fromXML(xml: string | Document) {
        if (typeof xml === 'string') {
            // B站输出的xml可能包含不标准的字符,会引起浏览器自动解析失败
            // remove-invalid-xml-characters.js
            // @link https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc
            // @license MIT
            // @see https://en.wikipedia.org/wiki/Valid_characters_in_XML
            xml = xml.replace(/((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g, '');
            xml = new DOMParser().parseFromString(xml, 'application/xml');
        }
        const items = xml.querySelectorAll('d');
        const dms: IDanmaku[] = [];
        items.forEach(d => {
            const json = d.getAttribute('p')!.split(',');
            const text = d.textContent || (<HTMLAnchorElement>d).text;
            if (text) {
                const dm: IDanmaku = {
                    pool: <0>Number(json[5]),
                    color: Number(json[3]),
                    ctime: Number(json[4]),
                    idStr: String(json[7]),
                    mode: <1>Number(json[1]),
                    fontsize: Number(json[2]),
                    progress: Number(json[0]) * 1000,
                    content: String(text),
                    midHash: json[6],
                    weight: <0>Number(json[8]),
                }
                dms.push(dm);
            }
        });
        this.add(dms);
    }

    /** 时间主循环 */
    private time = () => {
        this.pause(); // 防止多个主循环触发
        this.render();
        this.#animationTimer = requestAnimationFrame(this.time);
    }

    /** 暂停循环 */
    private pause = () => {
        this.#animationTimer && cancelAnimationFrame(this.#animationTimer);
    }

    /** 渲染函数 */
    private render() {
        if (this.#visible) {
            const time = this.$currentTime;
            if (this.$progress > time + 3000 + this.#preTime * this.$rate) {
                // 上次渲染弹幕的时间戳远大于视频时间，重置时间戳
                this.flesh();
            }
            for (; this.#i < this.$timeLine.length; this.#i++) {
                const progress = this.$timeLine[this.#i].progress || 0;
                if (progress < time - 1000) {
                    continue;
                } else if (progress < time + this.#preTime * this.$rate) {
                    // 初次渲染未必从time=0开始，导致progress=0的弹幕渲染不到，何妨反向获取1000ms
                    this.draw(this.$timeLine[this.#i], progress - time);
                    this.$progress = progress;
                } else {
                    break;
                }
            }
        }
    }

    /** 绘制弹幕 */
    private draw(dm: IDanmaku, delay = 0) {
        switch (dm.mode) {
            case 1: {
                if (this.$danmakuNumber && this.$danmakuNow > this.$danmakuNumber) break;
                if (this.$weiget && 'weight' in dm && dm.weight !== undefined && dm.weight < this.$weiget) {
                    break;
                }
                if (this.$block & DANMAKU.SCROLL) break;
                if (dm.color && dm.color !== 0xFFFFFF && (this.$block & DANMAKU.COLOR)) break;
                new Mode1(this, dm).execute(delay);
                break;
            }
            case 2: {
                new Mode1(this, dm).execute(delay);
                break;
            }
            case 3: {
                new Mode1(this, dm).execute(delay);
                break;
            }
            case 4: {
                if (this.$danmakuNumber && this.$danmakuNow > this.$danmakuNumber) break;
                if (this.$weiget && 'weight' in dm && dm.weight !== undefined && dm.weight < this.$weiget) {
                    break;
                }
                if (this.$block & DANMAKU.BOTTOM) break;
                if (dm.color && dm.color !== 0xFFFFFF && (this.$block & DANMAKU.COLOR)) break;
                new Mode4(this, dm).execute(delay);
                break;
            }
            case 5: {
                if (this.$danmakuNumber && this.$danmakuNow > this.$danmakuNumber) break;
                if (this.$weiget && 'weight' in dm && dm.weight !== undefined && dm.weight < this.$weiget) {
                    break;
                }
                if (this.$block & DANMAKU.TOP) break;
                if (dm.color && dm.color !== 0xFFFFFF && (this.$block & DANMAKU.COLOR)) break;
                new Mode5(this, dm).execute(delay);
                break;
            }
            case 6: {
                if (this.$weiget && 'weight' in dm && dm.weight !== undefined && dm.weight < this.$weiget) {
                    break;
                }
                if (this.$block & DANMAKU.SCROLL) break;
                if (dm.color && dm.color !== 0xFFFFFF && (this.$block & DANMAKU.COLOR)) break;
                new Mode6(this, dm).execute(delay);
                break;
            }
            case 7: {
                if (this.$block & DANMAKU.ADVANCE) break;
                new Mode7(this, dm).execute(delay);
                break;
            }
            case 8: {
                if (this.$block & DANMAKU.SCRIPT) break;
                new Mode8(this, dm).execute();
                break;
            }
            case 9: {
                if (this.$block & DANMAKU.BAS) break;
                new Mode9(this, <any>dm).execute(delay);
                break;
            }
        }
    }

    /** 刷新弹幕 */
    private flesh() {
        this.replaceChildren();
        this.#i = 0;
        this.$progress = 0;
        this.$danmakuNow = 0;
        this.modeIdentity();
    }

    /** 重置渲染空间 */
    private modeIdentity() {
        Mode1.identity();
        Mode4.identity();
        Mode5.identity();
        Mode6.identity();
    }

    /** 播放 */
    $play() {
        this.$video.play();
    }


    $pause() {
        this.$video.pause();
    }

    /**
     * 跳转播放
     * 
     * @param t 目标时间：/s
     */
    $seek(t: number) {
        this.$video.currentTime = t;
    }

    /** 显示弹幕 */
    on() {
        this.#visible = true;
    }

    /** 关闭弹幕 */
    off() {
        this.#visible = false;
        this.flesh();
    }

    identify = () => {
        this.$timeLine.length = 0;
        this.$dms.length = 0;
        this.$pauseTimeStamp = 0;
        this.$playTimeStamp = 0;
        this.$danmakuNow = 0;
        this.#animationTimer && cancelAnimationFrame(this.#animationTimer);
        this.style.removeProperty('--animation-play-state');
        this.$worker?.terminate();
        delete this.$worker;
        this.flesh();
    }
}

/** 弹幕基类 */
export interface IDanmaku {
    /** 互动指令 */
    action?: string;
    /** 
     * 弹幕属性位
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 保护弹幕 | 直播弹幕 | 高赞弹幕 |
     */
    attr?: number;
    /** 弹幕颜色 */
    color: number;
    /** 弹幕内容 */
    content: string;
    /** 发送时间戳 */
    ctime: number;
    /** 字体大小 */
    fontsize: number;
    /** 唯一id，已超过JavaScript整数上限，如非必要切莫转化为数字 */
    idStr: string;
    /** 弹幕发送者crc32哈希 */
    midHash: string;
    /**
     * 弹幕模式
     * | 1 | 4 | 5 | 6 | 7 | 8 | 9 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 普通 | 底部 | 顶部 | 逆向 | 高级 | 代码 | BAS |
     */
    mode: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * 弹幕池
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 普通弹幕 | 字幕弹幕 | 特殊弹幕 |
     */
    pool: 0 | 1 | 2;
    /** 弹幕位于视频中的时间点（单位毫秒） */
    progress: number;
    /** 弹幕权重，越高显示优先级越高 */
    weight?: number;
    /** 待定 */
    animation?: string;
    /** 笔触 */
    colorful?: number;

    /** 图片弹幕 */
    picture?: string;
}

export interface IDanmakuElem {

    /** 唯一id，已超过JavaScript整数上限，如非必要切莫转化为数字 */
    $idStr: string;

    /** 弹幕位于视频中的时间点（单位毫秒） */
    $progress: number;

    /** 弹幕数据 */
    $dm: IDanmaku

    /**
     * 绘制
     * 
     * @param delay 延时：/ms
     */
    execute(delay?: number): void;
}

export interface IDanmakuBAS extends IDanmaku {
    // 以下为BAS弹幕专用
    duration: number;
    def2set: Record<string, IAnimation[]>;
    defs: IDef[];
    sets: ISet[];
    setsIntervals: Record<keyof IDefAttrs, number[][]>;
}

export interface IAnimation {
    delay: number;
    duration: number;
    easing: string;
    group: number;
    name: string;
    valueStart?: IDefAttrs;
    valueEnd: IDefAttrs;
}

export interface IPercentNum {
    numType: 'number' | 'percent';
    value: number;
}

export interface IDef {
    attrs: IDefAttrs;
    name: string;
    obj_type: string;
    type: 'DefText' | 'DefButton' | 'DefPath';
    _reg_order: number;
}

export interface ISet {
    type: 'Serial' | 'Parallel' | 'Unit';
    items?: ISet[];
    attrs?: IDefAttrs;
    defaultEasing?: string;
    default_easing?: string;
    duration?: number;
    targetName?: string;
    target_name?: string;
}

/** 通用属性 */
interface ICommon {
    x?: IPercentNum | number;
    y?: IPercentNum | number;
    zIndex?: IPercentNum | number;
    scale?: IPercentNum | number;
    duration?: number;
}

/** 文本属性 */
interface IText extends ICommon {
    content?: string;
    alpha?: IPercentNum | number;
    color?: number;
    anchorX?: IPercentNum | number;
    anchorY?: IPercentNum | number;
    fontSize?: IPercentNum | number;
    fontFamily?: string;
    bold?: IPercentNum | number;
    textShadow?: IPercentNum | number;
    strokeWidth?: IPercentNum | number;
    strokeColor?: number;
    rotateX?: IPercentNum | number;
    rotateY?: IPercentNum | number;
    rotateZ?: IPercentNum | number;
    parent?: string;
}

/** 按钮属性 */
interface IButton extends ICommon {
    text?: string;
    fontSize?: IPercentNum | number;
    textColor?: number;
    textAlpha?: IPercentNum | number;
    fillColor?: number;
    fillAlpha?: IPercentNum | number;
    target?: IButtonTarget;
}

/** 按钮回调 */
interface IButtonTarget {
    objType: 'av' | 'bangumi' | 'seek';
    time?: number;
    page?: number;
    av?: number;
    bvid?: string;
    seasonId?: number;
    episodeId?: number;
}

interface IPath extends ICommon {
    d?: string;
    viewBox?: string;
    borderColor?: number;
    borderAlpha?: IPercentNum | number;
    borderWidth?: IPercentNum | number;
    fillColor?: number;
    fillAlpha?: IPercentNum | number;
}

export interface IDefAttrs extends IText, IButton, IPath {
    width?: number;
    height?: number;
}

/** 弹幕事件 */
export enum DanmakuEvent {

    /** 添加弹幕，注意参数为新增弹幕 */
    DANMAKU_ADD,

    /** 发送弹幕 */
    DANMAKU_SEND,
}


/** 弹幕事件对应的数据类型 */
export interface IDanmakuEvent {
    0: IDanmaku[];
    1: IDanmaku;
}