import { Api } from "../../../..";
import { RestType } from "../../../../../../../code";

/** 最近收藏 */
export async function medialistRecent() {
    const response = await fetch(Api + '/medialist/gateway/coll/resource/recent', { credentials: 'include' });
    return <IMedialistRecent>await response.json();
}

interface IMedialistRecent extends RestType {
    data: {
        fav_state: number;
        id: number;
        like_state: number;
        page: number;
        short_link: string;
        title: string;
        type: number;
    }[];
}