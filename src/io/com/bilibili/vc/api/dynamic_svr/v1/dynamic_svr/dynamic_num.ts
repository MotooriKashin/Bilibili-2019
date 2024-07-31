import { ApiVc } from "../../..";

export async function dynamic_num(
    uid: number | string,
    update_num_dy_id: string,
    ...type_list: number[]
) {
    const url = new URL(ApiVc + '/dynamic_svr/v1/dynamic_svr/dynamic_num');
    url.searchParams.set('rsp_type', '1');
    url.searchParams.set('uid', <any>uid);
    url.searchParams.set('type_list', type_list.join(','));
    url.searchParams.set('update_num_dy_id', update_num_dy_id);
    const response = await fetch(url, { credentials: 'include' });
    return <number>(await response.json()).data.update_num;
}