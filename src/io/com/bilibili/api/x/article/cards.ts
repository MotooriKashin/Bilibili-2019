import { Api } from "../..";
import { RestType } from "../../../../../code";

export async function cards(param: ICardsIn | string[]) {
    const arr: string[] = [];
    if (Array.isArray(param)) {
        arr.push(...param);
    } else {
        Object.entries(param).forEach(d => {
            if (d[1]) {
                (Array.isArray(d[1]) ? d[1] : [d[1]]).forEach(t => arr.push(d[0] + t));
            }
        });
    }
    if (!arr.length) throw new Error('输入参数不能为空！');
    const ids = arr.join(',');
    const url = new URL(Api + '/x/article/cards');
    url.searchParams.set('ids', ids);
    CATCH[ids] || (CATCH[ids] = fetch(url));
    return <ICardsOut>await (await CATCH[ids]).clone().json();
}

/** 同一请求缓存 */
const CATCH: Record<string, Promise<Response>> = {};

interface ICardsIn {
    av?: number | number[],
    ss?: number | number[],
    ep?: number | number[]
};

export interface ICardsOut extends RestType {
    data: Record<string, {
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
        pub_location: string;
        pubdate: number;
        redirect_url?: string;
        stat: {
            aid: number;
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
    }>
}