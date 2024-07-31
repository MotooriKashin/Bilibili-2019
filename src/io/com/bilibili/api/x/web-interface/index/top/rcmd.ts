import { Api } from "../../../..";

export async function rcmd() {
    const url = new URL(Api + '/x/web-interface/index/top/rcmd');
    url.searchParams.set('fresh_type', '3');
    const response = await fetch(url, { credentials: 'include' });
    return <IRcmd[]>(await response.json()).data.item;
}

interface IRcmd {
    cid: number;
    duration: number;
    id: number;
    is_followed: boolean;
    owner: {
        face: string;
        mid: number;
        name: string;
    };
    pic: string;
    pubdate: number;
    stat: {
        danmaku: number;
        like: number;
        view: number;
    };
    title: string;
    uri: string;
}