// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/app/playerunite/v1/PlayViewUnite.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "../../../../google/protobuf/any";
import { Event } from "../../../playershared/Event";
import { Fragment } from "../../../playershared/Fragment";
import { FragmentVideo } from "../../../playershared/FragmentVideo";
import { History } from "../../../playershared/History";
import { PlayArc } from "../../../playershared/PlayArc";
import { PlayArcConf } from "../../../playershared/PlayArcConf";
import { PlayDeviceConf } from "../../../playershared/PlayDeviceConf";
import { QnTrialInfo } from "../../../playershared/QnTrialInfo";
import { VideoVod } from "../../../playershared/VideoVod";
import { ViewInfo } from "../../../playershared/ViewInfo";
import { VodInfo } from "../../../playershared/VodInfo";

export const protobufPackage = "bilibili.app.playerunite.v1";

/** 统一视频url */
export interface PlayViewUniteReq {
  /** 请求资源VOD信息 */
  vod: VideoVod | undefined;
  spmid: string;
  fromSpmid: string;
  /** 补充信息, 如ep_id等 */
  extraContent: { [key: string]: string };
  bvid?: string | undefined;
  adExtra?: string | undefined;
  fragment: Fragment | undefined;
  fromScene: string;
}

export interface PlayViewUniteReq_ExtraContentEntry {
  key: string;
  value: string;
}

/** 统一视频url */
export interface PlayViewUniteResp {
  /** 音视频流信息 */
  vodInfo: VodInfo | undefined;
  playArcConf: PlayArcConf | undefined;
  playDeviceConf: PlayDeviceConf | undefined;
  event?:
    | Event
    | undefined;
  /** 使用 pgcanymodel / ugcanymodel 进行proto any转换成对应业务码结构体 */
  supplement: Any | undefined;
  playArc: PlayArc | undefined;
  qnTrialInfo: QnTrialInfo | undefined;
  history: History | undefined;
  viewInfo: ViewInfo | undefined;
  fragmentVideo: FragmentVideo | undefined;
}

function createBasePlayViewUniteReq(): PlayViewUniteReq {
  return { vod: undefined, spmid: "", fromSpmid: "", extraContent: {}, fragment: undefined, fromScene: "" };
}

export const PlayViewUniteReq: MessageFns<PlayViewUniteReq> = {
  encode(message: PlayViewUniteReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.vod !== undefined) {
      VideoVod.encode(message.vod, writer.uint32(10).fork()).join();
    }
    if (message.spmid !== "") {
      writer.uint32(18).string(message.spmid);
    }
    if (message.fromSpmid !== "") {
      writer.uint32(26).string(message.fromSpmid);
    }
    Object.entries(message.extraContent).forEach(([key, value]) => {
      PlayViewUniteReq_ExtraContentEntry.encode({ key: key as any, value }, writer.uint32(34).fork()).join();
    });
    if (message.bvid !== undefined) {
      writer.uint32(42).string(message.bvid);
    }
    if (message.adExtra !== undefined) {
      writer.uint32(50).string(message.adExtra);
    }
    if (message.fragment !== undefined) {
      Fragment.encode(message.fragment, writer.uint32(58).fork()).join();
    }
    if (message.fromScene !== "") {
      writer.uint32(66).string(message.fromScene);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayViewUniteReq {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayViewUniteReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.vod = VideoVod.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.spmid = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.fromSpmid = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          const entry4 = PlayViewUniteReq_ExtraContentEntry.decode(reader, reader.uint32());
          if (entry4.value !== undefined) {
            message.extraContent[entry4.key] = entry4.value;
          }
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.bvid = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.adExtra = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.fragment = Fragment.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.fromScene = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayViewUniteReq {
    return {
      vod: isSet(object.vod) ? VideoVod.fromJSON(object.vod) : undefined,
      spmid: isSet(object.spmid) ? globalThis.String(object.spmid) : "",
      fromSpmid: isSet(object.fromSpmid) ? globalThis.String(object.fromSpmid) : "",
      extraContent: isObject(object.extraContent)
        ? Object.entries(object.extraContent).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      bvid: isSet(object.bvid) ? globalThis.String(object.bvid) : undefined,
      adExtra: isSet(object.adExtra) ? globalThis.String(object.adExtra) : undefined,
      fragment: isSet(object.fragment) ? Fragment.fromJSON(object.fragment) : undefined,
      fromScene: isSet(object.fromScene) ? globalThis.String(object.fromScene) : "",
    };
  },

  toJSON(message: PlayViewUniteReq): unknown {
    const obj: any = {};
    if (message.vod !== undefined) {
      obj.vod = VideoVod.toJSON(message.vod);
    }
    if (message.spmid !== "") {
      obj.spmid = message.spmid;
    }
    if (message.fromSpmid !== "") {
      obj.fromSpmid = message.fromSpmid;
    }
    if (message.extraContent) {
      const entries = Object.entries(message.extraContent);
      if (entries.length > 0) {
        obj.extraContent = {};
        entries.forEach(([k, v]) => {
          obj.extraContent[k] = v;
        });
      }
    }
    if (message.bvid !== undefined) {
      obj.bvid = message.bvid;
    }
    if (message.adExtra !== undefined) {
      obj.adExtra = message.adExtra;
    }
    if (message.fragment !== undefined) {
      obj.fragment = Fragment.toJSON(message.fragment);
    }
    if (message.fromScene !== "") {
      obj.fromScene = message.fromScene;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayViewUniteReq>, I>>(base?: I): PlayViewUniteReq {
    return PlayViewUniteReq.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayViewUniteReq>, I>>(object: I): PlayViewUniteReq {
    const message = createBasePlayViewUniteReq();
    message.vod = (object.vod !== undefined && object.vod !== null) ? VideoVod.fromPartial(object.vod) : undefined;
    message.spmid = object.spmid ?? "";
    message.fromSpmid = object.fromSpmid ?? "";
    message.extraContent = Object.entries(object.extraContent ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = globalThis.String(value);
        }
        return acc;
      },
      {},
    );
    message.bvid = object.bvid ?? undefined;
    message.adExtra = object.adExtra ?? undefined;
    message.fragment = (object.fragment !== undefined && object.fragment !== null)
      ? Fragment.fromPartial(object.fragment)
      : undefined;
    message.fromScene = object.fromScene ?? "";
    return message;
  },
};

function createBasePlayViewUniteReq_ExtraContentEntry(): PlayViewUniteReq_ExtraContentEntry {
  return { key: "", value: "" };
}

export const PlayViewUniteReq_ExtraContentEntry: MessageFns<PlayViewUniteReq_ExtraContentEntry> = {
  encode(message: PlayViewUniteReq_ExtraContentEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayViewUniteReq_ExtraContentEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayViewUniteReq_ExtraContentEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayViewUniteReq_ExtraContentEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: PlayViewUniteReq_ExtraContentEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayViewUniteReq_ExtraContentEntry>, I>>(
    base?: I,
  ): PlayViewUniteReq_ExtraContentEntry {
    return PlayViewUniteReq_ExtraContentEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayViewUniteReq_ExtraContentEntry>, I>>(
    object: I,
  ): PlayViewUniteReq_ExtraContentEntry {
    const message = createBasePlayViewUniteReq_ExtraContentEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePlayViewUniteResp(): PlayViewUniteResp {
  return {
    vodInfo: undefined,
    playArcConf: undefined,
    playDeviceConf: undefined,
    supplement: undefined,
    playArc: undefined,
    qnTrialInfo: undefined,
    history: undefined,
    viewInfo: undefined,
    fragmentVideo: undefined,
  };
}

export const PlayViewUniteResp: MessageFns<PlayViewUniteResp> = {
  encode(message: PlayViewUniteResp, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.vodInfo !== undefined) {
      VodInfo.encode(message.vodInfo, writer.uint32(10).fork()).join();
    }
    if (message.playArcConf !== undefined) {
      PlayArcConf.encode(message.playArcConf, writer.uint32(18).fork()).join();
    }
    if (message.playDeviceConf !== undefined) {
      PlayDeviceConf.encode(message.playDeviceConf, writer.uint32(26).fork()).join();
    }
    if (message.event !== undefined) {
      Event.encode(message.event, writer.uint32(34).fork()).join();
    }
    if (message.supplement !== undefined) {
      Any.encode(message.supplement, writer.uint32(42).fork()).join();
    }
    if (message.playArc !== undefined) {
      PlayArc.encode(message.playArc, writer.uint32(50).fork()).join();
    }
    if (message.qnTrialInfo !== undefined) {
      QnTrialInfo.encode(message.qnTrialInfo, writer.uint32(58).fork()).join();
    }
    if (message.history !== undefined) {
      History.encode(message.history, writer.uint32(66).fork()).join();
    }
    if (message.viewInfo !== undefined) {
      ViewInfo.encode(message.viewInfo, writer.uint32(74).fork()).join();
    }
    if (message.fragmentVideo !== undefined) {
      FragmentVideo.encode(message.fragmentVideo, writer.uint32(82).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PlayViewUniteResp {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlayViewUniteResp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.vodInfo = VodInfo.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.playArcConf = PlayArcConf.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.playDeviceConf = PlayDeviceConf.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.event = Event.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.supplement = Any.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.playArc = PlayArc.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.qnTrialInfo = QnTrialInfo.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.history = History.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.viewInfo = ViewInfo.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.fragmentVideo = FragmentVideo.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlayViewUniteResp {
    return {
      vodInfo: isSet(object.vodInfo) ? VodInfo.fromJSON(object.vodInfo) : undefined,
      playArcConf: isSet(object.playArcConf) ? PlayArcConf.fromJSON(object.playArcConf) : undefined,
      playDeviceConf: isSet(object.playDeviceConf) ? PlayDeviceConf.fromJSON(object.playDeviceConf) : undefined,
      event: isSet(object.event) ? Event.fromJSON(object.event) : undefined,
      supplement: isSet(object.supplement) ? Any.fromJSON(object.supplement) : undefined,
      playArc: isSet(object.playArc) ? PlayArc.fromJSON(object.playArc) : undefined,
      qnTrialInfo: isSet(object.qnTrialInfo) ? QnTrialInfo.fromJSON(object.qnTrialInfo) : undefined,
      history: isSet(object.history) ? History.fromJSON(object.history) : undefined,
      viewInfo: isSet(object.viewInfo) ? ViewInfo.fromJSON(object.viewInfo) : undefined,
      fragmentVideo: isSet(object.fragmentVideo) ? FragmentVideo.fromJSON(object.fragmentVideo) : undefined,
    };
  },

  toJSON(message: PlayViewUniteResp): unknown {
    const obj: any = {};
    if (message.vodInfo !== undefined) {
      obj.vodInfo = VodInfo.toJSON(message.vodInfo);
    }
    if (message.playArcConf !== undefined) {
      obj.playArcConf = PlayArcConf.toJSON(message.playArcConf);
    }
    if (message.playDeviceConf !== undefined) {
      obj.playDeviceConf = PlayDeviceConf.toJSON(message.playDeviceConf);
    }
    if (message.event !== undefined) {
      obj.event = Event.toJSON(message.event);
    }
    if (message.supplement !== undefined) {
      obj.supplement = Any.toJSON(message.supplement);
    }
    if (message.playArc !== undefined) {
      obj.playArc = PlayArc.toJSON(message.playArc);
    }
    if (message.qnTrialInfo !== undefined) {
      obj.qnTrialInfo = QnTrialInfo.toJSON(message.qnTrialInfo);
    }
    if (message.history !== undefined) {
      obj.history = History.toJSON(message.history);
    }
    if (message.viewInfo !== undefined) {
      obj.viewInfo = ViewInfo.toJSON(message.viewInfo);
    }
    if (message.fragmentVideo !== undefined) {
      obj.fragmentVideo = FragmentVideo.toJSON(message.fragmentVideo);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PlayViewUniteResp>, I>>(base?: I): PlayViewUniteResp {
    return PlayViewUniteResp.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PlayViewUniteResp>, I>>(object: I): PlayViewUniteResp {
    const message = createBasePlayViewUniteResp();
    message.vodInfo = (object.vodInfo !== undefined && object.vodInfo !== null)
      ? VodInfo.fromPartial(object.vodInfo)
      : undefined;
    message.playArcConf = (object.playArcConf !== undefined && object.playArcConf !== null)
      ? PlayArcConf.fromPartial(object.playArcConf)
      : undefined;
    message.playDeviceConf = (object.playDeviceConf !== undefined && object.playDeviceConf !== null)
      ? PlayDeviceConf.fromPartial(object.playDeviceConf)
      : undefined;
    message.event = (object.event !== undefined && object.event !== null) ? Event.fromPartial(object.event) : undefined;
    message.supplement = (object.supplement !== undefined && object.supplement !== null)
      ? Any.fromPartial(object.supplement)
      : undefined;
    message.playArc = (object.playArc !== undefined && object.playArc !== null)
      ? PlayArc.fromPartial(object.playArc)
      : undefined;
    message.qnTrialInfo = (object.qnTrialInfo !== undefined && object.qnTrialInfo !== null)
      ? QnTrialInfo.fromPartial(object.qnTrialInfo)
      : undefined;
    message.history = (object.history !== undefined && object.history !== null)
      ? History.fromPartial(object.history)
      : undefined;
    message.viewInfo = (object.viewInfo !== undefined && object.viewInfo !== null)
      ? ViewInfo.fromPartial(object.viewInfo)
      : undefined;
    message.fragmentVideo = (object.fragmentVideo !== undefined && object.fragmentVideo !== null)
      ? FragmentVideo.fromPartial(object.fragmentVideo)
      : undefined;
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

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
