import { Protobuf } from ".";

export class AnyType {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.anyType.decode(new Uint8Array(buffer));
        return <IAnyType>Protobuf.anyType.toObject(msg);
    }

    static encode(data: object) {
        const obj = Protobuf.anyType.fromObject(data);
        return Protobuf.anyType.encode(obj).finish();
    }

    static create(data: object) {
        return Protobuf.anyType.create(data);
    }
}

export interface IAnyType {
    type_url: string;
    value: ArrayBuffer;
}