// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/playershared/FragmentVideo.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { FragmentInfo } from "./Fragment";
import { BizType, bizTypeFromJSON, bizTypeToJSON, Dimension } from "./PlayArc";
import { PlayArcConf } from "./PlayArcConf";
import { VodInfo } from "./VodInfo";

export const protobufPackage = "bilibili.playershared";

export interface FragmentVideo {
  videos: FragmentVideoInfo[];
}

export interface FragmentVideoInfo {
  fragmentInfo: FragmentInfo | undefined;
  vodInfo: VodInfo | undefined;
  playArcConf: PlayArcConf | undefined;
  dimension: Dimension | undefined;
  timelength: bigint;
  videoType: BizType;
  playableStatus: boolean;
}

function createBaseFragmentVideo(): FragmentVideo {
  return { videos: [] };
}

export const FragmentVideo: MessageFns<FragmentVideo> = {
  encode(message: FragmentVideo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.videos) {
      FragmentVideoInfo.encode(v!, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FragmentVideo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFragmentVideo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.videos.push(FragmentVideoInfo.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FragmentVideo {
    return {
      videos: globalThis.Array.isArray(object?.videos)
        ? object.videos.map((e: any) => FragmentVideoInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: FragmentVideo): unknown {
    const obj: any = {};
    if (message.videos?.length) {
      obj.videos = message.videos.map((e) => FragmentVideoInfo.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FragmentVideo>, I>>(base?: I): FragmentVideo {
    return FragmentVideo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FragmentVideo>, I>>(object: I): FragmentVideo {
    const message = createBaseFragmentVideo();
    message.videos = object.videos?.map((e) => FragmentVideoInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFragmentVideoInfo(): FragmentVideoInfo {
  return {
    fragmentInfo: undefined,
    vodInfo: undefined,
    playArcConf: undefined,
    dimension: undefined,
    timelength: 0n,
    videoType: 0,
    playableStatus: false,
  };
}

export const FragmentVideoInfo: MessageFns<FragmentVideoInfo> = {
  encode(message: FragmentVideoInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.fragmentInfo !== undefined) {
      FragmentInfo.encode(message.fragmentInfo, writer.uint32(10).fork()).join();
    }
    if (message.vodInfo !== undefined) {
      VodInfo.encode(message.vodInfo, writer.uint32(18).fork()).join();
    }
    if (message.playArcConf !== undefined) {
      PlayArcConf.encode(message.playArcConf, writer.uint32(26).fork()).join();
    }
    if (message.dimension !== undefined) {
      Dimension.encode(message.dimension, writer.uint32(34).fork()).join();
    }
    if (message.timelength !== 0n) {
      if (BigInt.asIntN(64, message.timelength) !== message.timelength) {
        throw new globalThis.Error("value provided for field message.timelength of type int64 too large");
      }
      writer.uint32(40).int64(message.timelength);
    }
    if (message.videoType !== 0) {
      writer.uint32(48).int32(message.videoType);
    }
    if (message.playableStatus !== false) {
      writer.uint32(56).bool(message.playableStatus);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FragmentVideoInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFragmentVideoInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fragmentInfo = FragmentInfo.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.vodInfo = VodInfo.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.playArcConf = PlayArcConf.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.dimension = Dimension.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.timelength = reader.int64() as bigint;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.videoType = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.playableStatus = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FragmentVideoInfo {
    return {
      fragmentInfo: isSet(object.fragmentInfo) ? FragmentInfo.fromJSON(object.fragmentInfo) : undefined,
      vodInfo: isSet(object.vodInfo) ? VodInfo.fromJSON(object.vodInfo) : undefined,
      playArcConf: isSet(object.playArcConf) ? PlayArcConf.fromJSON(object.playArcConf) : undefined,
      dimension: isSet(object.dimension) ? Dimension.fromJSON(object.dimension) : undefined,
      timelength: isSet(object.timelength) ? BigInt(object.timelength) : 0n,
      videoType: isSet(object.videoType) ? bizTypeFromJSON(object.videoType) : 0,
      playableStatus: isSet(object.playableStatus) ? globalThis.Boolean(object.playableStatus) : false,
    };
  },

  toJSON(message: FragmentVideoInfo): unknown {
    const obj: any = {};
    if (message.fragmentInfo !== undefined) {
      obj.fragmentInfo = FragmentInfo.toJSON(message.fragmentInfo);
    }
    if (message.vodInfo !== undefined) {
      obj.vodInfo = VodInfo.toJSON(message.vodInfo);
    }
    if (message.playArcConf !== undefined) {
      obj.playArcConf = PlayArcConf.toJSON(message.playArcConf);
    }
    if (message.dimension !== undefined) {
      obj.dimension = Dimension.toJSON(message.dimension);
    }
    if (message.timelength !== 0n) {
      obj.timelength = message.timelength.toString();
    }
    if (message.videoType !== 0) {
      obj.videoType = bizTypeToJSON(message.videoType);
    }
    if (message.playableStatus !== false) {
      obj.playableStatus = message.playableStatus;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FragmentVideoInfo>, I>>(base?: I): FragmentVideoInfo {
    return FragmentVideoInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FragmentVideoInfo>, I>>(object: I): FragmentVideoInfo {
    const message = createBaseFragmentVideoInfo();
    message.fragmentInfo = (object.fragmentInfo !== undefined && object.fragmentInfo !== null)
      ? FragmentInfo.fromPartial(object.fragmentInfo)
      : undefined;
    message.vodInfo = (object.vodInfo !== undefined && object.vodInfo !== null)
      ? VodInfo.fromPartial(object.vodInfo)
      : undefined;
    message.playArcConf = (object.playArcConf !== undefined && object.playArcConf !== null)
      ? PlayArcConf.fromPartial(object.playArcConf)
      : undefined;
    message.dimension = (object.dimension !== undefined && object.dimension !== null)
      ? Dimension.fromPartial(object.dimension)
      : undefined;
    message.timelength = object.timelength ?? 0n;
    message.videoType = object.videoType ?? 0;
    message.playableStatus = object.playableStatus ?? false;
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