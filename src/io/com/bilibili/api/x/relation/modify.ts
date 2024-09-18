import { Api } from "../..";
import { RestType } from "../../../../../code";

export async function relationModify(
    csrf: string,
    fid: number | string,
    /**
     * | 1 | 2 | 4 | 5 |
     * | :-: | :-: | :-: | :-: |
     * | 关注 | 取消关注 | 悄悄关注 | 拉黑 |
     */
    act: 1 | 2 | 4 | 5,
    re_src = 15,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        fid,
        act,
        re_src,
        csrf,
    });
    const response = await fetch(Api + '/x/relation/modify?cross_domain=true', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <RestType>await response.json();
}