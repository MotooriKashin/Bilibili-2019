import FlvJs from "flv.js";
import { IDanmaku } from "../danmaku";
import { IOptions } from "./option";
import { IQualityChangeRendered, IQualityChangeRequested, IVideoInfoEvent } from "../dash-player";
import { IDanmakuInput } from "./area/sendbar";

class Event extends EventTarget {

    /**
     * 事件监听（只监听一次）
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    one<K extends keyof IPlayerEvent>(type: K, listener: (evt: CustomEvent<IPlayerEvent[K]>) => void) {
        this.addEventListener('bofqi' + type, <EventListener>listener, { once: true });
    }

    /**
     * 事件监听
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    bind = <K extends keyof IPlayerEvent>(type: K, listener: (evt: CustomEvent<IPlayerEvent[K]>) => void) => {
        this.addEventListener('bofqi' + type, <EventListener>listener);
    }

    /**
     * 取消事件监听
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    unbind = <K extends keyof IPlayerEvent>(type: K, listener: (evt: CustomEvent<IPlayerEvent[K]>) => void) => {
        this.removeEventListener('bofqi' + type, <EventListener>listener);
    }

    /**
     * 分发事件
     * 
     * @param type 事件类型
     * @param detail 分发给回调的数据
     */
    trigger = <K extends keyof IPlayerEvent>(type: K, detail: IPlayerEvent[K]) => {
        // Promise.resolve().then(() => {
        // 原生`dispatchEvent`方法只能同步发送消息，使用`Promise`转为异步以合乎正常事件处理流程
        this.dispatchEvent(new CustomEvent('bofqi' + type, { detail }));
        // });
    }
}

/** 播放器事件组件 */
export const ev = new Event();

/** 播放器事件 */
export enum PLAYER_EVENT {
    /**
     * 销毁当前视频  
     * 所有与视频本身直接相关的才使用此事件初始化
     */
    VIDEO_DESTORY,

    /**
     * 初始化弹幕相关组件  
     */
    DANMAKU_IDENTIFY,

    /** 设置变动 */
    OPTINOS_CHANGE,

    /** 播放列表切换 */
    AUXILIARY_FILTER,

    /** 播放器初始化完成 */
    INITED,

    /** 添加弹幕 */
    DANMAKU_ADD,

    /** 弹幕选择 */
    DANMAKU_CONTEXT,

    /**
     * 视频弹幕之外的组件初始化
     */
    OTHER_IDENTITY,

    /** DASH视频信息心跳 */
    VIDEO_INFO_DASH,

    /** flv视频信息心跳 */
    VIDEO_INFO_FLV,

    /** 原生播放器心跳 */
    VIDEO_INFO_NATIVE,

    /** 播放视频错误 */
    MEDIA_ERROR,

    /** 加载字幕 */
    VTT_FILE_LOAD,

    /** 【Dash】更新画质·响应 */
    QUALITY_CHANGE_REQUESTED,

    /** 【Dash】更新画质·成功 */
    QUALITY_CHANGE_RENDERED,

    /** 在线人数 */
    ONLINE_NUMBER,

    /** 切换画质 */
    QUALITY_CHANGE,

    /** 设定画质 */
    QUALITY_SET_FOR,

    /** 加载本地文件 */
    LOAD_VIDEO_FILE,

    /** 指针焦点进度条 */
    PROGRESS_HOVER,

    /** 发送弹幕 */
    DANMAKU_INPUT,

    /** 点击下一P */
    CALL_NEXT_REGISTER,
}

/** 播放器事件基类 */
export interface IPlayerEvent {
    0: void;
    1: void;
    2: IOptions;
    3: 0 | 1 | 2;
    4: void;
    5: IDanmaku[];
    6: IDanmaku;
    7: void;
    8: IVideoInfoEvent;
    9: [FlvJs.FlvPlayerMediaInfo, FlvJs.FlvPlayerStatisticsInfo];
    10: [FlvJs.NativePlayerMediaInfo, FlvJs.NativePlayerStatisticsInfo];
    11: void;
    12: File;
    13: IQualityChangeRequested;
    14: IQualityChangeRendered;
    15: { total: string, count: string; };
    16: number;
    17: number;
    18: void;
    19: number;
    20: IDanmakuInput;
    21?: () => void;
}