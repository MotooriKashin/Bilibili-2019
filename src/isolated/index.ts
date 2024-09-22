// 内容脚本

import { TOTP } from "../utils/TTOP";

/** 会话网络规则集id */
const SessionRules = new Set<number>();

self.addEventListener(TOTP(), ev => {
    if (ev instanceof CustomEvent) {
        switch (ev.detail.data.$type) {
            case 'updateSessionRules': {
                chrome.runtime.sendMessage({
                    $type: "updateSessionRules",
                    data: ev.detail.data.rules,
                    tab: ev.detail.data.tab ?? true
                })
                    .then(data => self.dispatchEvent(new CustomEvent(ev.detail.mutex, { detail: { data } })))
                    .catch(e => {
                        self.dispatchEvent(new CustomEvent(ev.detail.mutex, { detail: { data: e, reject: true } }))
                    });
                // 记录规则ID
                (<chrome.declarativeNetRequest.Rule[]>ev.detail.data.rules).forEach(d => {
                    SessionRules.add(d.id);
                })
                break;
            }
            case 'removeSessionRules': {
                chrome.runtime.sendMessage({
                    $type: "removeSessionRules",
                    data: ev.detail.data.ids
                });
                // 移除规则id
                (<number[]>ev.detail.data.ids).forEach(d => {
                    SessionRules.delete(d)
                })
                break;
            }
        }
    }
});

self.addEventListener("beforeunload", () => {
    const arr = Array.from(SessionRules);
    // DOM更新时清空已应用规则
    chrome.runtime.sendMessage({
        $type: "removeSessionRules",
        data: arr
    });
});