import { Api } from "../../../..";
import { DmWebViewReply } from "../../../../../../bapis/bilibili/community/service/dm/v1/DmWebViewReply";

/**
 * 
 * @param oid cid
 * @param pid aid
 * @param type 1 表示视频
 */
export async function view(oid: number, pid = 0, type = 1) {
    const url = new URL(Api + '/x/v2/dm/web/view');
    url.searchParams.set('oid', <any>oid);
    url.searchParams.set('pid', <any>pid);
    url.searchParams.set('type', <any>type);
    const response = await fetch(url, { credentials: 'include' });
    return DmWebViewReply.decode((new Uint8Array(await response.arrayBuffer())));
}