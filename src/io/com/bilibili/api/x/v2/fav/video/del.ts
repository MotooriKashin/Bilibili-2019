import { Api } from "../../../..";

export async function favDel(
    csrf: string,
    aid: number | string,
    ...fid: number[]
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        aid,
        fid: fid.join(','),
        csrf,
    });
    const response = await fetch(Api + '/x/v2/fav/video/del', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <number>(await response.json()).code;
}