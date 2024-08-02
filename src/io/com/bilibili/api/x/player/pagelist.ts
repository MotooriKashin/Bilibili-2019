import { Api } from "../..";

/**
 * 获取分P数据  
 * 可获取受限视频数据
 * 
 * @param aid 
 */
export async function pagelist(aid: number) {
    const url = new URL(Api + '/x/player/pagelist');
    url.searchParams.set('aid', <any>aid);
    CATCH[aid] || (CATCH[aid] = fetch(url, { credentials: 'include' }));
    return <IPagelist[]>(await (await CATCH[aid]).clone().json()).data;
}

/** 同一请求缓存 */
const CATCH: Record<number, Promise<Response>> = {};

interface IPagelist {
    cid: number;
    duration: number;
    from: string;
    page: number;
    part: string;
    vid: string;
    weblink: string;
}