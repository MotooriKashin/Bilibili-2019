import { Api } from "../../../..";

/** 最近收藏 */
export async function medialistRecent() {
    const response = await fetch(Api + '/medialist/gateway/coll/resource/recent', { credentials: 'include' });
    return <IMedialistRecent[]>(await response.json()).data;
}

interface IMedialistRecent {
    fav_state: number;
    id: number;
    like_state: number;
    page: number;
    short_link: string;
    title: string;
    type: number;
}