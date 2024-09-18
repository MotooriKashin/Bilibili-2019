import { Api } from "../../..";
import { RestType } from "../../../../../../code";

/**
 * 播放历史记录
 * 
 * @param sid 来自cookie
 */
export async function history(
    pn: string | number = 1,
    ps: string | number = 6,
) {
    const url = new URL(Api + '/x/v2/history');
    url.searchParams.set('ps', <any>ps);
    url.searchParams.set('pn', <any>pn);
    const response = await fetch(url, { credentials: 'include' });
    return <IHistory>await response.json();
}

interface IHistory extends RestType {
    data: {
        aid: number;
        business: string;
        cid: number;
        copyright: number;
        count: number;
        ctime: number;
        desc: string;
        /**
         * | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 33 | 其他 |
         * | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
         * | phone | pc | phone | pad | phone | pad | phone | tv | unknown |
         */
        device: number;
        duration: number;
        dynamic: string;
        favorite: boolean;
        kid: number;
        owner: {
            face: string;
            mid: number;
            name: string;
        };
        page?: {
            cid: number;
            duration: number;
            from: string;
            page: number;
            part: string;
            vid: string;
            weblink: string;
        };
        pic: string;
        progress: number;
        pubdate: number;
        redirect_link: string;
        redirect_url?: string;
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
        sub_type: number;
        tid: number;
        title: string;
        tname: string;
        type: number;
        videos: number;
        view_at: number;
    }[];
}