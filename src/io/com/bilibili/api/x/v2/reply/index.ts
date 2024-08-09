import { Api } from "../../..";

/**
 * 获取评论
 * 
 * @param oid 评论所属页面id，对于视频页面，取aid
 * @param pn 页码
 * @param sort 评论排序，0：时间，2：热度
 * @param type 评论类型，视频页是1
 */
export async function reply(
    oid: number | string,
    pn = 1,
    sort: 0 | 2 = 2,
    type = 1,
) {
    const url = new URL(Api + '/x/v2/reply');
    url.searchParams.set('oid', <any>oid);
    url.searchParams.set('pn', <any>pn);
    url.searchParams.set('sort', <any>sort);
    url.searchParams.set('type', <any>type);
    const response = await fetch(url, { credentials: 'include' });
    return <IReply>(await response.json()).data;
}

interface IReply {
    config: {
        read_only: boolean;
        show_up_flag: boolean;
        showtopic: number;
    };
    control: {
        answer_guide_text: string;
        bg_text: string;
        child_input_text: string;
        giveup_input_text: string;
        input_disable: boolean;
        root_input_text: string;
        show_text: string;
        show_type: number;
    };
    /**
     * |  |  |
     * | :-: | :-: |
     * | 2 | 3 |
     * | 时间 | 热度 |
     */
    mode: 2 | 3;
    page: { num: number; size: number; count: number; acount: number };
    replies: IReplies[];
    top?: IReplies;
    upper: {
        mid: number;
        top?: IReplies;
        vote?: IReplies;
    };
}
export interface IReplies {
    /**
     * |  |  |
     * | :-: | :-: |
     * | 0 | 1 |
     * | 未点赞 | 已点赞 |
     */
    action: 0 | 1;
    content: {
        at_name_to_mid_str?: Record<string, string>;
        emote?: Record<string, {
            gif_url: string;
            id: number;
            jump_title: string;
            mtime: number;
            package_id: number;
            state: number;
            text: string;
            type: number;
            url: string;
        }>;
        jump_url?: Record<string, {
            title: string;
            prefix_icon: string;
        }>;
        pictures?: {
            img_height: number;
            img_size: number;
            img_src: string;
            img_width: number;
            play_gif_thumbnail: boolean;
            top_right_icon: string;
        }[];
        rich_text?: {
            note?: {
                images?: string[];
            }
        }
        message: string;
    };
    count: number;
    ctime: number;
    dialog_str?: string;
    floor?: number;
    invisible: boolean;
    like: number;
    label?: {
        content: string;
    };
    member: {
        avatar: string;
        fans_detail?: {
            level: number;
            medal_color: number;
            medal_color_border: number;
            medal_color_end: number;
            medal_color_level: number;
            medal_color_name: number;
            medal_id: number;
            medal_level_bg_color: number;
            medal_name: string;
        };
        level_info: {
            current_level: number;
        };
        mid: string;
        is_senior_member: number;
        nameplate: { nid: number; name: string; image: string; image_small: string; level: string; condition: string };
        official_verify: { type: number; desc: string };
        pendant: {
            expire: number;
            image: string;
            n_pid: number;
            name: string;
            pid: number;
        };
        rank: string;
        sex: string;
        uname: string;
        user_sailing?: {
            cardbg?: {
                fan: {
                    color: string;
                    is_fan: number;
                    name: string;
                    num_desc: string;
                    num_prefix: string;
                    number: number;
                };
                id: number;
                image: string;
                jump_url: string;
                name: string;
                type: string;
            }
        };
        vip: {
            nickname_color: string;
            vipDueDate: number;
            vipStatus: number;
            vipType: number;
        };
    }
    mid: number;
    mid_str: string;
    oid_str: string;
    parent_str: string;
    rcount: number;
    replies: IReplies[];
    reply_control: {
        is_up_top: boolean;
        location: string;
        max_line: number;
        sub_reply_entry_text: string;
        time_desc: string;
    };
    root_str: string;
    rpid_str: string;
    state: number;
    type: number;
    up_action?: { like: boolean; reply: boolean };
}