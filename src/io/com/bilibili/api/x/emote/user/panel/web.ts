import { Api } from "../../../..";
import { RestType } from "../../../../../../../code";

/** 获取评论表情 */
let CATCH: Promise<Response>;
export async function emoteWeb() {
    CATCH || (CATCH = fetch(Api + '/x/emote/user/panel/web?business=reply', { credentials: 'include' }));
    return <IEmoteWeb>await (await CATCH).clone().json();
}

interface IEmoteWeb extends RestType {
    data: {
        packages: {
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
        }[];
    }
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