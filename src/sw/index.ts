// 后台脚本

import { IGMPostMessage } from "../utils/interface/GM";
import { swFetchHeader } from "./GM/escape-header";
import { updateSessionRules } from "./GM/session-rule";

// 消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab && typeof message === "object") {
        switch (<keyof IGMPostMessage>message.type) {
            /** 跨域版`fetch` */
            case "fetch": {
                const [rule, id] = swFetchHeader(message.message.input, message.message.init?.headers, message.message.responseHeaders);
                if (Array.isArray(message.message.init?.body)) {
                    // 数组还原为二进制数据
                    message.message.init.body = new Uint8Array(message.message.init.body);
                }
                chrome.declarativeNetRequest.updateSessionRules({ addRules: [rule] })
                    .then(() => fetch(message.message.input, message.message.init))
                    .then(async d => {
                        return {
                            status: d.status,
                            statusText: d.statusText,
                            header: [...d.headers],
                            url: d.url,
                            redirected: d.redirected,
                            type: d.type,
                            data: Array.from(new Uint8Array(await d.arrayBuffer())) // JSON-serializable
                        };
                    })
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }))
                    .finally(() => chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [id] }));
                return true;
            }
            /** 更新网络拦截规则 */
            case "updateSessionRules": {
                updateSessionRules(sender.tab.id!, message.message.rules, message.message.tab)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                return true;
            }
            /** 移除网络规则集 */
            case "removeSessionRules": {
                chrome.declarativeNetRequest.updateSessionRules({
                    removeRuleIds: message.message.ids
                })
                break;
            }
        }
    }
});