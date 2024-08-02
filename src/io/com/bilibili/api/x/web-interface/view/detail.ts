import { Api } from "../../..";
import { IRelated } from "../archive/related";

export async function detail(aid: number) {
    const url = new URL(Api + '/x/web-interface/view/detail');
    url.searchParams.set('aid', <any>aid);
    CATCH[aid] || (CATCH[aid] = fetch(url, { credentials: 'include' }));
    return <IDetail>(await (await CATCH[aid]).clone().json()).data;
}

/** 同一请求缓存 */
const CATCH: Record<number, Promise<Response>> = {};

interface IDetail {
    Card: ICard;
    Related: IRelated[];
    Tags: ITags[];
    View: IView;
    elec?: unknown;
    participle: string[];
    query_tags?: unknown;
    recommend?: unknown;

}

interface ICard {
    archive_count: number;
    article_count: number;
    card: {
        DisplayRank: string;
        Official: { role: number; title: string; desc: string; type: number };
        approve: boolean;
        article: number;
        attention: number;
        attentions: number[];
        description: string;
        face: string;
        fans: number;
        friend: number;
        level_info: { current_level: number; current_min: number; current_exp: number; next_exp: number };
        mid: string;
        name: string;
        nameplate: {
            condition: string;
            image: string;
            level: string;
            name: string;
            nid: number;
        };
        official_verify: { type: number; desc: string };
        pendant: {
            expire: number;
            image: string;
            n_pid: number;
            name: string;
            pid: number;
        };
        place: string;
        rank: string;
        sex: string;
        sign: string;
        vip: {
            due_date: number;
            label: {
                bg_color: string;
                bg_style: number;
                label_theme: string;
                text: string;
                text_color: string;
            };
            nickname_color: string;
            role: number;
            status: number;
            tv_due_date: number;
            tv_vip_pay_type: number;
            tv_vip_status: number;
            type: number;
            vipStatus: number;
            vipType: number;
            vip_pay_type: number;
        };
        follower: number;
        following: boolean;
        like_num: number;
        space: {
            l_img: string;
            s_img: string;
        }
    }
    follower: number;
    following: boolean;
    like_num: number;
}

interface ITags {
    jump_url: string;
    music_id: string;
    tag_id: number;
    tag_name: string;
    tag_type: string;
}

interface IView {
    aid: number;
    cid: number;
    ctime: number;
    desc: string;
    duration: number;
    dynamic: string;
    honor_reply: {
        honor: {
            aid: number;
            desc: string;
            type: number;
            weekly_recommend_num: number;
        }[]
    };
    owner: {
        face: string;
        mid: number;
        name: string;
    };
    pages: {
        cid: number;
        duration: number;
        from: string;
        page: number;
        part: string;
    }[];
    pic: string;
    pubdate: number;
    season_id: number;
    staff?: {
        face: string;
        follower: number;
        label_style: number;
        mid: number;
        name: string;
        official: {
            desc: string;
            role: number;
            title: string;
            type: number;
        };
        title: string;
        vip: {
            avatar_icon: { icon_resource: {}; icon_type: number; };
            avatar_subscript: number;
            avatar_subscript_url: string;
            due_date: number;
            label: {
                bg_color: string;
                bg_style: number;
                border_color: string;
                img_label_uri_hans: string;
                img_label_uri_hans_static: string;
                img_label_uri_hant: string;
                img_label_uri_hant_static: string;
                label_theme: string;
                path: string;
                text: string;
                text_color: string;
                use_img_label: boolean;
            };
            nickname_color: string;
            role: number;
            status: number;
            theme_type: number;
            tv_due_date: number;
            tv_vip_pay_type: number;
            tv_vip_status: number;
            type: number;
            vip_pay_type: number;
        }
    }[];
    stat: {
        aid: number;
        coin: number;
        danmaku: number;
        dislike: number;
        evaluation: string;
        favorite: number;
        his_rank: number;
        like: number;
        now_rank: number;
        reply: number;
        share: number;
        view: number;
        vt: number;
    };
    state: number;
    tid: number;
    title: string;
    tname: string;
    ugc_season?: {
        attribute: number;
        cover: string;
        enable_vt: number;
        ep_count: number;
        id: number;
        intro: string;
        is_pay_season: boolean;
        mid: number;
        season_type: number;
        sections: {
            episodes: {
                aid: number;
                arc: {
                    aid: number;
                    author: { mid: number; name: string; face: string };
                    ctime: number;
                    desc: string;
                    duration: number;
                    dynamic: string;
                    pic: string;
                    pubdate: number;
                    stat: {
                        aid: number;
                        coin: number;
                        danmaku: number;
                        dislike: number;
                        evaluation: string;
                        favorite: number;
                        his_rank: number;
                        like: number;
                        now_rank: number;
                        reply: number;
                        share: number;
                        view: number;
                        vt: number;
                    };
                    state: number;
                    title: string;
                    videos: number;
                };
                attribute: number;
                cid: number;
                id: number;
                page: {
                    cid: number;
                    duration: number;
                    from: string;
                    page: number;
                    part: string;

                }[];
                season_id: number;
                section_id: number;
                title: string;
            }[];
            id: number;
            season_id: number;
            title: string;

        }[];
        stat: {
            coin: number;
            danmaku: number;
            fav: number;
            his_rank: number;
            like: number;
            now_rank: number;
            reply: number;
            season_id: number;
            share: number;
            view: number;
            vt: number;
            vv: number;
        }
        title: number;
    };
    user_garb: { url_image_ani_cut: string };
    videos: number;
}