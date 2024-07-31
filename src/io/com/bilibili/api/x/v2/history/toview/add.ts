import { Api } from "../../../..";

/**
 * 添加稍后再看
 * 
 * @param csrf cookie校验：bili_jct
 * @param aid 视频aid
 * @returns 返回code，0 表示超过成功
 */
export async function add(
    csrf: string,
    aid: number | string,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        aid,
        csrf,
    });
    const response = await fetch(Api + '/x/v2/history/toview/add', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <number>(await response.json()).code;
}