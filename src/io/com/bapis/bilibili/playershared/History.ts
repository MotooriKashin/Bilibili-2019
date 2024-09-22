// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/playershared/History.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Toast } from "./Toast";

export const protobufPackage = "bilibili.playershared";

/** 播放历史 */
export interface History {
  currentVideo?: HistoryInfo | undefined;
  relatedVideo?: HistoryInfo | undefined;
}

export interface HistoryInfo {
  progress: bigint;
  lastPlayCid: bigint;
  toast: Toast | undefined;
  toastWithoutTime: Toast | undefined;
  lastPlayAid: bigint;
}

function createBaseHistory(): History {
  return {};
}

export const History: MessageFns<History> = {
  encode(message: History, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.currentVideo !== undefined) {
      HistoryInfo.encode(message.currentVideo, writer.uint32(10).fork()).join();
    }
    if (message.relatedVideo !== undefined) {
      HistoryInfo.encode(message.relatedVideo, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): History {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHistory();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.currentVideo = HistoryInfo.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.relatedVideo = HistoryInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): History {
    return {
      currentVideo: isSet(object.currentVideo) ? HistoryInfo.fromJSON(object.currentVideo) : undefined,
      relatedVideo: isSet(object.relatedVideo) ? HistoryInfo.fromJSON(object.relatedVideo) : undefined,
    };
  },

  toJSON(message: History): unknown {
    const obj: any = {};
    if (message.currentVideo !== undefined) {
      obj.currentVideo = HistoryInfo.toJSON(message.currentVideo);
    }
    if (message.relatedVideo !== undefined) {
      obj.relatedVideo = HistoryInfo.toJSON(message.relatedVideo);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<History>, I>>(base?: I): History {
    return History.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<History>, I>>(object: I): History {
    const message = createBaseHistory();
    message.currentVideo = (object.currentVideo !== undefined && object.currentVideo !== null)
      ? HistoryInfo.fromPartial(object.currentVideo)
      : undefined;
    message.relatedVideo = (object.relatedVideo !== undefined && object.relatedVideo !== null)
      ? HistoryInfo.fromPartial(object.relatedVideo)
      : undefined;
    return message;
  },
};

function createBaseHistoryInfo(): HistoryInfo {
  return { progress: 0n, lastPlayCid: 0n, toast: undefined, toastWithoutTime: undefined, lastPlayAid: 0n };
}

export const HistoryInfo: MessageFns<HistoryInfo> = {
  encode(message: HistoryInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.progress !== 0n) {
      if (BigInt.asIntN(64, message.progress) !== message.progress) {
        throw new globalThis.Error("value provided for field message.progress of type int64 too large");
      }
      writer.uint32(8).int64(message.progress);
    }
    if (message.lastPlayCid !== 0n) {
      if (BigInt.asIntN(64, message.lastPlayCid) !== message.lastPlayCid) {
        throw new globalThis.Error("value provided for field message.lastPlayCid of type int64 too large");
      }
      writer.uint32(16).int64(message.lastPlayCid);
    }
    if (message.toast !== undefined) {
      Toast.encode(message.toast, writer.uint32(26).fork()).join();
    }
    if (message.toastWithoutTime !== undefined) {
      Toast.encode(message.toastWithoutTime, writer.uint32(34).fork()).join();
    }
    if (message.lastPlayAid !== 0n) {
      if (BigInt.asIntN(64, message.lastPlayAid) !== message.lastPlayAid) {
        throw new globalThis.Error("value provided for field message.lastPlayAid of type int64 too large");
      }
      writer.uint32(40).int64(message.lastPlayAid);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): HistoryInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHistoryInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.progress = reader.int64() as bigint;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lastPlayCid = reader.int64() as bigint;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.toast = Toast.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.toastWithoutTime = Toast.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.lastPlayAid = reader.int64() as bigint;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): HistoryInfo {
    return {
      progress: isSet(object.progress) ? BigInt(object.progress) : 0n,
      lastPlayCid: isSet(object.lastPlayCid) ? BigInt(object.lastPlayCid) : 0n,
      toast: isSet(object.toast) ? Toast.fromJSON(object.toast) : undefined,
      toastWithoutTime: isSet(object.toastWithoutTime) ? Toast.fromJSON(object.toastWithoutTime) : undefined,
      lastPlayAid: isSet(object.lastPlayAid) ? BigInt(object.lastPlayAid) : 0n,
    };
  },

  toJSON(message: HistoryInfo): unknown {
    const obj: any = {};
    if (message.progress !== 0n) {
      obj.progress = message.progress.toString();
    }
    if (message.lastPlayCid !== 0n) {
      obj.lastPlayCid = message.lastPlayCid.toString();
    }
    if (message.toast !== undefined) {
      obj.toast = Toast.toJSON(message.toast);
    }
    if (message.toastWithoutTime !== undefined) {
      obj.toastWithoutTime = Toast.toJSON(message.toastWithoutTime);
    }
    if (message.lastPlayAid !== 0n) {
      obj.lastPlayAid = message.lastPlayAid.toString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HistoryInfo>, I>>(base?: I): HistoryInfo {
    return HistoryInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HistoryInfo>, I>>(object: I): HistoryInfo {
    const message = createBaseHistoryInfo();
    message.progress = object.progress ?? 0n;
    message.lastPlayCid = object.lastPlayCid ?? 0n;
    message.toast = (object.toast !== undefined && object.toast !== null) ? Toast.fromPartial(object.toast) : undefined;
    message.toastWithoutTime = (object.toastWithoutTime !== undefined && object.toastWithoutTime !== null)
      ? Toast.fromPartial(object.toastWithoutTime)
      : undefined;
    message.lastPlayAid = object.lastPlayAid ?? 0n;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
