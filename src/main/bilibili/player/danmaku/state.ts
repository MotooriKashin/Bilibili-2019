import { IBroadcastFrame } from "../../../../io/protobuf/BroadcastFrame";

export enum EVENTS {
    /** inited */
    B_INITED,
    /** socket open */
    B_OPEN,
    /** socket close */
    B_CLOSE,
    /** socket message */
    B_MSG,
    /** room enter */
    B_ROOM,

    /** 鉴权回调(鉴权之后才可以订阅) */
    B_AUTH,
    /** 订阅回调 */
    B_SUB,
    /** 取消订阅回调 */
    B_UN_SUB,
    /** socket HeartBeat */
    B_HEARTBEAT,
    /** socket error */
    B_ERROR,
}

export interface IEvents {
    0: void;
    1: Event;
    2: void;
    3: IBroadcastFrame;
    4: IBroadcastFrame;

    5: IBroadcastFrame;
    6: IBroadcastFrame;
    7: IBroadcastFrame;
    8: IBroadcastFrame;
    9: Event;
}