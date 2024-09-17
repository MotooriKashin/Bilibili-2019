import { Api } from "../..";
import { RestType } from "../../../../../code";

export async function timeline(types: TYPE) {
    const url = new URL(Api + '/pgc/web/timeline');
    url.searchParams.set('types', <any>types);
    const response = await fetch(url, { credentials: 'include' });
    return <ITimeline>await response.json();
}

export enum TYPE {
    BANGUMI = 1,
    MOVIE = 2,
    DOCUMENTARY = 3,
    GUOCHUANG = 4,
    TV = 5,
}

interface ITimeline extends RestType {
    result: {
        date: string;
        date_ts: number;
        day_of_week: number;
        episodes: IEpisodes[];
        is_today: number;
    }[]
}

export interface IEpisodes {
    cover: string;
    delay: number;
    delay_id: number;
    delay_index: string;
    delay_reason: string;
    ep_cover: string;
    episode_id: number;
    follows: string;
    plays: string;
    pub_index: string;
    pub_time: string;
    pub_ts: number;
    published: number;
    season_id: number;
    square_cover: string;
    title: string;
}