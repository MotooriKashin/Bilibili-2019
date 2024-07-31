import { Api } from "../..";

/**
 * 获取分P数据  
 * 可获取受限视频数据
 * 
 * @param aid 
 */
export async function pagelist(aid: number) {
    if (CATCH[aid]) return CATCH[aid];
    const url = new URL(Api + '/x/player/pagelist');
    url.searchParams.set('aid', <any>aid);
    const response = await fetch(url, { credentials: 'include' });
    return CATCH[aid] = <IPagelist[]>(await response.json()).data;
}

/** 同一请求缓存 */
const CATCH: Record<number, IPagelist[]> = {};

interface IPagelist {
    cid: number;
    duration: number;
    from: string;
    page: number;
    part: string;
    vid: string;
    weblink: string;
}