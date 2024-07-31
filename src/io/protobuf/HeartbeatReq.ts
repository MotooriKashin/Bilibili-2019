import { Protobuf } from ".";

export class HeartbeatReq {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.HeartbeatReq.decode(new Uint8Array(buffer));
        return <IHeartbeatReq>Protobuf.HeartbeatReq.toObject(msg);
    }

    static encode(data: IHeartbeatReq) {
        const obj = Protobuf.HeartbeatReq.fromObject(data);
        return Protobuf.HeartbeatReq.encode(obj).finish();
    }

    static create(data: IHeartbeatReq) {
        return Protobuf.HeartbeatReq.create(data);
    }
}

interface IHeartbeatReq { }