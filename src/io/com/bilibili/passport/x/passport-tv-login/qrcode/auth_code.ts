import { Passport } from "../../..";
import { sign } from "../../../../../../sign";

/** TV端扫码登录 */
export async function auth_code() {
    const response = await fetch(Passport + '/x/passport-tv-login/qrcode/auth_code', {
        method: 'POST',
        headers: new Headers({
            'Content-type': 'application/x-www-form-urlencoded'
        }),
        body: sign(new URLSearchParams(<any>{
            local_id: 0,
            ts: (Date.now() / 1000).toFixed(0),
        }), '27eb53fc9058f8c3'),
    });
    return <IAuthCode>(await response.json()).data;
}

interface IAuthCode {
    /** 二维码内容 url */
    url: string;
    /** 扫码登录秘钥 */
    auth_code: string;
}