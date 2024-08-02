import { Api } from "../../..";

/** 课程基本信息 */
export async function pugvSeason(params: ISeasonIn) {
    const param = params.season_id ? `season_id=${params.season_id}` : `ep_id=${params.ep_id}`;
    CATCH[param] || (CATCH[param] = fetch(Api + `/pugv/view/web/season?${param}`, { credentials: 'include' }));
    return <ISeason>(await (await CATCH[param]).clone().json()).data;
}

/** 同一请求缓存 */
const CATCH: Record<string, Promise<Response>> = {};

interface ISeasonIn {
    ep_id?: number;
    season_id?: number;
}

interface ISeason {
    active_market: number[];
    activity_list: [];
    be_subscription: boolean;
    brief: {
        content: string;
        img: {
            aspect_ratio: number;
            url: string;
        }[];
        title: string;
        type: number;
    };
    consulting: {
        consulting_flag: boolean;
        consulting_url: string;
    };
    cooperation: {
        link: string;
    };
    cooperators: [];
    coupon: {
        amount: number;
        coupon_type: number;
        discount_amount: string;
        expire_minute: string;
        expire_time: string;
        receive_expire_time: number;
        scene_background_img: string;
        scene_benefit_img: string;
        scene_countdown: boolean;
        scene_mark: string;
        short_title: string;
        show_amount: string;
        start_time: string;
        status: number;
        title: string;
        token: string;
        use_expire_time: number;
        use_scope: string;
    };
    course_content: string;
    courses: [];
    cover: string;
    ep_catalogue: [];
    ep_count: number;
    episode_page: {
        next: boolean;
        num: number;
        size: number;
        total: number;
    };
    episode_sort: number;
    episode_tag: {
        part_preview_tag: string;
        pay_tag: string;
        preview_tag: string;
    };
    episodes: IEpisode[];
    expiry_day: number;
    expiry_info_content: string;
    faq: {
        content: string;
        link: string;
        title: string;
    };
    faq1: {
        items: {
            answer: string;
            question: number;
        }[];
        title: string;
    };
    is_enable_cash: boolean;
    is_series: boolean;
    live_ep_count: number;
    notice: [];
    opened_ep_count: number;
    pack_info: {
        pack_item_list: [];
        pack_notice2: string;
        show_packs_right: boolean;
        title: string;
    };
    paid_jump: {
        jump_url_for_app: string;
        url: string;
    };
    paid_view: boolean;
    payment: {
        bp_enough: number;
        desc: string;
        discount_desc: string;
        discount_prefix: string;
        my_bp: number;
        pay_shade: string;
        price: number;
        price_format: string;
        price_unit: string;
        refresh_text: string;
        select_text: string;
    };
    previewed_purchase_note: {
        long_watch_text: string;
        pay_text: string;
        price_format: string;
        watch_text: string;
        watching_text: string;
    };
    purchase_format_note: {
        content_list: {
            bold: boolean;
            content: string;
            number: string;
        }[];
        link: string;
        title: string;
    };
    purchase_note: {
        content: string;
        link: string;
        title: string;
    };
    purchase_protocol: {
        link: string;
        title: string;
    };
    recommend_seasons: {
        cover: string;
        ep_count: string;
        id: number;
        season_url: string;
        subtitle: string;
        title: string;
        view: number;
    }[];
    release_bottom_info: string;
    release_info: string;
    release_info2: string;
    release_status: string;
    season_id: number;
    season_tag: number;
    share_url: string;
    short_link: string;
    show_watermark: boolean;
    stat: {
        play: number;
        play_desc: string;
        show_vt: boolean;
    };
    status: number;
    stop_sell: boolean;
    subscription_update_count_cycle_text: string;
    subtitle: string;
    title: string;
    up_info: {
        avatar: string;
        brief: string;
        follower: number;
        is_follow: number;
        is_living: boolean;
        link: string;
        mid: number;
        pendant: {
            image: string;
            name: string;
            pid: string;
        };
        season_count: number;
        uname: string;
    };
    update_status: number;
    user_status: {
        bp: number;
        expire_at: number;
        favored: number;
        favored_count: number;
        is_expired: boolean;
        is_first_paid: boolean;
        payed: number;
        user_expiry_content: string;
    };
    watermark_interval: number;
}

interface IEpisode {
    aid: number;
    catalogue_index: number;
    cid: number;
    cover: string;
    duration: number;
    ep_status: number;
    episode_can_view: boolean;
    from: string;
    id: number;
    index: number;
    label: string;
    page: number;
    play: number;
    play_way: number;
    playable: boolean;
    release_date: number;
    show_vt: boolean;
    status: number;
    subtitle: string;
    title: string;
    watched: boolean;
    watchedHistory: number;
}