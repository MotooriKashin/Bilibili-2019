import { Api } from "../../..";

export async function total(
    aid: number,
    cid: number,
) {
    const url = new URL(Api + '/x/player/online/total');
    url.searchParams.set('aid', <any>aid);
    url.searchParams.set('cid', <any>cid);
    url.searchParams.set('ts', <any>Math.ceil(Date.now() / 30 / 1000));
    const response = await fetch(url, {
        credentials: 'include'
    });
    return <IOnlineTotal>(await response.json()).data;
}

interface IOnlineTotal {
    total: string;
    count: string;
    show_switch: {
        total: boolean;
        count: boolean;
    }
}