// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/playershared/VideoVod.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "bilibili.playershared";

/** 视频编码 */
export enum CodeType {
  /** NOCODE - 不指定 */
  NOCODE = 0,
  /** CODE264 - H264 */
  CODE264 = 1,
  /** CODE265 - H265 */
  CODE265 = 2,
  /** CODEAV1 - AV1 */
  CODEAV1 = 3,
  UNRECOGNIZED = -1,
}

export function codeTypeFromJSON(object: any): CodeType {
  switch (object) {
    case 0:
    case "NOCODE":
      return CodeType.NOCODE;
    case 1:
    case "CODE264":
      return CodeType.CODE264;
    case 2:
    case "CODE265":
      return CodeType.CODE265;
    case 3:
    case "CODEAV1":
      return CodeType.CODEAV1;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CodeType.UNRECOGNIZED;
  }
}

export function codeTypeToJSON(object: CodeType): string {
  switch (object) {
    case CodeType.NOCODE:
      return "NOCODE";
    case CodeType.CODE264:
      return "CODE264";
    case CodeType.CODE265:
      return "CODE265";
    case CodeType.CODEAV1:
      return "CODEAV1";
    case CodeType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** 播放页信息-请求: 音视频VOD */
export interface VideoVod {
  /** 视频aid */
  aid: number;
  /** 视频cid */
  cid: number;
  /** 清晰度 */
  qn: bigint;
  /** 视频流版本 */
  fnver?:
    | number
    | undefined;
  /** 视频流格式 */
  fnval: number;
  /**
   * 下载模式
   * | 0 | 1 | 2 |
   * | :-: | :-: | :-: |
   * | 播放 | flv下载 | dash下载 |
   */
  download?:
    | number
    | undefined;
  /**
   * 流url是否强制用域名
   * | 0 | 1 | 2 |
   * | :-: | :-: | :-: |
   * | 允许使用 | 使用http | 使用https |
   */
  forceHost: number;
  /** 是否4K */
  fourk?:
    | boolean
    | undefined;
  /** 视频编码 */
  preferCodecType: CodeType;
  /** 响度均衡 */
  voiceBalance?:
    | bigint
    | undefined;
  /** 大会员清晰度试用 */
  qnTrial?: number | undefined;
}

function createBaseVideoVod(): VideoVod {
  return { aid: 0, cid: 0, qn: 0n, fnval: 0, forceHost: 0, preferCodecType: 0 };
}

export const VideoVod: MessageFns<VideoVod> = {
  encode(message: VideoVod, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.aid !== 0) {
      writer.uint32(8).int32(message.aid);
    }
    if (message.cid !== 0) {
      writer.uint32(16).int32(message.cid);
    }
    if (message.qn !== 0n) {
      if (BigInt.asUintN(64, message.qn) !== message.qn) {
        throw new globalThis.Error("value provided for field message.qn of type uint64 too large");
      }
      writer.uint32(24).uint64(message.qn);
    }
    if (message.fnver !== undefined) {
      writer.uint32(32).int32(message.fnver);
    }
    if (message.fnval !== 0) {
      writer.uint32(40).int32(message.fnval);
    }
    if (message.download !== undefined) {
      writer.uint32(48).uint32(message.download);
    }
    if (message.forceHost !== 0) {
      writer.uint32(56).int32(message.forceHost);
    }
    if (message.fourk !== undefined) {
      writer.uint32(64).bool(message.fourk);
    }
    if (message.preferCodecType !== 0) {
      writer.uint32(72).int32(message.preferCodecType);
    }
    if (message.voiceBalance !== undefined) {
      if (BigInt.asUintN(64, message.voiceBalance) !== message.voiceBalance) {
        throw new globalThis.Error("value provided for field message.voiceBalance of type uint64 too large");
      }
      writer.uint32(80).uint64(message.voiceBalance);
    }
    if (message.qnTrial !== undefined) {
      writer.uint32(88).int32(message.qnTrial);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VideoVod {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoVod();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.aid = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.cid = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.qn = reader.uint64() as bigint;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.fnver = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.fnval = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.download = reader.uint32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.forceHost = reader.int32();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.fourk = reader.bool();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.preferCodecType = reader.int32() as any;
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.voiceBalance = reader.uint64() as bigint;
          continue;
        case 11:
          if (tag !== 88) {
            break;
          }

          message.qnTrial = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VideoVod {
    return {
      aid: isSet(object.aid) ? globalThis.Number(object.aid) : 0,
      cid: isSet(object.cid) ? globalThis.Number(object.cid) : 0,
      qn: isSet(object.qn) ? BigInt(object.qn) : 0n,
      fnver: isSet(object.fnver) ? globalThis.Number(object.fnver) : undefined,
      fnval: isSet(object.fnval) ? globalThis.Number(object.fnval) : 0,
      download: isSet(object.download) ? globalThis.Number(object.download) : undefined,
      forceHost: isSet(object.forceHost) ? globalThis.Number(object.forceHost) : 0,
      fourk: isSet(object.fourk) ? globalThis.Boolean(object.fourk) : undefined,
      preferCodecType: isSet(object.preferCodecType) ? codeTypeFromJSON(object.preferCodecType) : 0,
      voiceBalance: isSet(object.voiceBalance) ? BigInt(object.voiceBalance) : undefined,
      qnTrial: isSet(object.qnTrial) ? globalThis.Number(object.qnTrial) : undefined,
    };
  },

  toJSON(message: VideoVod): unknown {
    const obj: any = {};
    if (message.aid !== 0) {
      obj.aid = Math.round(message.aid);
    }
    if (message.cid !== 0) {
      obj.cid = Math.round(message.cid);
    }
    if (message.qn !== 0n) {
      obj.qn = message.qn.toString();
    }
    if (message.fnver !== undefined) {
      obj.fnver = Math.round(message.fnver);
    }
    if (message.fnval !== 0) {
      obj.fnval = Math.round(message.fnval);
    }
    if (message.download !== undefined) {
      obj.download = Math.round(message.download);
    }
    if (message.forceHost !== 0) {
      obj.forceHost = Math.round(message.forceHost);
    }
    if (message.fourk !== undefined) {
      obj.fourk = message.fourk;
    }
    if (message.preferCodecType !== 0) {
      obj.preferCodecType = codeTypeToJSON(message.preferCodecType);
    }
    if (message.voiceBalance !== undefined) {
      obj.voiceBalance = message.voiceBalance.toString();
    }
    if (message.qnTrial !== undefined) {
      obj.qnTrial = Math.round(message.qnTrial);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VideoVod>, I>>(base?: I): VideoVod {
    return VideoVod.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VideoVod>, I>>(object: I): VideoVod {
    const message = createBaseVideoVod();
    message.aid = object.aid ?? 0;
    message.cid = object.cid ?? 0;
    message.qn = object.qn ?? 0n;
    message.fnver = object.fnver ?? undefined;
    message.fnval = object.fnval ?? 0;
    message.download = object.download ?? undefined;
    message.forceHost = object.forceHost ?? 0;
    message.fourk = object.fourk ?? undefined;
    message.preferCodecType = object.preferCodecType ?? 0;
    message.voiceBalance = object.voiceBalance ?? undefined;
    message.qnTrial = object.qnTrial ?? undefined;
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