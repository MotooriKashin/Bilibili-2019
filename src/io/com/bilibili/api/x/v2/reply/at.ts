import { Api } from "../../..";

export async function replyAt(keyword = '') {
    const response = await fetch(Api + `/x/v2/reply/at?keyword=${keyword}`, { credentials: 'include' });
    return <IReplyAtGroup[]>(await response.json()).data.groups;
}

interface IReplyAtGroup {
    group_name: string;
    group_type: number;
    items: IAtitem[];
}

interface IAtitem {
    face: string;
    fan: number;
    mid: number;
    name: number;
    official_verify_type: number;
}