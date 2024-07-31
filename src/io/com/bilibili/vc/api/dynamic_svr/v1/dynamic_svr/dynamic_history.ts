import { ApiVc } from "../../..";
import { IDynamicNewCards } from "./dynamic_new";

export async function dynamic_history(
    uid: number | string,
    offset_dynamic_id: string,
    ...type_list: number[]
) {
    const url = new URL(ApiVc + '/dynamic_svr/v1/dynamic_svr/dynamic_history');
    url.searchParams.set('uid', <any>uid);
    url.searchParams.set('type_list', type_list.join(','));
    url.searchParams.set('offset_dynamic_id', offset_dynamic_id);
    const response = await fetch(url, { credentials: 'include' });
    return <IDynamicHistory>(await response.json()).data;
}

interface IDynamicHistory {
    cards: IDynamicNewCards[];
    has_more: number;
    /** @deprecated 丢失精度，勿用 */
    next_offset: number;
}