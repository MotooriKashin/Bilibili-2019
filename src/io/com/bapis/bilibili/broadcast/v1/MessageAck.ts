// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/broadcast/v1/MessageAck.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "bilibili.broadcast.v1";

/** 消息回执 */
export interface MessageAckReq {
  /** 消息id */
  ackId: bigint;
  /** ack来源，由业务指定用于埋点跟踪 */
  ackOrigin: string;
  /** 消息对应的target_path，方便业务区分和监控统计 */
  targetPath: string;
}

function createBaseMessageAckReq(): MessageAckReq {
  return { ackId: 0n, ackOrigin: "", targetPath: "" };
}

export const MessageAckReq: MessageFns<MessageAckReq> = {
  encode(message: MessageAckReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.ackId !== 0n) {
      if (BigInt.asIntN(64, message.ackId) !== message.ackId) {
        throw new globalThis.Error("value provided for field message.ackId of type int64 too large");
      }
      writer.uint32(8).int64(message.ackId);
    }
    if (message.ackOrigin !== "") {
      writer.uint32(18).string(message.ackOrigin);
    }
    if (message.targetPath !== "") {
      writer.uint32(26).string(message.targetPath);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MessageAckReq {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageAckReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.ackId = reader.int64() as bigint;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ackOrigin = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.targetPath = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageAckReq {
    return {
      ackId: isSet(object.ackId) ? BigInt(object.ackId) : 0n,
      ackOrigin: isSet(object.ackOrigin) ? globalThis.String(object.ackOrigin) : "",
      targetPath: isSet(object.targetPath) ? globalThis.String(object.targetPath) : "",
    };
  },

  toJSON(message: MessageAckReq): unknown {
    const obj: any = {};
    if (message.ackId !== 0n) {
      obj.ackId = message.ackId.toString();
    }
    if (message.ackOrigin !== "") {
      obj.ackOrigin = message.ackOrigin;
    }
    if (message.targetPath !== "") {
      obj.targetPath = message.targetPath;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageAckReq>, I>>(base?: I): MessageAckReq {
    return MessageAckReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MessageAckReq>, I>>(object: I): MessageAckReq {
    const message = createBaseMessageAckReq();
    message.ackId = object.ackId ?? 0n;
    message.ackOrigin = object.ackOrigin ?? "";
    message.targetPath = object.targetPath ?? "";
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
