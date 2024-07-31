import { Api } from "../../..";
import { IPgcFollow } from "./add";

/** 取消追番 */
export async function followDel(
    csrf: string,
    season_id: number | string,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        season_id,
        csrf,
    });
    const response = await fetch(Api + '/pgc/web/follow/del', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <IPgcFollow>(await response.json()).result;
}