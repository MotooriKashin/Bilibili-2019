import { ApiLive } from "../../..";
import { RestType } from "../../../../../../../code";

export async function feed_list(page = 1) {
    const url = new URL(ApiLive + '/relation/v1/feed/feed_list');
    url.searchParams.set('page', <any>page);
    url.searchParams.set('pagesize', '5');
    const response = await fetch(url, { credentials: 'include' });
    return <IFeedList>await response.json();
}

interface IFeedList extends RestType {
    data: {
        list: {
            area_id: number;
            cover: string;
            face: string;
            link: string;
            online: number;
            parent_area_id: number;
            pic: string;
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
        }[];
        page: string;
        pagesize: string;
        results: number;
    };
}