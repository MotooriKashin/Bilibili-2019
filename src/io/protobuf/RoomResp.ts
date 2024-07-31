import { IRoomJoinEvent, IRoomLeaveEvent, IRoomOnlineEvent, IRoomMessageEvent } from "./RoomReq";
import { Protobuf } from ".";

export class RoomResp {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.RoomResp.decode(new Uint8Array(buffer));
        return <IRoomResp>Protobuf.RoomResp.toObject(msg);
    }

    static encode(data: IRoomResp) {
        const obj = Protobuf.RoomResp.fromObject(data);
        return Protobuf.RoomResp.encode(obj).finish();
    }

    static create(data: IRoomResp) {
        return Protobuf.RoomResp.create(data);
    }
}

export interface IRoomResp {
    id: string;
    join: IRoomJoinEvent;
    leave: IRoomLeaveEvent;
    online: IRoomOnlineEvent;
    msg: IRoomMessageEvent;
}