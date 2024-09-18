import { ApiLive } from "../../../..";
import { RestType } from "../../../../../../../../code";
import { IRecommendRoomList } from "./getList";

/** 更新直播首页推荐数据 */
export async function getMoreRecList() {
    const url = new URL(ApiLive + '/xlive/web-interface/v1/webMain/getMoreRecList');
    url.searchParams.set('platform', 'web');
    const response = await fetch(url);
    return <IGetMoreRecList>await response.json();
}

interface IGetMoreRecList extends RestType {
    data: {
        recommend_room_list: IRecommendRoomList[];
    }
}