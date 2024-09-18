import { ApiVc } from "../../..";
import { RestType } from "../../../../../../../code";

export async function dynamic_new(
    uid: number | string,
    ...type_list: number[]
) {
    const url = new URL(ApiVc + '/dynamic_svr/v1/dynamic_svr/dynamic_new');
    url.searchParams.set('uid', <any>uid);
    url.searchParams.set('type_list', type_list.join(','));
    const response = await fetch(url, { credentials: 'include' });
    return <IDynamicNew>await response.json();
}

interface IDynamicNew extends RestType {
    data: {
        cards: IDynamicNewCards[];
        exist_gap: number;
        /** @deprecated 丢失精度，勿用 */
        history_offset: number;
        /** @deprecated 丢失精度，勿用 */
        max_dynamic_id: number;
        new_num: number;
        update_num: number;
    }
}

export interface IDynamicNewCards {
    /**
     * 格式化后为:
     *    - 视频 {@link IDynamicNewCard}
     *    - 文章 {@link IDynamicArticle}
     */
    card: string;
    desc: {
        acl: number;
        bvid: string;
        comment: number;
        dynamic_id_str: string;
        inner_id: number;
        is_liked: number;
        like: number;
        orig_dy_id_str: string;
        orig_type: number;
        pre_dy_id_str: string;
        origin: unknown;
        previous: unknown;
        r_type: number;
        repost: number;
        rid_str: string;
        spec_type: number;
        status: number;
        stype: number;
        timestamp: number;
        type: number;
        uid: number;
        uid_type: number;
        user_profile: {
            card: { official_verify: { type: number } };
            info: {
                face: string;
                uid: number;
                uname: string;
            };
            level_info: {
                current_exp: number;
                current_level: number;
                current_min: number;
                next_exp: number;
            };
            pendant: {
                expire: number;
                image: string;
                name: string;
                pid: number;
            };
            rank: string;
            sign: string;
            vip: {
                label: {
                    bg_color: string;
                    bg_style: number;
                    border_color: string;
                    label_theme: string;
                    path: string;
                    text: string;
                    text_color: string;
                };
                nickname_color: string;
                role: number;
                themeType: number;
                vipDueDate: number;
                vipStatus: number;
                vipStatusWarn: string;
                vipType: number;
            };
        };
        view: number;
    };
    display: {
        relation: { status: number; is_follow: number; is_followed: number };
        usr_action_txt: string;
    };
}

export interface IDynamicNewCard {
    aid: number;
    cid: number;
    ctime: number;
    desc: string;
    duration: number;
    dynamic: string;
    first_frame: string;
    jump_url: string;
    owner: {
        face: string;
        mid: number;
        name: number;
    };
    pic: string;
    pubdate: number;
    short_link_v2: string;
    stat: {
        coin: number;
        danmaku: number;
        dislike: number;
        favorite: number;
        like: number;
        reply: number;
        share: number;
        view: number;
    };
    state: number;
    tid: number;
    title: string;
    tname: string;
    videos: number;
}

export interface IDynamicArticle {
    author: {
        face: string;
        mid: number;
        name: number;
    };
    ctime: number;
    id: number;
    image_urls: string[];
    mtime: number;
    origin_image_urls: string[];
    publish_time: number;
    stats: { like: number; reply: number; };
    summary: string;
    title: string;
}