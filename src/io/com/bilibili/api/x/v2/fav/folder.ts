import { Api } from "../../..";
import { RestType } from "../../../../../../code";

export async function folder(
    aid: number | string,
) {
    const url = new URL(Api + '/x/v2/fav/folder');
    url.searchParams.set('aid', <any>aid);
    const response = await fetch(url, { credentials: 'include' });
    return <IFolder>await response.json();
}

interface IFolder extends RestType {
    data: {
        atten_count: number;
        cover: {
            aid: number;
            pic: string;
            title: string;
            type: number;
        }[];
        ctime: number;
        cur_count: number;
        favoured: number;
        fid: number;
        max_count: number;
        media_id: number;
        mid: number;
        mtime: number;
        name: string;
        /**
         * | 0 | 1 | 2 | 3 |
         * | :-: | :-: | :-: | :-: |
         * | 默认 | 未知 | 公开 | 私密 |
         */
        state: number;
    }[];
}