import { TOTP } from "../../utils/TTOP";

const _MUTEX_ = TOTP();
/**
 * 发送数据到到拓展
 * @param data 要发送的数据，必须是JSON-serializable的
 * @param resolve 数据返回的回调
 * @param reject 出错时的回调
 */
export function messageToIsolated(data: any, resolve?: Function, reject: Function = () => { }) {
    const mutex = Math.random().toString(36).substring(2);
    if (resolve && typeof resolve === "function") {
        self.addEventListener(mutex, (ev) => {
            if (ev instanceof CustomEvent) {
                ev.detail.reject ? reject(ev.detail.data) : resolve(ev.detail.data);
                ev.stopImmediatePropagation();
            }
        }, { once: true });
    }
    self.dispatchEvent(new CustomEvent(_MUTEX_, { detail: { mutex, data } }));
}