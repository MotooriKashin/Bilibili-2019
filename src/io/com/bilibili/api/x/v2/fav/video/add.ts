import { Api } from "../../../..";
import { RestType } from "../../../../../../../code";

export async function favAdd(
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
    const response = await fetch(Api + '/x/v2/fav/video/add', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <RestType>await response.json();
}