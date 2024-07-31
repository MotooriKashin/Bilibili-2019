import { Api } from "../../../..";
import { sign } from "../../../../../../../sign";

/** APP端pgc信息，或可用于查询区域限制番剧 */
export async function pgcAppSeason({ season_id, ep_id, access_key }: IPgcAppSeasonIn) {
    const url = new URL(Api + '/pgc/view/v2/app/season');
    ep_id ? url.searchParams.set('ep_id', <any>ep_id) : (season_id && url.searchParams.set('season_id', <any>season_id));
    access_key && url.searchParams.set('access_key', <any>access_key);
    const response = await fetch(sign(url, '1d8b6e7d45233436'), access_key ? undefined : { credentials: 'include' });
    return <IPgcAppSeason>(await response.json()).data;
}

interface IPgcAppSeasonIn {
    /** 必须二选一 */
    season_id?: string;
    /** 必须二选一 */
    ep_id?: string;
    /** 使用access_key鉴权而不是cookie */
    access_key?: string;
}

interface IPgcAppSeason {
    actor: {
        info: string;
        title: string;
    };
    alias: string;
    all_buttons: { watch_formal: string };
    all_up_infos: [];
    areas: { id: number; name: string }[];
    badge: String;
    badge_info: {
        bg_color: String;
        bg_color_night: String;
        text: String;
    };
    cover: string;
    detail: string;
    dialog: {
        code: number;
        config: {
            is_force_halfscreen_enable: boolean;
            is_nested_scroll_enable: boolean;
            is_orientation_enable: boolean;
            is_show_cover: boolean;
        };
        image: {
            url: string;
        };
        msg: string;
        style_type: string;
        title: {
            text: string;
            text_color: string;
        };
        type: string;
    };
    dynamic_subtitle: string;
    earphone_conf: {
        sp_phones: [];
    };
    evaluate: string;
    follow_layer: {
        info: string;
        title: string;
    };
    media_badge_info: {
        bg_color: string;
        bg_color_night: string;
        text: String;
    };
    media_id: number;
    mode: number;
    modules: [];
    new_ep: {
        desc: string;
        id: number;
        is_new: number;
        more: string;
        title: string;
    };
    new_keep_activity_material: {
        activityId: number;
    };
    origin_name: string;
    payment: {
        dialog: {};
        pay_type: {
            allow_ticket: number;
        };
        price: string;
        report_type: number;
        tv_price: string;
        vip_discount_price: string;
        vip_promotion: string;
    };
    play_strategy: {
        auto_play_toast: string;
        recommend_show_strategy: number;
        strategies: string[];
    };
    premieres: [];
    producer: {
        list: {
            avatar: string;
            follower: number;
            is_follow: number;
            mid: number;
            theme_type: number;
            uname: string;
            upper_type: number;
            verify_type: number;
            verify_type2: number;
            vip_label: {
                label_theme: string;
                path: string;
                text: string;
            };
        }[];
        title: string;
        total: number;
    };
    publish: {
        is_finish: number;
        is_started: number;
        pub_time: string;
        pub_time_show: string;
        release_date_show: string;
        time_length_show: string;
        unknow_pub_date: number;
        update_info_desc: string;
        weekday: number;
    };
    record: string;
    refine_cover: string;
    reserve: {
        episodes: [];
        tip: string;
    };
    season_id: number;
    season_title: string;
    series: {
        display_type: number;
        series_id: number;
        series_title: string;
    };
    share_copy: string;
    share_url: string;
    short_link: string;
    show_season_type: number;
    square_cover: string;
    staff: {
        info: string;
        title: String;
    }[];
    stat: {
        coins: number;
        danmakus: number;
        favorite: number;
        favorites: number;
        followers: string;
        likes: number;
        play: string;
        reply: number;
        share: number;
        views: number;
    };
    status: number;
    styles: {
        id: number;
        name: string;
        url: String;
    }[];
    subtitle: string;
    title: string;
    total: number;
    type: number;
    type_desc: string;
    type_name: string;
    up_info: {
        avatar: string;
        follower: number;
        is_follow: number;
        mid: number;
        pendant: {
            image: string;
            name: string;
            pid: number;
        };
        theme_type: number;
        uname: string;
        verify_type: number;
        vip_label: {
            label_theme: string;
            path: string;
            text: string;
        };
        vip_status: number;
        vip_type: number;
    };
    user_status: {
        follow: number;
        follow_bubble: number;
        follow_status: number;
        pay: number;
        pay_for: number;
        progress: {
            last_ep_id: number;
            last_ep_index: string;
            last_time: number;
        };
        review: {
            article_url: string;
            is_open: number;
            score: number;
        };
        sponsor: number;
        vip: number;
        vip_frozen: number;
        vip_info: {
            due_date: number;
            status: number;
            type: number;
        };
        user_thumbup: {
            url_image_ani: string;
            url_image_ani_cut: String;
            url_image_bright: string;
            url_image_dim: string;
        };
    }
}