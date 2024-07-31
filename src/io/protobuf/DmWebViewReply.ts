import { Protobuf } from ".";

export class DmWebViewReply {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.DmWebViewReply.decode(new Uint8Array(buffer));
        return <IDmWebViewReply>Protobuf.DmWebViewReply.toObject(msg);
    }

    static encode(data: IDmWebViewReply) {
        const obj = Protobuf.DmWebViewReply.fromObject(data);
        return Protobuf.DmWebViewReply.encode(obj).finish();
    }

    static create(data: IDmWebViewReply) {
        return Protobuf.DmWebViewReply.create(data);
    }
}

export interface IDmWebViewReply {
    /** 弹幕总数 */
    count: number;
    /** 分片信息 */
    dmSge?: {
        /** 分片长度：毫秒 */
        pageSize: number;
        /** 分片总数 */
        total: number;
    };
    /** 屏蔽信息 */
    flag: {
        /** 屏蔽等级 */
        recFlag: number;
        /** 屏蔽开关 */
        recSwitch: number;
        /** 屏蔽词 */
        recText: string;
    };
    /** 代码/BAS弹幕URL */
    specialDms?: string[];
    /** 弹幕指令 */
    commandDms?: ICommandDm[];
    /** 弹幕设定 */
    dmSetting?: IDmSetting;
}

/** 指令弹幕 */
export interface ICommandDm {
    /** 弹幕id */
    id: number;
    /** 弹幕id字符串 */
    idStr: string;
    /** oid */
    oid: number;
    /** mid */
    mid: number;
    /** 弹幕指令 */
    command: string;
    /** 弹幕内容 */
    content: string;
    /** 弹幕位置 */
    progress: number;
    /** 创建时间 */
    ctime: string;
    /** 修改时间 */
    mtime: string;
    /** extra */
    extra: string;
    /** post接口数据 */
    type: number;
    /** post接口数据 */
    state: number;
}

/** 弹幕设置 */
export interface IDmSetting {
    dmSwitch: boolean;
    aiSwitch: boolean;
    aiLevel: number;
    blocktop: boolean;
    blockscroll: boolean;
    blockbottom: boolean;
    blockcolor: boolean;
    blockspecial: boolean;
    preventshade: boolean;
    dmask: boolean;
    opacity: number;
    dmarea: number;
    speedplus: number;
    fontsize: number;
    screensync: boolean;
    speedsync: boolean;
    fontfamily: string;
    bold: boolean;
    fontborder: string;
    drawType: string;
}