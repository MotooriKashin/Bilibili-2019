import { pgcPlayurl } from "../io/com/bilibili/api/pgc/player/web/playurl";
import { pugvPlayurl } from "../io/com/bilibili/api/pugv/player/web/playurl";
import { playurl } from "../io/com/bilibili/api/x/player/playurl";
import { IMainOptions } from "./option";
import { ROUTER } from "./router";

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
export const mainEv = new Event();

/** 播放器事件 */
export enum MAIN_EVENT {
    /** 设置变动 */
    OPTINOS_CHANGE,

    /** 更新playurl数据 */
    PLAYURL,

    /** 初始化 */
    IDENTIFY,

    /** 连接视频 */
    CONNECT,

    /** 新导航 */
    NAVIGATE,

    /** 刷新视频互动数据 */
    RELATION_FLASH,

    /** 关注 */
    GUAN_ZHU,

    /** 请求弹出投币窗口 */
    REQUSET_COIN,

    /** 请求弹出收藏窗口 */
    REQUEST_FAV,

    /** 追番 */
    ZHUI_FAN,
}

/** 播放器事件基类 */
export interface IPlayerEvent {
    0: IMainOptions;
    1: Awaited<ReturnType<typeof pgcPlayurl>>['result'] | Awaited<ReturnType<typeof playurl>>['data'] | Awaited<ReturnType<typeof pugvPlayurl>>['data'];
    2: void;
    3: void;
    4: [ROUTER, URL];
    5: void;
    6: boolean;
    7: void;
    8: void;
    9: boolean;
}