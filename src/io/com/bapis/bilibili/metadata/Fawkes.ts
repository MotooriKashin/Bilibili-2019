// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/metadata/Fawkes.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "bilibili.metadata.fawkes";

/** 设备 Fawkes 信息 */
export interface FawkesReq {
  /** 客户端在fawkes系统的唯一名 */
  appkey: string;
  /** 客户端在fawkes系统中的环境参数 */
  env: string;
  /** 启动id */
  sessionId: string;
}

/** 设备 Fawkes 信息 */
export interface FawkesReply {
  /** 客户端在fawkes系统中对应的已发布最新的config版本号 */
  config: string;
  /** 客户端在fawkes系统中对应的已发布最新的ff版本号 */
  ff: string;
}

function createBaseFawkesReq(): FawkesReq {
  return { appkey: "", env: "", sessionId: "" };
}

export const FawkesReq: MessageFns<FawkesReq> = {
  encode(message: FawkesReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.appkey !== "") {
      writer.uint32(10).string(message.appkey);
    }
    if (message.env !== "") {
      writer.uint32(18).string(message.env);
    }
    if (message.sessionId !== "") {
      writer.uint32(26).string(message.sessionId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FawkesReq {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFawkesReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.appkey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.env = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.sessionId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FawkesReq {
    return {
      appkey: isSet(object.appkey) ? globalThis.String(object.appkey) : "",
      env: isSet(object.env) ? globalThis.String(object.env) : "",
      sessionId: isSet(object.sessionId) ? globalThis.String(object.sessionId) : "",
    };
  },

  toJSON(message: FawkesReq): unknown {
    const obj: any = {};
    if (message.appkey !== "") {
      obj.appkey = message.appkey;
    }
    if (message.env !== "") {
      obj.env = message.env;
    }
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FawkesReq>, I>>(base?: I): FawkesReq {
    return FawkesReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FawkesReq>, I>>(object: I): FawkesReq {
    const message = createBaseFawkesReq();
    message.appkey = object.appkey ?? "";
    message.env = object.env ?? "";
    message.sessionId = object.sessionId ?? "";
    return message;
  },
};

function createBaseFawkesReply(): FawkesReply {
  return { config: "", ff: "" };
}

export const FawkesReply: MessageFns<FawkesReply> = {
  encode(message: FawkesReply, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.config !== "") {
      writer.uint32(10).string(message.config);
    }
    if (message.ff !== "") {
      writer.uint32(18).string(message.ff);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FawkesReply {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFawkesReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.config = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ff = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FawkesReply {
    return {
      config: isSet(object.config) ? globalThis.String(object.config) : "",
      ff: isSet(object.ff) ? globalThis.String(object.ff) : "",
    };
  },

  toJSON(message: FawkesReply): unknown {
    const obj: any = {};
    if (message.config !== "") {
      obj.config = message.config;
    }
    if (message.ff !== "") {
      obj.ff = message.ff;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FawkesReply>, I>>(base?: I): FawkesReply {
    return FawkesReply.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FawkesReply>, I>>(object: I): FawkesReply {
    const message = createBaseFawkesReply();
    message.config = object.config ?? "";
    message.ff = object.ff ?? "";
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