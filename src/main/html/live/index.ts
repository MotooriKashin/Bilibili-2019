import { toastr } from "../../../toastr";

// 阻止直播间挂机检测！
const SetInterval: (handler: TimerHandler, timeout?: number) => number = setInterval;
const SetTimeout: (handler: TimerHandler, timeout?: number) => number = setTimeout;
let sleep = false;

self.setInterval = <any>((...args: [any, any]) => {
    // 定时器经过二次包装，toString方法不便来源，延时5分钟一律过滤
    // if (args[0].toString().includes('triggerSleepCallback')) {
    if (args[1] === 300000) {
        if (!sleep) {
            sleep = true;
            toastr.success('成功阻止直播间挂机检测！');
        }
        return Number.MIN_VALUE;
    }
    return SetInterval.call(self, ...args);
})
self.setTimeout = <any>((...args: [any, any]) => {
    // if (args[0].toString().includes('triggerSleepCallback')) {
    if (args[1] === 300000) {
        if (!sleep) {
            sleep = true;
            toastr.success('成功阻止直播间挂机检测！');
        }
        return Number.MIN_VALUE;
    }
    return SetTimeout.call(self, ...args);
})