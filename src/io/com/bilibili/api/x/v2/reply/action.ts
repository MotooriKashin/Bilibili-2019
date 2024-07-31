import { Api } from "../../..";

export async function action(
    csrf: string,
    oid: number | string,
    rpid: number | string,
    action: 0 | 1,
    type = 1,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        oid,
        type,
        rpid,
        action,
        csrf,
    });
    const response = await fetch(Api + '/x/v2/reply/action', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <number>(await response.json()).code;
}