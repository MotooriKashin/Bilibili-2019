import { Api } from "../..";
import { RestType } from "../../../../../code";

/** 获取各主分区在线人数 */
export async function online() {
    const response = await fetch(Api + '/x/web-interface/online');
    return <IOnline>await response.json();
}

interface IOnline extends RestType {
    data: {
        region_count: Record<number, number>;
    }
}