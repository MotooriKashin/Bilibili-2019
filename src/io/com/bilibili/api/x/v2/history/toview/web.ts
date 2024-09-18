import { Api } from "../../../..";
import { RestType } from "../../../../../../../code";

export async function toviewWeb(ps?: number) {
    const url = new URL(Api + '/x/v2/history/toview/web');
    ps && url.searchParams.set('ps', <any>ps);
    CATCH[ps || -1] || (CATCH[ps || -1] = fetch(url, { credentials: 'include' }));
    return <IToviewWeb>await (await CATCH[ps || -1]).clone().json();
}

/** 同一请求缓存 */
const CATCH: Record<number, Promise<Response>> = {};

export interface IToviewWeb extends RestType {
    data: {
        list: {
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
        }[]
    }
}