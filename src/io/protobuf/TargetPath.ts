import { Protobuf } from ".";

export class TargetPath {

    static decode(buffer: ArrayBuffer) {
        const msg = Protobuf.TargetPath.decode(new Uint8Array(buffer));
        return <ITargetPath>Protobuf.TargetPath.toObject(msg);
    }

    static encode(data: ITargetPath) {
        const obj = Protobuf.TargetPath.fromObject(data);
        return Protobuf.TargetPath.encode(obj).finish();
    }

    static create(data: ITargetPath) {
        return Protobuf.TargetPath.create(data);
    }
}

interface ITargetPath {
    targetPaths: string[];
}