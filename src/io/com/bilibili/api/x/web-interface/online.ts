import { Api } from "../..";

/** 获取各主分区在线人数 */
export async function online() {
    const response = await fetch(Api + '/x/web-interface/online');
    return <Record<number, number>>(await response.json()).data.region_count
}