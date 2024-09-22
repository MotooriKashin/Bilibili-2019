// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/pgc/gateway/player/v2/PlayExtInfo.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "bilibili.pgc.gateway.player.v2";

/** 播放扩展信息 */
export interface PlayExtInfo {
  /** 播放配音信息 */
  playDubbingInfo: PlayDubbingInfo | undefined;
}

/** 播放配音信息 */
export interface PlayDubbingInfo {
  /** 背景音频 */
  backgroundAudio:
    | AudioMaterialProto
    | undefined;
  /** 角色音频列表 */
  roleAudioList: RoleAudioProto[];
  /** 引导文本 */
  guideText: string;
}

export interface AudioMaterialProto {
  audioId: string;
  title: string;
  edition: string;
  personId: bigint;
  personName: string;
  personAvatar: string;
  audio: DashItem[];
}

/** dash条目 */
export interface DashItem {
  /** 清晰度 */
  id: number;
  /** 主线流 */
  baseUrl: string;
  /** 备用流 */
  backupUrl: string[];
  /** 带宽 */
  bandwidth: number;
  /** 编码id */
  codecid: number;
  /** md5 */
  md5: string;
  /** 视频大小 */
  size: bigint;
  /** 帧率 */
  frameRate: string;
  /** DRM widevine 密钥 */
  widevinePssh: string;
}

/** 角色配音信息 */
export interface RoleAudioProto {
  /** 角色ID */
  roleId: bigint;
  /** 角色名称 */
  roleName: string;
  /** 角色头像 */
  roleAvatar: string;
  /** 音频素材列表 */
  audioMaterialList: AudioMaterialProto[];
}

function createBasePlayExtInfo(): PlayExtInfo {
  return { playDubbingInfo: undefined };
}

export const PlayExtInfo: MessageFns<PlayExtInfo> = {
  encode(message: PlayExtInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.playDubbingInfo !== undefined) {
      PlayDubbingInfo.encode(message.playDubbingInfo, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayExtInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayExtInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.playDubbingInfo = PlayDubbingInfo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayExtInfo {
    return {
      playDubbingInfo: isSet(object.playDubbingInfo) ? PlayDubbingInfo.fromJSON(object.playDubbingInfo) : undefined,
    };
  },

  toJSON(message: PlayExtInfo): unknown {
    const obj: any = {};
    if (message.playDubbingInfo !== undefined) {
      obj.playDubbingInfo = PlayDubbingInfo.toJSON(message.playDubbingInfo);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayExtInfo>, I>>(base?: I): PlayExtInfo {
    return PlayExtInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayExtInfo>, I>>(object: I): PlayExtInfo {
    const message = createBasePlayExtInfo();
    message.playDubbingInfo = (object.playDubbingInfo !== undefined && object.playDubbingInfo !== null)
      ? PlayDubbingInfo.fromPartial(object.playDubbingInfo)
      : undefined;
    return message;
  },
};

function createBasePlayDubbingInfo(): PlayDubbingInfo {
  return { backgroundAudio: undefined, roleAudioList: [], guideText: "" };
}

export const PlayDubbingInfo: MessageFns<PlayDubbingInfo> = {
  encode(message: PlayDubbingInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.backgroundAudio !== undefined) {
      AudioMaterialProto.encode(message.backgroundAudio, writer.uint32(10).fork()).join();
    }
    for (const v of message.roleAudioList) {
      RoleAudioProto.encode(v!, writer.uint32(18).fork()).join();
    }
    if (message.guideText !== "") {
      writer.uint32(26).string(message.guideText);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayDubbingInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayDubbingInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.backgroundAudio = AudioMaterialProto.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.roleAudioList.push(RoleAudioProto.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.guideText = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayDubbingInfo {
    return {
      backgroundAudio: isSet(object.backgroundAudio) ? AudioMaterialProto.fromJSON(object.backgroundAudio) : undefined,
      roleAudioList: globalThis.Array.isArray(object?.roleAudioList)
        ? object.roleAudioList.map((e: any) => RoleAudioProto.fromJSON(e))
        : [],
      guideText: isSet(object.guideText) ? globalThis.String(object.guideText) : "",
    };
  },

  toJSON(message: PlayDubbingInfo): unknown {
    const obj: any = {};
    if (message.backgroundAudio !== undefined) {
      obj.backgroundAudio = AudioMaterialProto.toJSON(message.backgroundAudio);
    }
    if (message.roleAudioList?.length) {
      obj.roleAudioList = message.roleAudioList.map((e) => RoleAudioProto.toJSON(e));
    }
    if (message.guideText !== "") {
      obj.guideText = message.guideText;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayDubbingInfo>, I>>(base?: I): PlayDubbingInfo {
    return PlayDubbingInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayDubbingInfo>, I>>(object: I): PlayDubbingInfo {
    const message = createBasePlayDubbingInfo();
    message.backgroundAudio = (object.backgroundAudio !== undefined && object.backgroundAudio !== null)
      ? AudioMaterialProto.fromPartial(object.backgroundAudio)
      : undefined;
    message.roleAudioList = object.roleAudioList?.map((e) => RoleAudioProto.fromPartial(e)) || [];
    message.guideText = object.guideText ?? "";
    return message;
  },
};

function createBaseAudioMaterialProto(): AudioMaterialProto {
  return { audioId: "", title: "", edition: "", personId: 0n, personName: "", personAvatar: "", audio: [] };
}

export const AudioMaterialProto: MessageFns<AudioMaterialProto> = {
  encode(message: AudioMaterialProto, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.audioId !== "") {
      writer.uint32(10).string(message.audioId);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.edition !== "") {
      writer.uint32(26).string(message.edition);
    }
    if (message.personId !== 0n) {
      if (BigInt.asUintN(64, message.personId) !== message.personId) {
        throw new globalThis.Error("value provided for field message.personId of type uint64 too large");
      }
      writer.uint32(32).uint64(message.personId);
    }
    if (message.personName !== "") {
      writer.uint32(42).string(message.personName);
    }
    if (message.personAvatar !== "") {
      writer.uint32(50).string(message.personAvatar);
    }
    for (const v of message.audio) {
      DashItem.encode(v!, writer.uint32(58).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AudioMaterialProto {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAudioMaterialProto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.audioId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.title = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.edition = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.personId = reader.uint64() as bigint;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.personName = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.personAvatar = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.audio.push(DashItem.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AudioMaterialProto {
    return {
      audioId: isSet(object.audioId) ? globalThis.String(object.audioId) : "",
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      edition: isSet(object.edition) ? globalThis.String(object.edition) : "",
      personId: isSet(object.personId) ? BigInt(object.personId) : 0n,
      personName: isSet(object.personName) ? globalThis.String(object.personName) : "",
      personAvatar: isSet(object.personAvatar) ? globalThis.String(object.personAvatar) : "",
      audio: globalThis.Array.isArray(object?.audio) ? object.audio.map((e: any) => DashItem.fromJSON(e)) : [],
    };
  },

  toJSON(message: AudioMaterialProto): unknown {
    const obj: any = {};
    if (message.audioId !== "") {
      obj.audioId = message.audioId;
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.edition !== "") {
      obj.edition = message.edition;
    }
    if (message.personId !== 0n) {
      obj.personId = message.personId.toString();
    }
    if (message.personName !== "") {
      obj.personName = message.personName;
    }
    if (message.personAvatar !== "") {
      obj.personAvatar = message.personAvatar;
    }
    if (message.audio?.length) {
      obj.audio = message.audio.map((e) => DashItem.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AudioMaterialProto>, I>>(base?: I): AudioMaterialProto {
    return AudioMaterialProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AudioMaterialProto>, I>>(object: I): AudioMaterialProto {
    const message = createBaseAudioMaterialProto();
    message.audioId = object.audioId ?? "";
    message.title = object.title ?? "";
    message.edition = object.edition ?? "";
    message.personId = object.personId ?? 0n;
    message.personName = object.personName ?? "";
    message.personAvatar = object.personAvatar ?? "";
    message.audio = object.audio?.map((e) => DashItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDashItem(): DashItem {
  return {
    id: 0,
    baseUrl: "",
    backupUrl: [],
    bandwidth: 0,
    codecid: 0,
    md5: "",
    size: 0n,
    frameRate: "",
    widevinePssh: "",
  };
}

export const DashItem: MessageFns<DashItem> = {
  encode(message: DashItem, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).uint32(message.id);
    }
    if (message.baseUrl !== "") {
      writer.uint32(18).string(message.baseUrl);
    }
    for (const v of message.backupUrl) {
      writer.uint32(26).string(v!);
    }
    if (message.bandwidth !== 0) {
      writer.uint32(32).uint32(message.bandwidth);
    }
    if (message.codecid !== 0) {
      writer.uint32(40).uint32(message.codecid);
    }
    if (message.md5 !== "") {
      writer.uint32(50).string(message.md5);
    }
    if (message.size !== 0n) {
      if (BigInt.asUintN(64, message.size) !== message.size) {
        throw new globalThis.Error("value provided for field message.size of type uint64 too large");
      }
      writer.uint32(56).uint64(message.size);
    }
    if (message.frameRate !== "") {
      writer.uint32(66).string(message.frameRate);
    }
    if (message.widevinePssh !== "") {
      writer.uint32(74).string(message.widevinePssh);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DashItem {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDashItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.id = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.baseUrl = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.backupUrl.push(reader.string());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.bandwidth = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.codecid = reader.uint32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.md5 = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.size = reader.uint64() as bigint;
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.frameRate = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.widevinePssh = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DashItem {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      baseUrl: isSet(object.baseUrl) ? globalThis.String(object.baseUrl) : "",
      backupUrl: globalThis.Array.isArray(object?.backupUrl)
        ? object.backupUrl.map((e: any) => globalThis.String(e))
        : [],
      bandwidth: isSet(object.bandwidth) ? globalThis.Number(object.bandwidth) : 0,
      codecid: isSet(object.codecid) ? globalThis.Number(object.codecid) : 0,
      md5: isSet(object.md5) ? globalThis.String(object.md5) : "",
      size: isSet(object.size) ? BigInt(object.size) : 0n,
      frameRate: isSet(object.frameRate) ? globalThis.String(object.frameRate) : "",
      widevinePssh: isSet(object.widevinePssh) ? globalThis.String(object.widevinePssh) : "",
    };
  },

  toJSON(message: DashItem): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.baseUrl !== "") {
      obj.baseUrl = message.baseUrl;
    }
    if (message.backupUrl?.length) {
      obj.backupUrl = message.backupUrl;
    }
    if (message.bandwidth !== 0) {
      obj.bandwidth = Math.round(message.bandwidth);
    }
    if (message.codecid !== 0) {
      obj.codecid = Math.round(message.codecid);
    }
    if (message.md5 !== "") {
      obj.md5 = message.md5;
    }
    if (message.size !== 0n) {
      obj.size = message.size.toString();
    }
    if (message.frameRate !== "") {
      obj.frameRate = message.frameRate;
    }
    if (message.widevinePssh !== "") {
      obj.widevinePssh = message.widevinePssh;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DashItem>, I>>(base?: I): DashItem {
    return DashItem.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DashItem>, I>>(object: I): DashItem {
    const message = createBaseDashItem();
    message.id = object.id ?? 0;
    message.baseUrl = object.baseUrl ?? "";
    message.backupUrl = object.backupUrl?.map((e) => e) || [];
    message.bandwidth = object.bandwidth ?? 0;
    message.codecid = object.codecid ?? 0;
    message.md5 = object.md5 ?? "";
    message.size = object.size ?? 0n;
    message.frameRate = object.frameRate ?? "";
    message.widevinePssh = object.widevinePssh ?? "";
    return message;
  },
};

function createBaseRoleAudioProto(): RoleAudioProto {
  return { roleId: 0n, roleName: "", roleAvatar: "", audioMaterialList: [] };
}

export const RoleAudioProto: MessageFns<RoleAudioProto> = {
  encode(message: RoleAudioProto, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.roleId !== 0n) {
      if (BigInt.asIntN(64, message.roleId) !== message.roleId) {
        throw new globalThis.Error("value provided for field message.roleId of type int64 too large");
      }
      writer.uint32(8).int64(message.roleId);
    }
    if (message.roleName !== "") {
      writer.uint32(18).string(message.roleName);
    }
    if (message.roleAvatar !== "") {
      writer.uint32(26).string(message.roleAvatar);
    }
    for (const v of message.audioMaterialList) {
      AudioMaterialProto.encode(v!, writer.uint32(34).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RoleAudioProto {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoleAudioProto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.roleId = reader.int64() as bigint;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.roleName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.roleAvatar = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.audioMaterialList.push(AudioMaterialProto.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RoleAudioProto {
    return {
      roleId: isSet(object.roleId) ? BigInt(object.roleId) : 0n,
      roleName: isSet(object.roleName) ? globalThis.String(object.roleName) : "",
      roleAvatar: isSet(object.roleAvatar) ? globalThis.String(object.roleAvatar) : "",
      audioMaterialList: globalThis.Array.isArray(object?.audioMaterialList)
        ? object.audioMaterialList.map((e: any) => AudioMaterialProto.fromJSON(e))
        : [],
    };
  },

  toJSON(message: RoleAudioProto): unknown {
    const obj: any = {};
    if (message.roleId !== 0n) {
      obj.roleId = message.roleId.toString();
    }
    if (message.roleName !== "") {
      obj.roleName = message.roleName;
    }
    if (message.roleAvatar !== "") {
      obj.roleAvatar = message.roleAvatar;
    }
    if (message.audioMaterialList?.length) {
      obj.audioMaterialList = message.audioMaterialList.map((e) => AudioMaterialProto.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RoleAudioProto>, I>>(base?: I): RoleAudioProto {
    return RoleAudioProto.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RoleAudioProto>, I>>(object: I): RoleAudioProto {
    const message = createBaseRoleAudioProto();
    message.roleId = object.roleId ?? 0n;
    message.roleName = object.roleName ?? "";
    message.roleAvatar = object.roleAvatar ?? "";
    message.audioMaterialList = object.audioMaterialList?.map((e) => AudioMaterialProto.fromPartial(e)) || [];
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