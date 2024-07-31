import { IDanmaku } from "../danmaku";
import { IQualityChangeRendered, IQualityChangeRequested, IVideoInfoEvent } from "../dash-player";
import flvjs from "../flv.js";
import { IOptions } from "./option";
// import { DanmakuSend } from "./area/sendbar/danmaku";

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
     * 重置播放器  
     * 所有有状态的组件都应监听此事件，并在回调中将自身重置为初始状态 
     */
    IDENTIFY,

    /**
     * 变更播放器模式  
     * 使用二进制位判定 {@link PLAYER_MODE}
     */
    PLAYER_MODE,

    /** 全屏模式变动 */
    FULLSCREEN_CHANGE,

    /** 画中画模式切换 */
    PICTURE_IN_PICTURE,

    /** 加载本地文件 */
    LOCAL_FILE_LOAD,

    /** 播放出错 */
    MEDIA_ERROR,

    /** DASH视频信息心跳 */
    VIDEO_INFO_DASH,

    /** flv视频信息心跳 */
    VIDEO_INFO_FLV,

    /** 原生播放器心跳 */
    VIDEO_INFO_NATIVE,

    /** 【Dash】更新画质·响应 */
    QUALITY_CHANGE_REQUESTED,

    /** 【Dash】更新画质·成功 */
    QUALITY_CHANGE_RENDERED,

    /** 
     * 请求更新指针位置缩略图
     * [缩略图元素, 指针位置秒数]
     */
    PROGRESS_VIDEOSHOT,

    /** 单独重置弹幕相关组件 */
    DANMAKU_IDENTIFY,

    /** 添加弹幕，注意参数为新增弹幕 */
    DANMAKU_ADD,

    /** 设置变动 */
    OPTINOS_CHANGE,

    /** 播放列表切换 */
    AUXILIARY_FILTER,

    /** 播放器初始化完成 */
    INITED,

    /** 弹幕发送 */
    DANMAKU_SEND,

    /** 弹幕选择 */
    DANMAKU_CONTEXT,

    /** 发布通知 */
    TOAST,

    /** 点击画质切换 */
    QUALITY_CHANGE,

    /** 播放本地视频 */
    LOCAL_MEDIA_LOAD,

    /** 获取下一P */
    CALL_NEXT_PAGE,
}

/** 播放器事件基类 */
interface IPlayerEvent {
    0: void;
    1: number;
    2: boolean;
    3: void;
    4: File[];
    5: void;
    6: IVideoInfoEvent;
    7: [flvjs.FlvPlayerMediaInfo, flvjs.FlvPlayerStatisticsInfo];
    8: [flvjs.NativePlayerMediaInfo, flvjs.NativePlayerStatisticsInfo];
    9: IQualityChangeRequested;
    10: IQualityChangeRendered;
    11: [HTMLDivElement, number];
    12: void;
    13: IDanmaku[];
    14: IOptions;
    15: 0 | 1 | 2;
    16: void;
    // 17: DanmakuSend;
    18: IDanmaku;
    19: string;
    20: number;
    21: void;
    22: any;
}