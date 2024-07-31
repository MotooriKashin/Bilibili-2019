import { Api } from "../../../..";

/**
 * 获取播放列表
 * @deprecated 请使用favResourceList接口
 */
export async function medialistResource(
    /** 播单id */
    biz_id: number | string,
    /**
     * 播单类型，与查询参数`business`对应
     * 
     * | 1 | 3 | 5 | 6 | 8 |
     * | :-: | :-: | :-: | :-: | :-: |
     * | space | <默认> | space_series | space_channel | space_collection |
     */
    type: 1 | 3 | 5 | 6 | 8,
    /** 锚定的aid，用于获取更多 */
    oid: number | string = '',
    /** 锚定oid对应的type */
    otype = 2,
) {
    const url = new URL(Api + '/x/v2/medialist/resource/list');
    url.searchParams.set('type', <any>type);
    url.searchParams.set('otype', <any>otype);
    url.searchParams.set('biz_id', <any>biz_id);
    url.searchParams.set('oid', <any>oid);
    url.searchParams.set('mobi_app', <any>'web');
    url.searchParams.set('ps', <any>20);
    url.searchParams.set('direction', <any>false);
    const response = await fetch(url, { credentials: 'include' });
    return <IMedialistResource>(await response.json()).data;
}

interface IMedialistResource {
    has_more: boolean;
    media_list: IMediaList[];
    next_start_key: string;
    total_count: number;
}

interface IMediaList {
    attr: number;
    business_oid: number;
    cnt_info: {
        coin: number;
        collect: number;
        danmaku: number;
        play: number;
        play_switch: number;
        reply: number;
        share: number;
        thumb_down: number;
        thumb_up: number;
    };
    coin: {
        coin_number: number;
        max_num: number;
    };
    copy_right: number;
    cover: string;
    duration: number;
    fav_state: number;
    forbid_fav: boolean;
    id: number;
    index: number;
    intro: string;
    like_state: number;
    link: string;
    more_type: number;
    offset: number;
    page: number;
    pages: {
        duration: number;
        from: string;
        id: number;
        intro: string;
        link: string;
        metas: {
            quality: number; size: number;
        }[];
        page: number;
        title: string;
    }[];
    progress_percent: number;
    pubtime: number;
    short_link: string;
    tid: number;
    title: string;
    type: number;
    upper: {
        display_name: string;
        face: string;
        fans: number;
        followed: number;
        mid: number;
        name: string;
        official_desc: string;
        official_role: number;
        official_title: string;
        vip_due_date: number;
        vip_pay_type: number;
        vip_statue: number;
        vip_type: number;
    };
}