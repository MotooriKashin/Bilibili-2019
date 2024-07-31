import { Api } from "../../../..";
import { IReplies } from "../../reply";

export async function cursor(
    oid: number | string,
    root: number | string,
    dialog: number | string,
    min_floor = 0,
    type = 1,
    size = 20,
) {
    const url = new URL(Api + '/x/v2/reply/dialog/cursor');
    url.searchParams.set('oid', <any>oid);
    url.searchParams.set('root', <any>root);
    url.searchParams.set('dialog', <any>dialog);
    url.searchParams.set('min_floor', <any>min_floor);
    url.searchParams.set('type', <any>type);
    url.searchParams.set('size', <any>size);
    const response = await fetch(url, { credentials: 'include' });
    return <IReplyCursor>(await response.json()).data;
}

interface IReplyCursor {
    assist: number;
    blacklist: number;
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
    cursor: {
        is_begin: boolean;
        max_floor: number;
        min_floor: number;
        next: number;
        pagination_reply: { next_offset: string };
        session_id: string;
        size: number;
    };
    dialog: {
        max_floor: number;
        min_floor: number;
    };
    note: number;
    replies: IReplies[];
    upper: { mid: number };
    vote: number;
}