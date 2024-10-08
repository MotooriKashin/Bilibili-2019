// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/metadata/Restriction.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "bilibili.metadata.restriction";

/** 模式类型 */
export enum ModeType {
  /** NORMAL - 正常模式 */
  NORMAL = 0,
  /** TEENAGERS - 青少年模式 */
  TEENAGERS = 1,
  /** LESSONS - 课堂模式 */
  LESSONS = 2,
  BASIC = 3,
  UNRECOGNIZED = -1,
}

export function modeTypeFromJSON(object: any): ModeType {
  switch (object) {
    case 0:
    case "NORMAL":
      return ModeType.NORMAL;
    case 1:
    case "TEENAGERS":
      return ModeType.TEENAGERS;
    case 2:
    case "LESSONS":
      return ModeType.LESSONS;
    case 3:
    case "BASIC":
      return ModeType.BASIC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ModeType.UNRECOGNIZED;
  }
}

export function modeTypeToJSON(object: ModeType): string {
  switch (object) {
    case ModeType.NORMAL:
      return "NORMAL";
    case ModeType.TEENAGERS:
      return "TEENAGERS";
    case ModeType.LESSONS:
      return "LESSONS";
    case ModeType.BASIC:
      return "BASIC";
    case ModeType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** 限制条件 */
export interface Restriction {
  /** 青少年模式开关状态 */
  teenagersMode: boolean;
  /** 课堂模式开关状态 */
  lessonsMode: boolean;
  /**
   * 多种模式开关打开，根据互斥和优先级确认的最终模式
   * @deprecated 自app 5.60起废弃，由业务服务根据前两个模式计算
   */
  mode: ModeType;
  /** app 审核review状态，用于appstore/market审核时服务端返回数据过虑 */
  review: boolean;
  /** 客户端是否选择关闭个性化推荐 */
  disableRcmd: boolean;
  basicMode: boolean;
}

function createBaseRestriction(): Restriction {
  return { teenagersMode: false, lessonsMode: false, mode: 0, review: false, disableRcmd: false, basicMode: false };
}

export const Restriction: MessageFns<Restriction> = {
  encode(message: Restriction, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.teenagersMode !== false) {
      writer.uint32(8).bool(message.teenagersMode);
    }
    if (message.lessonsMode !== false) {
      writer.uint32(16).bool(message.lessonsMode);
    }
    if (message.mode !== 0) {
      writer.uint32(24).int32(message.mode);
    }
    if (message.review !== false) {
      writer.uint32(32).bool(message.review);
    }
    if (message.disableRcmd !== false) {
      writer.uint32(40).bool(message.disableRcmd);
    }
    if (message.basicMode !== false) {
      writer.uint32(48).bool(message.basicMode);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Restriction {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRestriction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.teenagersMode = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.lessonsMode = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.mode = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.review = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.disableRcmd = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.basicMode = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Restriction {
    return {
      teenagersMode: isSet(object.teenagersMode) ? globalThis.Boolean(object.teenagersMode) : false,
      lessonsMode: isSet(object.lessonsMode) ? globalThis.Boolean(object.lessonsMode) : false,
      mode: isSet(object.mode) ? modeTypeFromJSON(object.mode) : 0,
      review: isSet(object.review) ? globalThis.Boolean(object.review) : false,
      disableRcmd: isSet(object.disableRcmd) ? globalThis.Boolean(object.disableRcmd) : false,
      basicMode: isSet(object.basicMode) ? globalThis.Boolean(object.basicMode) : false,
    };
  },

  toJSON(message: Restriction): unknown {
    const obj: any = {};
    if (message.teenagersMode !== false) {
      obj.teenagersMode = message.teenagersMode;
    }
    if (message.lessonsMode !== false) {
      obj.lessonsMode = message.lessonsMode;
    }
    if (message.mode !== 0) {
      obj.mode = modeTypeToJSON(message.mode);
    }
    if (message.review !== false) {
      obj.review = message.review;
    }
    if (message.disableRcmd !== false) {
      obj.disableRcmd = message.disableRcmd;
    }
    if (message.basicMode !== false) {
      obj.basicMode = message.basicMode;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Restriction>, I>>(base?: I): Restriction {
    return Restriction.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Restriction>, I>>(object: I): Restriction {
    const message = createBaseRestriction();
    message.teenagersMode = object.teenagersMode ?? false;
    message.lessonsMode = object.lessonsMode ?? false;
    message.mode = object.mode ?? 0;
    message.review = object.review ?? false;
    message.disableRcmd = object.disableRcmd ?? false;
    message.basicMode = object.basicMode ?? false;
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
