import { Api } from "../../..";

export async function like(
    csrf: string,
    aid: number | string,
    like: 1 | 2,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        aid,
        like,
        csrf,
    });
    const response = await fetch(Api + '/x/web-interface/archive/like', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <IDefaultResponse>(await response.json());
}

export interface IDefaultResponse {
    /** 当且仅当`===0`表示操作成功 */
    code: number;
    message: string;
    ttl: number;
}