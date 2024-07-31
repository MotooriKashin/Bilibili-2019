import { Protobuf } from ".";

export class DanmakuEvent {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.DanmukuEvent.decode(new Uint8Array(buffer));
        return <IDanmukuEvent>Protobuf.DanmukuEvent.toObject(msg);
    }

    static encode(data: IDanmukuEvent) {
        const obj = Protobuf.DanmukuEvent.fromObject(data);
        return Protobuf.DanmukuEvent.encode(obj).finish();
    }

    static create(data: IDanmukuEvent) {
        return Protobuf.DanmukuEvent.create(data);
    }
}

interface IDanmukuEvent {
    elems: IDanmakuElem[];
}

/** 实时弹幕专用结构体，与普通弹幕不通用 */
interface IDanmakuElem {
    /** @deprecated 唯一id，已超过JavaScript整数上限，请使用idStr */
    id: number;
    /** 弹幕位于视频中的时间点（单位毫秒） */
    progress: number;
    /**
     * 弹幕模式
     * | 1 | 4 | 5 | 6 | 7 | 8 | 9 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 普通 | 底部 | 顶部 | 逆向 | 高级 | 代码 | BAS |
     */
    mode: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /** 字体大小 */
    fontsize: number;
    /** 弹幕颜色 */
    color: number;
    /** 弹幕发送者crc32哈希 */
    midHash: string;
    /** 弹幕内容 */
    content: string;
    /** 发送时间戳 */
    ctime: number;
    /** 互动指令 */
    action: string;
    /**
     * 弹幕池
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 普通弹幕 | 字幕弹幕 | 特殊弹幕 |
     */
    pool: 0 | 1 | 2;
    /** 唯一id，已超过JavaScript整数上限，如非必要切莫转化为数字 */
    idStr: string;
}