import { Protobuf } from ".";

export class DmSegMobileReply {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.DmSegMobileReply.decode(new Uint8Array(buffer));
        return <IDmSegMobileReply>Protobuf.DmSegMobileReply.toObject(msg);
    }

    static encode(data: IDmSegMobileReply) {
        const obj = Protobuf.DmSegMobileReply.fromObject(data);
        return Protobuf.DmSegMobileReply.encode(obj).finish();
    }

    static create(data: IDmSegMobileReply) {
        return Protobuf.DmSegMobileReply.create(data);
    }
}

export interface IDmSegMobileReply {
    elems: IDanmaku[];
    colorfulSrc: IColorFulSrc[];
}

interface IColorFulSrc {
    type: number;
    src: string;
}

export interface IDanmaku {
    /** 互动指令 */
    action?: string;
    /** 
     * 弹幕属性位
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 保护弹幕 | 直播弹幕 | 高赞弹幕 |
     */
    attr?: number;
    /** 弹幕颜色 */
    color: number;
    /** 弹幕内容 */
    content: string;
    /** 发送时间戳 */
    ctime: number;
    /** 字体大小 */
    fontsize: number;
    /** @deprecated 唯一id，已超过JavaScript整数上限，请使用idStr */
    id: number;
    /** 唯一id，已超过JavaScript整数上限，如非必要切莫转化为数字 */
    idStr: string;
    /** 弹幕发送者crc32哈希 */
    midHash: string;
    /**
     * 弹幕模式
     * | 1 | 4 | 5 | 6 | 7 | 8 | 9 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 普通 | 底部 | 顶部 | 逆向 | 高级 | 代码 | BAS |
     */
    mode: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * 弹幕池
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 普通弹幕 | 字幕弹幕 | 特殊弹幕 |
     */
    pool: 0 | 1 | 2;
    /** 弹幕位于视频中的时间点（单位毫秒） */
    progress: number;
    /** 弹幕权重，越高显示优先级越高 */
    weight?: number;
    /** 待定 */
    animation?: string;
    /** 笔触 */
    colorful?: number;
}