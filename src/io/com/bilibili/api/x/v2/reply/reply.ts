import { Api } from "../../..";
import { IReplies } from ".";
import { RestType } from "../../../../../../code";

export async function replyReply(
    root: number | string,
    oid: number | string,
    pn = 1,
    type = 1,
) {
    const url = new URL(Api + '/x/v2/reply/reply');
    url.searchParams.set('oid', <any>oid);
    url.searchParams.set('pn', <any>pn);
    url.searchParams.set('root', <any>root);
    url.searchParams.set('type', <any>type);
    const response = await fetch(url, { credentials: 'include' });
    return <IReplyReply>await response.json();
}

interface IReplyReply extends RestType {
    data: {
        config: {
            read_only: boolean;
            show_up_flag: boolean;
            showtopic: number;
        };
        control: {
            answer_guide_text: string;
            bg_text: string;
            child_input_text: string;
            giveup_input_text: string;
            input_disable: boolean;
            root_input_text: string;
            show_text: string;
            show_type: number;
        };
        page: { num: number; size: number; count: number };
        replies: IReplies[];
        root: IReplies;
        upper: { mid: number };
    }
}