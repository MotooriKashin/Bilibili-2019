import { Api } from "../../..";
import { IReplies } from ".";
import { RestType } from "../../../../../../code";

/**
 * 请求瀑布流评论
 * 
 * @param oid 评论所属页面id，对于视频页面，取aid
 * @param mode 评论排序，2：时间，3：热度
 * @param next 按热度时：热度顺序页码，按时间时：时间倒序楼层号
 * @param seek_rpid 锚定的评论id
 * @param type 评论类型，视频页是1
 * @param plat 评论平台，网页端是1
 */
export async function replyMain(
    oid: number | string,
    mode: 2 | 3 = 3,
    next = 0,
    seek_rpid?: number | string,
    type = 1,
    plat = 1,
) {
    const url = new URL(Api + '/x/v2/reply/main');
    url.searchParams.set('oid', <any>oid);
    url.searchParams.set('mode', <any>mode);
    url.searchParams.set('next', <any>next);
    seek_rpid && url.searchParams.set('seek_rpid', <any>seek_rpid);
    url.searchParams.set('type', <any>type);
    url.searchParams.set('plat', <any>plat);
    const response = await fetch(url, { credentials: 'include' });
    return <IReplyMain>await response.json();
}

interface IReplyMain extends RestType {
    data: {
        assist: number;
        blacklist: number;
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
        cursor: {
            all_count: number;
            is_begin: boolean;
            is_end: boolean;
            /**
             * |  |  |
             * | :-: | :-: |
             * | 2 | 3 |
             * | 时间 | 热度 |
             */
            mode: 2 | 3;
            mode_text: string;
            name: string;
            next: number;
            pagination_reply: { next_offset: string };
            prev: number;
            session_id: string;
        };
        replies: IReplies[];
        top?: { admin?: IReplies, upper?: IReplies, vote?: IReplies };
        top_replies?: IReplies[];
        up_selection: { pending_count: number; ignore_count: number };
        upper: { mid: number };
    }
}