import { IAnyType } from "./AnyType";
import { Protobuf } from ".";

export class RoomReq {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.RoomReq.decode(new Uint8Array(buffer));
        return <IRoomReq>Protobuf.RoomReq.toObject(msg);
    }

    static encode(data: IRoomReq) {
        const obj = Protobuf.RoomReq.fromObject(data);
        return Protobuf.RoomReq.encode(obj).finish();
    }

    static create(data: IRoomReq) {
        return Protobuf.RoomReq.create(data);
    }
}

interface IRoomReq {
    id: string;
    join?: IRoomJoinEvent;
    leave?: IRoomLeaveEvent;
    online?: IRoomOnlineEvent;
    msg?: IRoomMessageEvent;
}

export interface IRoomJoinEvent { }

export interface IRoomLeaveEvent { }

export interface IRoomOnlineEvent {
    online: number;
    allOnline: number;
}

export interface IRoomMessageEvent {
    targetPath: string;
    body: IAnyType;
}