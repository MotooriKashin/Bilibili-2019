// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/bilibili/playershared/Event.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "bilibili.playershared";

/** 事件 */
export interface Event {
  /** 震动 */
  shake: Shake | undefined;
}

/** 震动 */
export interface Shake {
  file: string;
}

function createBaseEvent(): Event {
  return { shake: undefined };
}

export const Event: MessageFns<Event> = {
  encode(message: Event, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.shake !== undefined) {
      Shake.encode(message.shake, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Event {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.shake = Shake.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Event {
    return { shake: isSet(object.shake) ? Shake.fromJSON(object.shake) : undefined };
  },

  toJSON(message: Event): unknown {
    const obj: any = {};
    if (message.shake !== undefined) {
      obj.shake = Shake.toJSON(message.shake);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Event>, I>>(base?: I): Event {
    return Event.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Event>, I>>(object: I): Event {
    const message = createBaseEvent();
    message.shake = (object.shake !== undefined && object.shake !== null) ? Shake.fromPartial(object.shake) : undefined;
    return message;
  },
};

function createBaseShake(): Shake {
  return { file: "" };
}

export const Shake: MessageFns<Shake> = {
  encode(message: Shake, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.file !== "") {
      writer.uint32(10).string(message.file);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Shake {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseShake();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.file = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Shake {
    return { file: isSet(object.file) ? globalThis.String(object.file) : "" };
  },

  toJSON(message: Shake): unknown {
    const obj: any = {};
    if (message.file !== "") {
      obj.file = message.file;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Shake>, I>>(base?: I): Shake {
    return Shake.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Shake>, I>>(object: I): Shake {
    const message = createBaseShake();
    message.file = object.file ?? "";
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
