import { Api } from "../../..";
import { RestType } from "../../../../../../code";

/**
 * 相关视频推荐
 * 
 * @param aid 本视频aid
 */
export async function related(aid: number) {
    const url = new URL(Api + '/x/web-interface/archive/related');
    url.searchParams.set('aid', <any>aid);
    CATCH[aid] || (CATCH[aid] = fetch(url, { credentials: 'include' }));
    return <IRelated>await (await CATCH[aid]).clone().json();
}

/** 同一请求缓存 */
const CATCH: Record<number, Promise<Response>> = {};

export interface IRelated extends RestType {
    data: {
        aid: number;
        cid: number;
        ctime: number;
        desc: string;
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
            vt: number;
            vv: number;
        };
        state: number;
        tid: number;
        title: string;
        tname: string;
        videos: number;
    }[]
}