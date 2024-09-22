// 后台脚本

import { updateSessionRules } from "./SessionRules";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab && typeof message === "object") {
        switch (message.$type) {
            case "updateSessionRules": { // 更新会话规则 data不存在表示移除对应标签页的规则
                updateSessionRules(sender.tab.id!, message.data, message.tab)
                    .then(data => sendResponse({ data }))
                    .catch(err => sendResponse({ err: err.toString() }));
                break;
            }
            case 'removeSessionRules': {
                chrome.declarativeNetRequest.updateSessionRules({
                    removeRuleIds: message.data
                })
                break;
            }
        }
    }
});