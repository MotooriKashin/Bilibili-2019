import { IAnyType } from "./AnyType";
import { Protobuf } from ".";

export class BroadcastFrame {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.BroadcastFrame.decode(new Uint8Array(buffer));
        return <IBroadcastFrame>Protobuf.BroadcastFrame.toObject(msg);
    }

    static encode(data: IBroadcastFrame) {
        const obj = Protobuf.BroadcastFrame.fromObject(data);
        return Protobuf.BroadcastFrame.encode(obj).finish();
    }

    static create(data: IBroadcastFrame) {
        return Protobuf.BroadcastFrame.create(data);
    }
}

const PACKAGE = '/bilibili.broadcast.v1';
const BROADCAST = '.Broadcast';
export enum PATH {
    /** 进行鉴权 */
    AUTH = `${PACKAGE + BROADCAST}/Auth`,
    /** 心跳发送和发送（如果有上行消息可不进行发心跳） */
    HEARTBEAT = `${PACKAGE + BROADCAST}/Heartbeat`,
    /** 订阅target_paths，可以订阅到对应的消息 */
    SUBSCRIBE = `${PACKAGE + BROADCAST}/Subscribe`,
    /** 取消订阅target_paths */
    UNSUBSCRIBE = `${PACKAGE + BROADCAST}/Unsubscribe`,
    /**  如果消息is_ack=true，sdk收到后进行ack */
    MSG_ACK = `${PACKAGE + BROADCAST}/MessageAck`,

    ENTER = `${PACKAGE}.BroadcastRoom/Enter`,

    ROOMREQ = `${PACKAGE}.RoomReq`,
    ROOMRES = `${PACKAGE}.RoomResp`,

    /** 进行鉴权响应 */
    AUTHREQ = `${PACKAGE}.AuthReq`,
    /** 订阅target_paths，响应 */
    TARGETPATH = `${PACKAGE}.TargetPath`,
    /** 心跳，响应 */
    HEARTBEATRES = `${PACKAGE}.HeartbeatResp`,
    /** 心跳，响应 */
    MSG_ACK_REQ = `${PACKAGE}.MessageAckReq`,
}

export interface IBroadcastFrame {
    options: IFrameOption;
    targetPath: PATH;
    body?: IAnyType;
}

interface IFrameOption {
    messageId?: number;
    sequence: number;
    isAck?: boolean;
    status?: IStatus;
    ackOrigin?: string;
}

export interface IStatus {
    code: number;
    message: string;
    details: any[];
}