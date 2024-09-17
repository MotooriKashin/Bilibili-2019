import { Api } from "../../..";
import { RestType } from "../../../../../../code";

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
    return <RestType>(await response.json());
}