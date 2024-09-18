import { Api } from "../..";
import { RestType } from "../../../../../code";

export async function unread() {
    const response = await fetch(Api + '/x/msgfeed/unread?build=0&mobi_app=web', { credentials: 'include' });
    return <IUnread>await response.json();
}

interface IUnread extends RestType {
    data: {
        at: number;
        chat: number;
        coin: number;
        danmu: number;
        favorite: number;
        like: number;
        recv_like: number;
        recv_reply: number;
        reply: number;
        sys_msg: number;
        up: number;
    }
}