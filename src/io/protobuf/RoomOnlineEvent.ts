import { Protobuf } from ".";
import { IRoomOnlineEvent } from "./RoomReq";

export class RoomOnlineEvent {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.RoomOnlineEvent.decode(new Uint8Array(buffer));
        return <IRoomOnlineEvent>Protobuf.RoomOnlineEvent.toObject(msg);
    }

    static encode(data: IRoomOnlineEvent) {
        const obj = Protobuf.RoomOnlineEvent.fromObject(data);
        return Protobuf.RoomOnlineEvent.encode(obj).finish();
    }

    static create(data: IRoomOnlineEvent) {
        return Protobuf.RoomOnlineEvent.create(data);
    }
}