import { Api } from "../../../..";
import { DmSegMobileReply } from "../../../../../../bapis/bilibili/community/service/dm/v1/DmSegMobileReply";

/**
 * 
 * @param oid cid
 * @param pid aid
 * @param type 1 表示视频
 * @param segment_index 分片序号（从1开始）
 */
export async function segSo(oid: number, pid = 0, segment_index = 1, type = 1) {
    const url = new URL(Api + '/x/v2/dm/web/seg.so');
    url.searchParams.set('oid', <any>oid);
    url.searchParams.set('pid', <any>pid);
    url.searchParams.set('segment_index', <any>segment_index);
    url.searchParams.set('type', <any>type);
    const response = await fetch(url, { credentials: 'include' });
    return DmSegMobileReply.decode(new Uint8Array(await response.arrayBuffer()));
}