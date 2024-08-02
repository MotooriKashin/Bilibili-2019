import { Api } from "../../../../..";

export async function pgcSection(season_id: number) {
    const url = new URL(Api + '/pgc/web/season/section');
    url.searchParams.set('season_id', <any>season_id);
    CATCH[season_id] || (CATCH[season_id] = fetch(url, { credentials: 'include' }));
    return <IPgcSection>(await (await CATCH[season_id]).clone().json()).result;
}

const CATCH: Record<number, Promise<Response>> = {};

interface IPgcSection {
    main_section: {
        episodes: IEpisode[];
        id: number;
        title: string;
        type: number;
    }
    section: {
        episodes: IEpisode[];
        id: number;
        title: string;
        type: number;
    }[];
}

/** 基本分P数据 */
export interface IEpisode {
    aid: number;
    badge: string;
    badge_info: {
        bg_color: string;
        bg_color_night: string;
        text: string;
    };
    badge_type: number;
    cid: number;
    cover: string;
    from: string;
    id: number;
    is_premiere?: number;
    long_title: string;
    share_url: string;
    status: number;
    title: string;
    vid: string;
};