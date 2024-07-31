import { Api } from "../../..";
import { TYPE } from "../timeline";

export async function list(season_type: TYPE) {
    const url = new URL(Api + '/pgc/web/rank/list');
    url.searchParams.set('season_type', <any>season_type);
    url.searchParams.set('day', '3');
    const response = await fetch(url, { credentials: 'include' });
    return <IList[]>(await response.json()).result.list;
}

interface IList {
    badge: string;
    badge_info: {
        bg_color: string;
        bg_color_night: string;
        text: string;
    };
    badge_type: number;
    copyright: string;
    cover: string;
    new_ep: {
        cover: string;
        index_show: string;
    };
    rank: number;
    rating: string;
    season_id: number;
    ss_horizontal_cover: string;
    stat: {
        danmaku: number;
        follow: number;
        series_follow: number;
        view: number;
    };
    title: string;
    url: string;
}