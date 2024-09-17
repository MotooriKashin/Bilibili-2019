import { Api } from "../../..";
import { RestType } from "../../../../../../code";

export async function dynamicRegion(
    rid: REGION
) {
    const url = new URL(Api + '/x/web-interface/dynamic/region');
    url.searchParams.set('rid', <any>rid);
    url.searchParams.set('ps', <any>'15');
    const response = await fetch(url, { credentials: 'include' });
    return <IRegion>await response.json();
}

export enum REGION {
    /** 动画 */
    DOUGA = 1,
    /** 音乐 */
    MUSCI = 3,
    /** 游戏 */
    GAME = 4,
    /** 娱乐 */
    ENT = 5,
    /** 电视剧 */
    TV = 11,
    /** 番剧 */
    BANGUMI = 13,
    /** 电影 */
    MOVIE = 23,
    /** 知识 */
    KNOWLEDGE = 36,
    /** 鬼畜 */
    KICHIKU = 119,
    /** 舞蹈 */
    DANCE = 129,
    /** 时尚 */
    FASHION = 155,
    /** 生活 */
    LIFE = 160,
    /** 国产原创相关 */
    GUOCHUANG = 168,
    /** 纪录片 */
    DOCUMENTARY = 177,
    /** 影视 */
    CINEPHILE = 181,
    /** 科技 */
    TECHNOLOGY = 188,
    /** 资讯 */
    NEWS = 202,
}

export interface IRegion extends RestType {
    data: {
        archives: {
            aid: number;
            cid: number;
            ctime: number;
            desc: string;
            duration: number;
            dynamic: string;
            is_ogv: boolean;
            owner: {
                face: string;
                mid: number;
                name: string;
            };
            pic: string;
            pub_location: string;
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
        }[];
    }
}
