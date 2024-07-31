// B站用户空间专属脚本

import { FetchHook } from "../../../utils/hook/fetch";
import json from "./mid.json";

enum SPACE {
    '哔哩哔哩番剧出差' = 11783021,
    'b站_戲劇咖' = 1988098633,
    'b站_綜藝咖' = 2042149112,
}

switch (true) {
    case location.pathname.includes('11783021'): {
        json.data.mid = 11783021;
        json.data.name = SPACE[11783021];
        json.data.official.desc = SPACE[11783021] + ' 官方帐号';
        break;
    }
    case location.pathname.includes('1988098633'): {
        json.data.mid = 1988098633;
        json.data.name = SPACE[1988098633];
        json.data.official.desc = SPACE[1988098633] + ' 官方帐号';
        break;
    }
    case location.pathname.includes('2042149112'): {
        json.data.mid = 2042149112;
        json.data.name = SPACE[2042149112];
        json.data.official.desc = SPACE[2042149112] + ' 官方帐号';
        break;
    }
}



new FetchHook('acc/info?').response(async res => {
    const text = await res.text();
    if (text.includes('-404')) {
        return JSON.stringify(json);
    }
});