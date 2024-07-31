import { Passport } from "../..";

/**
 * 退出登录
 * 
 * @param biliCSRF 校验码，来自`cookie.bili_jct`
 * @param gourl 退出后最终重定向url
 * @returns 退出后重定向url
 */
export async function exit(
    biliCSRF: string,
    gourl = location.href,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        biliCSRF,
        gourl
    });
    const response = await fetch(Passport + '/login/exit/v2', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <string>(await response.json()).data.redirectUrl;
}