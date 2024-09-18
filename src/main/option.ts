import { ProxyHook } from "../utils/hook/Proxy";
import { MAIN_EVENT, mainEv } from "./event";
import { POLICY } from "./policy";

/** 默认设置 */
export const MAIN_OPTIONS: IMainOptions = {
    policy: POLICY.AVC,
    incognito: false,
}

try {
    // 初始化本地设置
    const local = localStorage.getItem('BILI_2019_OPTIONS');
    if (local) {
        const obj = JSON.parse(local);
        for (const key of Object.keys(MAIN_OPTIONS)) {
            Object.hasOwn(obj, key) && Reflect.set(MAIN_OPTIONS, key, Reflect.get(obj, key));
        }
    }
} catch { }

let timer: ReturnType<typeof setTimeout>;
/**
 * 播放器设置  
 * 本对象经过多层代理，如果要短时间内多次访问，为提高性能。
 * 请缓存到局部变量或属性中，并通过监听`PlayerEvent.options_change`事件更新缓存
 */
export const mainOptions = ProxyHook.onChange(MAIN_OPTIONS, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        localStorage.setItem('BILI_2019_OPTIONS', JSON.stringify(MAIN_OPTIONS));
        mainEv.trigger(MAIN_EVENT.OPTINOS_CHANGE, MAIN_OPTIONS);
    });
});

/** 设置项 */
export interface IMainOptions {
    /** 播放策略 */
    policy: POLICY,
    /** 无痕模式 */
    incognito: boolean,
};