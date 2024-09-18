import { ApiLive } from "../../../..";
import { RestType } from "../../../../../../../../code";

/** 获取直播首页推荐数据 */
export async function getList() {
    const url = new URL(ApiLive + '/xlive/web-interface/v1/webMain/getList');
    url.searchParams.set('platform', 'web');
    const response = await fetch(url);
    return <IGetList>await response.json();
}

interface IGetList extends RestType {
    data: {
        dynamic: number;
        online_total: number;
        ranking_list?: IRankingList[];
        recommend_room_list: IRecommendRoomList[];
    }
}

interface IRankingList {
    area_id: number;
    face: string;
    link: string;
    online: number;
    parent_area_id: number;
    roomid: number;
    title: string;
    uid: number;
    uname: string;
    watched_show: {
        icon: string;
        icon_location: number;
        icon_web: string;
        num: number;
        switch: boolean;
        text_large: string;
        text_small: string;
    };
}

export interface IRecommendRoomList {
    area_v2_id: number;
    area_v2_name: string;
    area_v2_parent_id: number;
    area_v2_parent_name: string;
    cover: string;
    face: string;
    flag: number;
    followers: number;
    group_id: number;
    head_box?: {
        desc: string;
        name: string;
        value: string;
    };
    head_box_type: number;
    is_ad: boolean;
    keyframe: string;
    online: number;
    roomid: number;
    status: boolean;
    title: string;
    uid: number;
    uname: string;
    watched_show: {
        icon: string;
        icon_location: number;
        icon_web: string;
        num: number;
        switch: boolean;
        text_large: string;
        text_small: string;
    }
}