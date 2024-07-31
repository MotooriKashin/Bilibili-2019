import { Api } from "../../../..";

/** 获取番剧推荐 */
export async function recommend(season_id: number) {
    if (CATCH[season_id]) return CATCH[season_id];
    const url = new URL(Api + '/pgc/season/web/related/recommend');
    url.searchParams.set('season_id', <any>season_id);
    const response = await fetch(url, { credentials: 'include' });
    return CATCH[season_id] = <IRecommend[]>(await response.json()).data.season;
}

/** 同一请求缓存 */
const CATCH: Record<number, IRecommend[]> = {};

interface IRecommend {
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
}