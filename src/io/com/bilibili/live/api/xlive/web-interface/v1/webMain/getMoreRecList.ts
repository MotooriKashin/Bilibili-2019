import { ApiLive } from "../../../..";
import { IRecommendRoomList } from "./getList";

/** 更新直播首页推荐数据 */
export async function getMoreRecList() {
    const url = new URL(ApiLive + '/xlive/web-interface/v1/webMain/getMoreRecList');
    url.searchParams.set('platform', 'web');
    const response = await fetch(url);
    const json = await response.json();
    return <IGetMoreRecList>json.data;
}

interface IGetMoreRecList {
    recommend_room_list: IRecommendRoomList[];
}