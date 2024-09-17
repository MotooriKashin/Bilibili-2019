import { Api } from "../../..";
import { RestType } from "../../../../../../code";

export async function locs(...ids: number[]) {
    const url = new URL(Api + '/x/web-show/res/locs');
    url.searchParams.set('pf', '0');
    url.searchParams.set('ids', ids.join(','));
    const response = await fetch(url, { credentials: 'include' });
    return <ILocs>await response.json();
}

/**
 * 4694 banner
 * 34 推广
 */
interface ILocs extends RestType {
    data: Record<number, {
        /** 广告判定，过滤真值 */
        ad_cb: string;
        archive?: {
            aid: number;
            cid: number;
            ctime: number;
            duration: number;
            owner: {
                face: string;
                mid: number;
                name: string;
            };
            pic: string;
            pubdate: number;
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
            videos: number;
        }
        name: string;
        null_frame: boolean;
        pic: string;
        sub_title: string;
        url: string;
    }[]>;
}