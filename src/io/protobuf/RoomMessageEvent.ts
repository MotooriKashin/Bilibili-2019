import { Protobuf } from ".";
import { IRoomMessageEvent } from "./RoomReq";

export class RoomMessageEvent {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.RoomMessageEvent.decode(new Uint8Array(buffer));
        return <IRoomMessageEvent>Protobuf.RoomMessageEvent.toObject(msg);
    }

    static encode(data: IRoomMessageEvent) {
        const obj = Protobuf.RoomMessageEvent.fromObject(data);
        return Protobuf.RoomMessageEvent.encode(obj).finish();
    }

    static create(data: IRoomMessageEvent) {
        return Protobuf.RoomMessageEvent.create(data);
    }
}