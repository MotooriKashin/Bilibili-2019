import { Api } from "../../..";
import { RestType } from "../../../../../../code";

/** 点赞投币收藏等状态 */
export async function relation(aid: number) {
    const url = new URL(Api + '/x/web-interface/archive/relation');
    url.searchParams.set('aid', <any>aid);
    CATCH[aid] || (CATCH[aid] = fetch(url, { credentials: 'include' }));
    return <IRelation>await (await CATCH[aid]).clone().json();
}

/** 同一请求缓存 */
const CATCH: Record<number, Promise<Response>> = {};


interface IRelation extends RestType {
    data: {
        /** 关注 */
        attention: boolean;
        /** 投币数 */
        coin: number;
        /** 点踩 */
        dislike: boolean;
        /** 收藏 */
        favorite: boolean;
        /** 点赞 */
        like: boolean;
        /** 系列收藏 */
        season_fav: boolean;
    }
}