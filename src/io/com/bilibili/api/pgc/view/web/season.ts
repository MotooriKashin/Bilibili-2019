import { Api } from "../../..";
import { EP_STATUS } from "../../../../../../stat";

export async function season(params: ISeasonIn) {
    const param = params.ep_id ? `ep_id=${params.ep_id}` : `season_id=${params.season_id}`;
    if (CATCH[param]) return CATCH[param];
    const response = await fetch(Api + `/pgc/view/web/season?${param}`, { credentials: 'include' });
    return CATCH[param] = <ISeason>(await response.json()).result;
}

/** 同一请求缓存 */
const CATCH: Record<string, ISeason> = {};

interface ISeasonIn {
    ep_id?: number;
    season_id?: number;
}

interface ISeason {
    activity?: {
        cover: string;
        head_bg_url: string;
        id: number;
        link: string;
        pendants: {
            image: string;
            name: string;
            pid: number;
        }[];
    };
    actors: string;
    alias: string;
    areas: { id: number; name: string }[];
    bkg_cover?: string;
    cover: string;
    delivery_fragment_video: boolean;
    enable_vt: boolean;
    episodes: IEpisodes[];
    evaluate: string;
    freya: { bubble_desc: string; bubble_show_cnt: number; icon_show: number };
    hide_ep_vv_vt_dm: number;
    jp_title: string;
    link: string;
    media_id: number;
    mode: number;
    new_ep: { desc: string; id: number; is_new: number; title: string };
    positive: { id: number; title: string };
    publish: {
        is_finish: number;
        is_started: number;
        pub_time: string;
        pub_time_show: string;
        unknow_pub_date: number;
        weekday: number;
    };
    rating: { count: number; score: number };
    record: string;
    season_id: number;
    season_title: string;
    seasons: ISeasons[];
    section?: {
        attr: number;
        episode_id: number;
        episode_ids: number[];
        episodes: IEpisodes[];
        id: number;
        title: string;
        type: number;
        type2: number;
    }[];
    series: { display_type: number; series_id: number; series_title: string };
    share_copy: string;
    share_sub_title: string;
    share_url: string;
    show_season_type: number;
    square_cover: string;
    staff: string;
    stat: {
        coins: number;
        danmakus: number;
        favorite: number;
        favorites: number;
        follow_text: number;
        likes: number;
        reply: number;
        share: number;
        views: number;
        vt: number;
    };
    status: number;
    styles: string[];
    subtitle: string;
    title: string;
    total: number;
    type: number;
    user_status?: {
        area_limit: number;
        ban_area_show: number;
        follow: number;
        follow_status: number;
        login: number;
        pay: number;
        pay_pack_paid: number;
        progress?: { last_ep_id: number; last_ep_index: string; last_time: number };
        sponsor: number;
        vip_info: {
            due_date: number;
            status: number;
            type: number;
        }
    }
}

interface IEpisodes {
    aid: number;
    badge: string;
    badge_info: { bg_color: string; bg_color_night: string; text: string };
    badge_type: number;
    cid: number;
    cover: string;
    duration: number;
    enable_vt: boolean;
    ep_id: number;
    from: string;
    id: number;
    is_view_hide: boolean;
    link: string;
    long_title: string;
    pub_time: number;
    pv: number;
    release_date: string;
    share_copy: string;
    share_url: string;
    short_link: string;
    showDrmLoginDialog: boolean;
    skip: { ed: { end: number; start: number }; op: { end: number; start: number } };
    status: EP_STATUS;
    subtitle: string;
    title: string;
    vid: string;
}

interface ISeasons {
    badge: string;
    badge_info: { bg_color: string; bg_color_night: string; text: string };
    badge_type: number;
    cover: string;
    enable_vt: boolean;
    media_id: number;
    new_ep: {
        cover: string;
        id: number;
        index_show: string;
    };
    season_id: number;
    season_title: string;
    season_type: number;
    stat: {
        favorites: number;
        series_follow: number;
        views: number;
        vt: number;
    };
}