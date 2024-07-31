import { Protobuf } from ".";
import { PATH } from "./BroadcastFrame";

export class MessageAckReq {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.MessageAckReq.decode(new Uint8Array(buffer));
        return <IMessageAckReq>Protobuf.MessageAckReq.toObject(msg);
    }

    static encode(data: IMessageAckReq) {
        const obj = Protobuf.MessageAckReq.fromObject(data);
        return Protobuf.MessageAckReq.encode(obj).finish();
    }

    static create(data: IMessageAckReq) {
        return Protobuf.MessageAckReq.create(data);
    }
}

interface IMessageAckReq {
    ackId?: number;
    ackOrigin?: string;
    targetPath: PATH;
}