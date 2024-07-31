import { Api } from "../../../..";

export async function toviewWeb(ps?: number) {
    const url = new URL(Api + '/x/v2/history/toview/web');
    ps && url.searchParams.set('ps', <any>ps);
    const response = await fetch(url, { credentials: 'include' });
    return <IToviewWeb[]>(await response.json()).data.list;
}

export interface IToviewWeb {
    add_at: number;
    aid: number;
    cid: number;
    copyright: number;
    ctime: number;
    desc: string;
    duration: number;
    dynamic: string;
    is_pgc: number;
    owner: {
        face: string;
        mid: number;
        name: string;
    };
    pages: {
        cid: number;
        duration: number;
        from: string;
        page: number;
        part: string;
        vid: string;
        weblink: string;
    }[];
    pgc_label: string;
    pic: string;
    progress: number;
    pubdate: number;
    redirect_url?: string;
    seq: number;
    short_link_v2: string;
    stat: {
        coin: number;
        danmaku: number;
        dislike: number;
        favorite: number;
        his_rank: number;
        like: number;
        now_rank: number;
        reply: number;
        share: number;
        view: number;
    };
    state: number;
    tid: number;
    title: string;
    tname: string;
    uri: string;
    videos: number;
    view_text_1: string;
    viewed: boolean;
}