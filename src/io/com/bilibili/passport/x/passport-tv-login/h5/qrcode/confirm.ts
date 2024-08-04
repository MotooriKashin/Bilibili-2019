import { Passport } from "../../../..";

/**
 * 扫码登陆确认
 * 
 * @param auth_code 扫码登录秘钥
 * @param csrf cookie密钥，来自 cookie.bili_jct
 * @returns 重定向url
 */
export async function confirm(
    auth_code: string,
    csrf: string,
) {
    const response = await fetch(Passport + '/x/passport-tv-login/h5/qrcode/confirm', {
        method: 'POST',
        headers: new Headers({
            'Content-type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams(<any>{
            auth_code,
            csrf,
        }),
    });
    return <string>(await response.json()).data.gourl;
}