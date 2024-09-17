import { ProxyHook } from "../utils/hook/Proxy";
import { ev, PLAYER_EVENT } from "./event";

/** 默认设置 */
export const OPTIONS: IOptions = {
    subtile: {
        fontSize: 1,
        scale: true,
        shadow: '无描边',
        color: '',
        fontFamily: '',
        opacity: 100,
    },
    danmaku: {
        opacity: 1,
        fontFamily: 'SimHei, Microsoft JhengHei',
        bold: true,
        fontBorder: 0,
        speedPlus: 1,
        speedSync: false,
        fontSize: 1,
        fullScreenSync: false,
        danmakuArea: 0,
        danmakuNumber: 0,
        visible: true,
        preventShade: false,
        preTime: 500,
        weight: 0,
        blockList: false,
        block: 0,
        mode7Scale: false,
    }
}

try {
    // 初始化本地设置
    const local = localStorage.getItem('BOFQI_OPTIONS');
    if (local) {
        const obj = JSON.parse(local);
        for (const key of Object.keys(OPTIONS)) {
            Object.hasOwn(obj, key) && Reflect.set(OPTIONS, key, Reflect.get(obj, key));
        }
    }
} catch { }

let timer: ReturnType<typeof setTimeout>;
/**
 * 播放器设置  
 * 本对象经过多层代理，如果要短时间内多次访问，为提高性能。
 * 请缓存到局部变量或属性中，并通过监听`PlayerEvent.options_change`事件更新缓存
 */
export const options = ProxyHook.onChange(OPTIONS, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        localStorage.setItem('BOFQI_OPTIONS', JSON.stringify(OPTIONS));
        ev.trigger(PLAYER_EVENT.OPTINOS_CHANGE, OPTIONS);
    });
});

/** 设置项 */
export interface IOptions {
    /** 字幕 */
    subtile: {
        /** 字体大小 */
        fontSize: 0.6 | 0.8 | 1 | 1.3 | 1.6;
        /** 等比缩放 */
        scale: boolean;
        /** 描边 */
        shadow: string;
        /** 字体颜色 */
        color: string;
        /** 字体 */
        fontFamily: string;
        /** 自定义字体 */
        fontFamilyCustom?: [string, string];
        /** 背景透明度 */
        opacity: number;
    }
    /** 弹幕 */
    danmaku: {
        /** 弹幕透明度 */
        opacity: number;
        /** 字体 */
        fontFamily: string;
        /** 加粗 */
        bold: boolean;
        /** 描边 */
        fontBorder: number;
        /** 速度 */
        speedPlus: number;
        /** 同步视频速度 */
        speedSync: boolean;
        /** 字号缩放 */
        fontSize: number;
        /** 等比缩放 */
        fullScreenSync: boolean;
        /** 显示区域：0-100(0为无限，50为半屏，100为满屏 */
        danmakuArea: number;
        /** 同屏弹幕密度 */
        danmakuNumber: number;
        /** 可见性 */
        visible: boolean;
        /** 防挡字幕 */
        preventShade: boolean;
        /** 提前渲染时间 */
        preTime: number;
        /** 弹幕屏蔽等级 */
        weight: number;
        /** 弹幕屏蔽词 */
        blockList: boolean;
        /** 自定义字体 */
        fontFamilyCustom?: [string, string];
        /**
         * 弹幕屏蔽类型
         * 根据{@link DANMAKU}的二进制位判定
         */
        block: number;
        /**
         * mode7 自适应缩放
         */
        mode7Scale: boolean;
    }
};
