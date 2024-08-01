import { Api } from ".";
import { sign } from "../../../sign";

export async function search(
    keyword: string,
    page = 1,
    search_type = 'all',
    source_type = 0,
    pagesize = 20,
    build = 404000,
) {
    const url = new URL(Api + '/search');
    url.searchParams.set('type', 'json');
    url.searchParams.set('build', <any>build);
    url.searchParams.set('main_ver', 'v4');
    url.searchParams.set('page', <any>page);
    url.searchParams.set('pagesize', <any>pagesize);
    url.searchParams.set('platform', 'android');
    url.searchParams.set('search_type', <any>search_type);
    url.searchParams.set('source_type', <any>source_type);
    url.searchParams.set('bangumi_num', '1');
    url.searchParams.set('special_num', '1');
    url.searchParams.set('topic_num', '1');
    url.searchParams.set('upuser_num', '1');
    url.searchParams.set('tv_num', '1');
    url.searchParams.set('movie_num', '1');
    const response = await fetch(sign(url, 'c1b107428d337928'), { credentials: 'include' });
    return <ISearch>(await response.json());
}

interface ISearch {
    app_display_option: {
        is_ogv_and_av_unified: number;
        rank_to_filter_opti: number;
        refresh_opti: number;
        search_page_visual_opti: number;
    };
    cache: number;
    code: number;
    cost_time: {
        as_request: string;
        as_request_format: string;
        as_response_format: string;
        deserialize_response: string;
        fetch_lexicon: string;
        illegal_handler: string;
        is_risk_query: string;
        main_handler: string;
        params_check: string;
        total: string;
    };
    crr_query: string;
    egg_hit: number;
    egg_info: unknown;
    exp_bits: number;
    exp_list: Record<number, boolean>;
    exp_str: string;
    is_hit_rec: number;
    msg: string;
    numPages: number;
    numResults: number;
    offline_cache: {
        query: string;
        timestamp: number;
    };
    page: number;
    pageinfo: Record<IType, { numResults: number; pages: number; total: number; }>;
    pagesize: number;
    qv_id: string;
    result: {
        media_bangumi: {
            all_net_icon: string;
            all_net_name: string;
            all_net_url: string;
            angle_color: number;
            angle_title: string;
            areas: string;
            corner: number;
            cover: string;
            cv: string;
            desc: string;
            display_info: {
                bg_color: string;
                bg_color_night: string;
                bg_style: number;
                border_color: string;
                border_color_night: string;
                text: string;
                text_color: string;
                text_color_night: string;
            }[];
            fix_pubtime_str: string;
            goto_url: string;
            hit_columns: string[];
            hit_epids: string;
            is_avid: boolean;
            is_ogv_inline: number;
            media_id: number;
            media_mode: number;
            media_score: { score: number; user_count: number; };
            media_type: number;
            org_title: string;
            play_state: number;
            pubtime: number;
            rank_index: number;
            rank_offset: number;
            rank_score: number;
            season_id: number;
            staff: string;
            styles: string;
            title: string;
            type: string;
        };
        video: {
            aid: number;
            arcrank: string;
            arcurl: string;
            author: string;
            badgepay: boolean;
            description: string;
            duration: string;
            favorites: number;
            fulltext: [];
            hang_style_sinal: number;
            hang_total_nums: number;
            hit_columns: Record<number, string>;
            id: number;
            is_charge_video: number;
            is_pay: number;
            is_ugc_inline: number;
            is_union_video: number;
            like: number;
            mid: number;
            new_rec_tags: [];
            pic: string;
            play: number;
            pubdate: number;
            rank_index: number;
            rank_offset: number;
            rank_score: number;
            rec_tags: unknown;
            review: number;
            senddate: number;
            spread_id: number;
            tag: string;
            timeline_style: { enable: boolean };
            title: string;
            type: string;
            typeid: string;
            typename: String;
            video_review: number;
            view_type: string;
        };
    };
    rqt_type: String;
    seid: string;
    show_column: number;
    show_module_list: string[];
    suggest_keyword: string;
    top_tlist: Record<IType, number>;
}

type IType = 'activity' | 'article' | 'bangumi' | 'bili_user' | 'live' | 'live_all' | 'live_master' | 'live_room' | 'live_user' | 'media_bangumi' | 'media_ft' | 'movie' | 'operation_card' | 'pgc' | 'related_search' | 'special' | 'topic' | 'tv' | 'upuser' | 'user' | 'video';