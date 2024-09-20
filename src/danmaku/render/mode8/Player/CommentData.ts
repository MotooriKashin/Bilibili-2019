import { IDanmaku } from "../../..";

export class CommentData {

    blocked = false;

    blockType = 0;

    border = false;

    credit = false;

    date = 0;

    deleted = false;

    id = 0;

    mode = 0;

    msg = "";

    live = true;

    locked = true;

    on = true;

    pool = 0;

    preview = false;

    reported = false;

    size = 25;

    stime = 0;

    text = "";

    type = "";

    uid = "";

    danmuId = 0;

    constructor(dm: IDanmaku) {
        this.size = dm.fontsize;
        dm.content && (this.text = dm.content);
        this.mode = dm.mode;
        dm.progress && (this.stime = dm.progress / 1000);
        this.date = Number(dm.ctime);
    }
}