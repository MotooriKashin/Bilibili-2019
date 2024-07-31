import { Api } from "../../../..";

/** 获取评论表情 */
let CATCH: IEmoteWeb[];
export async function emoteWeb() {
    if (CATCH) return CATCH;
    const response = await fetch(Api + '/x/emote/user/panel/web?business=reply', { credentials: 'include' });
    return CATCH = <IEmoteWeb[]>(await response.json()).data.packages;
}

interface IEmoteWeb {
    attr: number;
    emote: IEmote[];
    flags: { added: boolean; preview?: boolean; };
    id: number;
    meta: { size: number; item_id: number; };
    mtime: number;
    package_sub_title: string;
    ref_mid: number;
    resource_type: number;
    text: string;
    type: number;
    url: string;
}

interface IEmote {
    attr: number;
    flags: { unlocked: boolean };
    id: number;
    meta: { alias: string; size: number; suggest: string[] };
    mtime: number;
    package_id: number;
    text: string;
    type: number;
    url: string;
}