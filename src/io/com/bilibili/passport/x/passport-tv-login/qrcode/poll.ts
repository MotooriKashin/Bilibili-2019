import { Passport } from "../../..";
import { RestType } from "../../../../../../code";
import { sign } from "../../../../../../sign";

/** 扫码登录结果查询 */
export async function poll(
    auth_code: string,
) {
    const response = await fetch(Passport + '/x/passport-tv-login/qrcode/poll', {
        method: 'POST',
        headers: new Headers({
            'Content-type': 'application/x-www-form-urlencoded'
        }),
        body: sign(new URLSearchParams(<any>{
            auth_code,
            local_id: 0,
            ts: (Date.now() / 1000).toFixed(0),
        }), '27eb53fc9058f8c3'),
    });
    return <IPoll>(await response.json());
}

interface IPoll extends RestType {
    /**
     * 返回值
     * | 0 | -3 | -400 | -404 | 86038 | 86039 | 86090 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 成功 | API校验密匙错误 | 请求错误 | 啥都木有 | 二维码已失效 | 二维码尚未确认 | 二维码已扫码未确认 |
     */
    code: number;
    /** 当且仅当 code===0 时登录成功 */
    data?: IPollData;
}

interface IPollData {
    /** 登录用户mid */
    mid: number;
    /** APP登录Token */
    access_token: string;
    /** APP刷新Token */
    refresh_token: string;
    /** 有效时间（单位：秒） */
    expires_in: number;
}