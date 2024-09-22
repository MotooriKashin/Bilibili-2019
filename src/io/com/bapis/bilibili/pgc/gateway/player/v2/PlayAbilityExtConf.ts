// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/pgc/gateway/player/v2/PlayAbilityExtConf.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "bilibili.pgc.gateway.player.v2";

/** 云控扩展配置信息 */
export interface PlayAbilityExtConf {
  allowCloseSubtitle: boolean;
  freyaConfig: FreyaConfig | undefined;
  castTips: CastTips | undefined;
}

/** 放映室提示语 */
export interface FreyaConfig {
  desc: string;
  type: number;
  issuedCnt: number;
  isAlwaysShow: boolean;
  screenNumber: number;
  fullScreenNumber: number;
}

/** 投屏限制 */
export interface CastTips {
  /** 0 时为无限制, 否则表示不不允许投屏并提示message */
  code: number;
  /** 提示 */
  message: string;
}

function createBasePlayAbilityExtConf(): PlayAbilityExtConf {
  return { allowCloseSubtitle: false, freyaConfig: undefined, castTips: undefined };
}

export const PlayAbilityExtConf: MessageFns<PlayAbilityExtConf> = {
  encode(message: PlayAbilityExtConf, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.allowCloseSubtitle !== false) {
      writer.uint32(8).bool(message.allowCloseSubtitle);
    }
    if (message.freyaConfig !== undefined) {
      FreyaConfig.encode(message.freyaConfig, writer.uint32(18).fork()).join();
    }
    if (message.castTips !== undefined) {
      CastTips.encode(message.castTips, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayAbilityExtConf {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayAbilityExtConf();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.allowCloseSubtitle = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.freyaConfig = FreyaConfig.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.castTips = CastTips.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayAbilityExtConf {
    return {
      allowCloseSubtitle: isSet(object.allowCloseSubtitle) ? globalThis.Boolean(object.allowCloseSubtitle) : false,
      freyaConfig: isSet(object.freyaConfig) ? FreyaConfig.fromJSON(object.freyaConfig) : undefined,
      castTips: isSet(object.castTips) ? CastTips.fromJSON(object.castTips) : undefined,
    };
  },

  toJSON(message: PlayAbilityExtConf): unknown {
    const obj: any = {};
    if (message.allowCloseSubtitle !== false) {
      obj.allowCloseSubtitle = message.allowCloseSubtitle;
    }
    if (message.freyaConfig !== undefined) {
      obj.freyaConfig = FreyaConfig.toJSON(message.freyaConfig);
    }
    if (message.castTips !== undefined) {
      obj.castTips = CastTips.toJSON(message.castTips);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayAbilityExtConf>, I>>(base?: I): PlayAbilityExtConf {
    return PlayAbilityExtConf.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayAbilityExtConf>, I>>(object: I): PlayAbilityExtConf {
    const message = createBasePlayAbilityExtConf();
    message.allowCloseSubtitle = object.allowCloseSubtitle ?? false;
    message.freyaConfig = (object.freyaConfig !== undefined && object.freyaConfig !== null)
      ? FreyaConfig.fromPartial(object.freyaConfig)
      : undefined;
    message.castTips = (object.castTips !== undefined && object.castTips !== null)
      ? CastTips.fromPartial(object.castTips)
      : undefined;
    return message;
  },
};

function createBaseFreyaConfig(): FreyaConfig {
  return { desc: "", type: 0, issuedCnt: 0, isAlwaysShow: false, screenNumber: 0, fullScreenNumber: 0 };
}

export const FreyaConfig: MessageFns<FreyaConfig> = {
  encode(message: FreyaConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.desc !== "") {
      writer.uint32(10).string(message.desc);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.issuedCnt !== 0) {
      writer.uint32(24).int32(message.issuedCnt);
    }
    if (message.isAlwaysShow !== false) {
      writer.uint32(32).bool(message.isAlwaysShow);
    }
    if (message.screenNumber !== 0) {
      writer.uint32(40).int32(message.screenNumber);
    }
    if (message.fullScreenNumber !== 0) {
      writer.uint32(48).int32(message.fullScreenNumber);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FreyaConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFreyaConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.desc = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.issuedCnt = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.isAlwaysShow = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.screenNumber = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.fullScreenNumber = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FreyaConfig {
    return {
      desc: isSet(object.desc) ? globalThis.String(object.desc) : "",
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      issuedCnt: isSet(object.issuedCnt) ? globalThis.Number(object.issuedCnt) : 0,
      isAlwaysShow: isSet(object.isAlwaysShow) ? globalThis.Boolean(object.isAlwaysShow) : false,
      screenNumber: isSet(object.screenNumber) ? globalThis.Number(object.screenNumber) : 0,
      fullScreenNumber: isSet(object.fullScreenNumber) ? globalThis.Number(object.fullScreenNumber) : 0,
    };
  },

  toJSON(message: FreyaConfig): unknown {
    const obj: any = {};
    if (message.desc !== "") {
      obj.desc = message.desc;
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.issuedCnt !== 0) {
      obj.issuedCnt = Math.round(message.issuedCnt);
    }
    if (message.isAlwaysShow !== false) {
      obj.isAlwaysShow = message.isAlwaysShow;
    }
    if (message.screenNumber !== 0) {
      obj.screenNumber = Math.round(message.screenNumber);
    }
    if (message.fullScreenNumber !== 0) {
      obj.fullScreenNumber = Math.round(message.fullScreenNumber);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FreyaConfig>, I>>(base?: I): FreyaConfig {
    return FreyaConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FreyaConfig>, I>>(object: I): FreyaConfig {
    const message = createBaseFreyaConfig();
    message.desc = object.desc ?? "";
    message.type = object.type ?? 0;
    message.issuedCnt = object.issuedCnt ?? 0;
    message.isAlwaysShow = object.isAlwaysShow ?? false;
    message.screenNumber = object.screenNumber ?? 0;
    message.fullScreenNumber = object.fullScreenNumber ?? 0;
    return message;
  },
};

function createBaseCastTips(): CastTips {
  return { code: 0, message: "" };
}

export const CastTips: MessageFns<CastTips> = {
  encode(message: CastTips, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CastTips {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCastTips();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CastTips {
    return {
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
    };
  },

  toJSON(message: CastTips): unknown {
    const obj: any = {};
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CastTips>, I>>(base?: I): CastTips {
    return CastTips.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CastTips>, I>>(object: I): CastTips {
    const message = createBaseCastTips();
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
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