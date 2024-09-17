import { Api } from "../../../..";
import { RestType } from "../../../../../../../code";

/** 获取番剧推荐 */
export async function recommend(season_id: number) {
    const url = new URL(Api + '/pgc/season/web/related/recommend');
    url.searchParams.set('season_id', <any>season_id);
    CATCH[season_id] || (CATCH[season_id] = fetch(url, { credentials: 'include' }));
    return <IRecommend>await (await CATCH[season_id]).clone().json();
}

/** 同一请求缓存 */
const CATCH: Record<number, Promise<Response>> = {};

interface IRecommend extends RestType {
    data: {
        season: {
            actor: string;
            badge: string;
            badge_info: { bg_color: string; bg_color_night: string; text: string };
            badge_type: number;
            cover: string;
            new_ep: {
                cover: string;
                index_show: string;
            };
            rating: { count: number; score: number };
            season_id: number;
            season_type: number;
            stat: { danmaku: number; follow: number; view: number; vt: number; vtForUnity: number };
            styles: {
                id: number;
                name: string;
            }[];
            subtitle: string;
            title: string;
            url: string;
            user_status: { follow: number };
        }[];
    }
}