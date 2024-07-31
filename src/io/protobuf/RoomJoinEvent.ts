import { IRoomJoinEvent } from "./RoomReq";
import { Protobuf } from ".";

export class RoomJoinEvent {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.RoomJoinEvent.decode(new Uint8Array(buffer));
        return <IRoomJoinEvent>Protobuf.RoomJoinEvent.toObject(msg);
    }

    static encode(data: IRoomJoinEvent) {
        const obj = Protobuf.RoomJoinEvent.fromObject(data);
        return Protobuf.RoomJoinEvent.encode(obj).finish();
    }

    static create(data: IRoomJoinEvent) {
        return Protobuf.RoomJoinEvent.create(data);
    }
}