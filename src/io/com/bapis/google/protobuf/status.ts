// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.2
// source: src/io/com/bapis/google/protobuf/status.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "./any";

export const protobufPackage = "google.rpc";

/**
 * The `Status` type defines a logical error model that is suitable for different
 * programming environments, including REST APIs and RPC APIs. It is used by
 * [gRPC](https://github.com/grpc). The error model is designed to be:
 *
 * - Simple to use and understand for most users
 * - Flexible enough to meet unexpected needs
 *
 * # Overview
 *
 * The `Status` message contains three pieces of data: error code, error message,
 * and error details. The error code should be an enum value of
 * [google.rpc.Code][google.rpc.Code], but it may accept additional error codes if needed.  The
 * error message should be a developer-facing English message that helps
 * developers *understand* and *resolve* the error. If a localized user-facing
 * error message is needed, put the localized message in the error details or
 * localize it in the client. The optional error details may contain arbitrary
 * information about the error. There is a predefined set of error detail types
 * in the package `google.rpc` that can be used for common error conditions.
 *
 * # Language mapping
 *
 * The `Status` message is the logical representation of the error model, but it
 * is not necessarily the actual wire format. When the `Status` message is
 * exposed in different client libraries and different wire protocols, it can be
 * mapped differently. For example, it will likely be mapped to some exceptions
 * in Java, but more likely mapped to some error codes in C.
 *
 * # Other uses
 *
 * The error model and the `Status` message can be used in a variety of
 * environments, either with or without APIs, to provide a
 * consistent developer experience across different environments.
 *
 * Example uses of this error model include:
 *
 * - Partial errors. If a service needs to return partial errors to the client,
 *     it may embed the `Status` in the normal response to indicate the partial
 *     errors.
 *
 * - Workflow errors. A typical workflow has multiple steps. Each step may
 *     have a `Status` message for error reporting.
 *
 * - Batch operations. If a client uses batch request and batch response, the
 *     `Status` message should be used directly inside batch response, one for
 *     each error sub-response.
 *
 * - Asynchronous operations. If an API call embeds asynchronous operation
 *     results in its response, the status of those operations should be
 *     represented directly using the `Status` message.
 *
 * - Logging. If some API errors are stored in logs, the message `Status` could
 *     be used directly after any stripping needed for security/privacy reasons.
 */
export interface Status {
  /** The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code]. */
  code: number;
  /**
   * A developer-facing error message, which should be in English. Any
   * user-facing error message should be localized and sent in the
   * [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.
   */
  message: string;
  /**
   * A list of messages that carry the error details.  There is a common set of
   * message types for APIs to use.
   */
  details: Any[];
}

function createBaseStatus(): Status {
  return { code: 0, message: "", details: [] };
}

export const Status: MessageFns<Status> = {
  encode(message: Status, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    for (const v of message.details) {
      Any.encode(v!, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Status {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatus();
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
        case 3:
          if (tag !== 26) {
            break;
          }

          message.details.push(Any.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Status {
    return {
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      details: globalThis.Array.isArray(object?.details) ? object.details.map((e: any) => Any.fromJSON(e)) : [],
    };
  },

  toJSON(message: Status): unknown {
    const obj: any = {};
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.details?.length) {
      obj.details = message.details.map((e) => Any.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Status>, I>>(base?: I): Status {
    return Status.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Status>, I>>(object: I): Status {
    const message = createBaseStatus();
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    message.details = object.details?.map((e) => Any.fromPartial(e)) || [];
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
