import { msToday } from "../../utils/msToday";
import { messageToIsolated } from "./messageToIsolated";

/** 拓展高级 API 组件 */
export namespace GM {

    /** 更新临时网络拦截规则 */
    export function updateSessionRules(rules: chrome.declarativeNetRequest.Rule[], tab = true) {
        return new Promise((resolve: (value: void) => void, reject) => {
            messageToIsolated({ $type: 'updateSessionRules', rules, tab }, resolve, reject);
        });
    }

    /** 移除临时网络规则集 */
    export function removeSessionRules(ids: number | number[]) {
        Array.isArray(ids) || (ids = [ids]);
        messageToIsolated({ $type: 'removeSessionRules', ids });
    }

    /** fetch 增强，支持修改请求头及返回头 */
    export async function fetch(
        input: RequestInfo | URL,
        init?: RequestInit,
        requestHeaders: chrome.declarativeNetRequest.ModifyHeaderInfo[] = [],
        responseHeaders: chrome.declarativeNetRequest.ModifyHeaderInfo[] = [],
    ) {
        const id = msToday();
        if (requestHeaders.length || responseHeaders.length) {
            await updateSessionRules([
                {
                    id,
                    action: {
                        type: <any>'modifyHeaders',
                        requestHeaders,
                        responseHeaders,
                    },
                    condition: {
                        urlFilter: input instanceof Request ? input.url : input instanceof URL ? input.toJSON() : input
                    }
                }
            ]);
        }
        const response = await self.fetch(input, init);
        removeSessionRules(id); // 请求成功返回会移除相应规则
        return response;
    }
}

