import { Api } from "../../..";
import { RestType } from "../../../../../../code";

export async function coinAdd(
    csrf: string,
    aid: number | string,
    multiply: 1 | 2,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        aid,
        multiply,
        csrf,
    });
    const response = await fetch(Api + '/x/web-interface/coin/add', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <RestType>(await response.json());
}