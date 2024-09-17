import { Api } from "../../..";
import { RestType } from "../../../../../../code";

export async function activityInfo(
    sid: number,
    aid: number,
) {
    const url = new URL(Api + '/x/activity/subject/info');
    url.searchParams.set('sid', <any>sid);
    url.searchParams.set('aid', <any>aid);
    CATCH[sid] || (CATCH[sid] = fetch(url, { credentials: 'include' }));
    return <IActivityInfo>await (await CATCH[sid]).clone().json();
}

/** 同一请求缓存 */
const CATCH: Record<number, Promise<Response>> = {};

interface IActivityInfo extends RestType {
    data: {
        act_url: string;
        android_url: string;
        calendar: string;
        child_sids: string;
        cover: string;
        ctime: number;
        dic: string;
        etime: number;
        h5_cover: string;
        id: number;
        ios_url: string;
        letime: number;
        lid: number;
        lstime: number;
        mtime: number;
        name: string;
        oid: number;
        state: number;
        stime: number;
        type: number;
    }
}