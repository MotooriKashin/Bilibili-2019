import { IRoomLeaveEvent } from "./RoomReq";
import { Protobuf } from ".";

export class RoomLeaveEvent {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.RoomLeaveEvent.decode(new Uint8Array(buffer));
        return <IRoomLeaveEvent>Protobuf.RoomLeaveEvent.toObject(msg);
    }

    static encode(data: IRoomLeaveEvent) {
        const obj = Protobuf.RoomLeaveEvent.fromObject(data);
        return Protobuf.RoomLeaveEvent.encode(obj).finish();
    }

    static create(data: IRoomLeaveEvent) {
        return Protobuf.RoomLeaveEvent.create(data);
    }
}