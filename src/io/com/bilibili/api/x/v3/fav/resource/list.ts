import { Api } from "../../../..";

/**
 * 获取播放列表
 * 
 * @param biz_id 播放列表id
 * @param pn 页码
 */
export async function favResourceList(
    media_id: number | string,
    pn = 1,
) {
    const url = new URL(Api + '/x/v3/fav/resource/list');
    url.searchParams.set('media_id', <any>media_id);
    url.searchParams.set('pn', <any>pn);
    url.searchParams.set('ps', '20');
    url.searchParams.set('keyword', '');
    url.searchParams.set('order', 'mtime');
    url.searchParams.set('type', '0');
    url.searchParams.set('tid', '0');
    url.searchParams.set('platform', 'web');
    const response = await fetch(url, { credentials: 'include' });
    return <IFavResourceList>(await response.json()).data;
}

interface IFavResourceList {
    has_more: boolean;
    info: IFavResourceInfo;
    medias: IFavResourceMedia[];
    ttl: number;
}

interface IFavResourceInfo {
    attr: number;
    cnt_info: {
        collect: number;
        play: number;
        share: number;
        thumb_up: number;
    };
    cover: string;
    cover_type: number;
    ctime: number;
    fav_state: number;
    fid: number;
    id: number;
    intro: string;
    is_top: boolean;
    like_state: number;
    media_count: number;
    mid: number;
    mtime: number;
    state: number;
    title: string;
    type: number;
    upper: {
        face: string;
        followed: boolean;
        mid: number;
        name: string;
        vip_statue: number;
        vip_type: number;
    };
}

interface IFavResourceMedia {
    attr: string;
    cnt_info: {
        collect: number;
        danmaku: number;
        play: number;
        play_switch: number;
        reply: number;
    };
    cover: string;
    ctime: number;
    duration: number;
    fav_time: number;
    id: number;
    intro: string;
    link: string;
    media_list_link: string;
    ogv: unknown;
    page: number;
    pubtime: number;
    season: unknown;
    title: string;
    type: number;
    ugc: {
        first_cid: number;
    };
    upper: {
        face: string;
        mid: number;
        name: string;
    }
}