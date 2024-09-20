import { BilibiliPlayer } from "..";
import { IDanmaku } from "../../../danmaku";
import { AnyType, IAnyType } from "../../../io/protobuf/AnyType";
import { BroadcastFrame, IBroadcastFrame, PATH } from "../../../io/protobuf/BroadcastFrame";
import { DanmakuEvent } from "../../../io/protobuf/DanmakuEvent";
import { MessageAckReq } from "../../../io/protobuf/MessageAckReq";
import { RoomJoinEvent } from "../../../io/protobuf/RoomJoinEvent";
import { RoomReq } from "../../../io/protobuf/RoomReq";
import { RoomResp } from "../../../io/protobuf/RoomResp";
import { TargetPath } from "../../../io/protobuf/TargetPath";
import { ev, PLAYER_EVENT } from "../../../player/event";

export class Danmaku {

    #ws?: WebSocket;

    /* 每次发送消息，唯一标识 */
    private seq = 1;

    /** 重连次数 每次重连，时间间隔递增 有最大值 */
    private retryCount = 0;

    /** 开启自动重试，设定自动重试间隔 */
    private retryTime = 20000;

    /** 重试递增步长 */
    private retryStep = 5000;

    /** 重试最大间隔 */
    private maxTime = 30000;

    /** 心跳时长 */
    private heartTime = 20000;

    /** 重试定时器, 链接成功，清除定时器 */
    private retryTimer?: ReturnType<typeof setTimeout>;

    /** 心跳定时器 */
    private beatTimer?: ReturnType<typeof setTimeout>;

    /** 心跳三次没收到回复，重连 */
    private beatCount = 0;

    /** 是否已鉴权 */
    private authed = false;

    private realdmPath = 'bilibili.broadcast.message.main.DanmukuEvent';

    /** webSocket 状态 */
    private get readyState() {
        return this.#ws?.readyState;
    }

    constructor(
        private player: BilibiliPlayer,
        private room: string[] = [],
    ) {
        this.init();

        ev.one(PLAYER_EVENT.DANMAKU_IDENTIFY, this.dispose);
        ev.one(PLAYER_EVENT.LOAD_VIDEO_FILE, this.dispose);
    }

    private init() {
        try {
            this.#ws = new WebSocket(`wss://broadcast.chat.bilibili.com:7826/sub?platform=web`, 'proto');
            this.#ws.binaryType = 'arraybuffer';
            this.#ws.addEventListener('open', this.onopen);
            this.#ws.addEventListener('message', this.onmessage);
            this.#ws.addEventListener('close', this.onclose);
            this.#ws.addEventListener('error', this.onerror);
        } catch (e) {
            // TODO： 链接失败
        }
    }

    private onopen = (e: Event) => {
        this.retryCount = 0;
        this.send({
            options: {
                sequence: ++this.seq,
            },
            targetPath: PATH.AUTH,
            body: this.encodeAny(PATH.AUTHREQ, AnyType.encode({}))
        })
    }

    private onmessage = (e: MessageEvent<ArrayBuffer>) => {
        const message = BroadcastFrame.decode(e.data);
        this.beatCount = 0;
        this.retryTimer && clearTimeout(this.retryTimer);
        this.heartBeat();
        if (message) {
            if (message.options.isAck) {
                this.send({
                    options: {
                        sequence: ++this.seq,
                    },
                    targetPath: PATH.MSG_ACK,
                    body: this.encodeAny(PATH.MSG_ACK_REQ, MessageAckReq.encode({
                        ackId: message.options.messageId,
                        ackOrigin: message.options.ackOrigin,
                        targetPath: message.targetPath,
                    }),
                    ),
                });
            }
            if (message.targetPath) {
                switch (message.targetPath) {
                    case PATH.AUTH: {
                        this.onAuthed(message);
                        break;
                    }
                    case PATH.HEARTBEAT: {
                        // console.log(PATH.HEARTBEAT, message);
                        break;
                    }
                    case PATH.SUBSCRIBE: {
                        // console.log(PATH.SUBSCRIBE, message);
                        break;
                    }
                    case PATH.UNSUBSCRIBE: {
                        // console.log(PATH.UNSUBSCRIBE, message);
                        break;
                    }
                    case PATH.ENTER: {
                        if (message.body?.value) {
                            const { id, msg, online } = RoomResp.decode(message.body.value);
                            if (online) {
                                console.log('在线人数', online); // 失效了？
                            }
                            if (msg) {
                                switch (msg.targetPath) {
                                    case this.realdmPath: {
                                        const d = (DanmakuEvent.decode(msg.body.value));
                                        this.player.addDanmaku(<IDanmaku[]><unknown>DanmakuEvent.decode(msg.body.value).elems);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    }
                    default: {
                        console.log(message);
                        break;
                    }
                }
            }
        }
    }

    private onclose = (e: CloseEvent) => { }

    private onerror = (e: Event) => {
        console.error(e);
    }

    /** 心跳 */
    private heartBeat() {
        if (this.beatCount > 3) {
            this.retry();
        } else {
            this.beatTimer && clearTimeout(this.beatTimer);
            this.beatTimer = setTimeout(() => {

                this.beatCount++;
                this.send({
                    options: {
                        sequence: ++this.seq,
                    },
                    targetPath: PATH.HEARTBEAT,
                    body: this.encodeAny(PATH.HEARTBEATRES, AnyType.encode({})),
                });
                this.heartBeat();
            }, this.heartTime);
        }
    }

    /** 鉴权后执行订阅 以及进入房间 */
    private onAuthed(msg: IBroadcastFrame) {
        this.authed = true;

        // 订阅
        this.enSubscribe();

        // 进入房间
        this.enRoom();
    }

    /** 订阅，如果是初始化传入的subscribe，则不进行重复判断 */
    private enSubscribe(subscribe = true) {
        this.send({
            options: {
                sequence: ++this.seq
            },
            targetPath: subscribe ? PATH.SUBSCRIBE : PATH.UNSUBSCRIBE,
            body: this.encodeAny(PATH.TARGETPATH, TargetPath.encode({
                targetPaths: [this.realdmPath]
            }))
        })
    }

    /** 进入房间 */
    private enRoom() {
        for (const room of this.room) {
            this.send({
                options: {
                    sequence: ++this.seq,
                },
                targetPath: PATH.ENTER,
                body: this.encodeAny(PATH.ROOMREQ, RoomReq.encode({
                    id: room,
                    join: RoomJoinEvent.create({})
                }))
            })
        }
    }

    private send(data: IBroadcastFrame, type = BroadcastFrame) {
        const info = type.encode(data);
        if (info) {
            switch (this.readyState) {
                case 0:
                    console.warn('is CONNECTING');
                    break;
                case 1:
                    this.#ws?.send(info);
                    break;
                default:
                    this.retry();
                    break;
            }
        } else {
            console.warn('格式不对');
        }
    }

    /** any 类型文件 */
    private encodeAny(path: PATH, arrayBuffer: ArrayBuffer) {
        return <IAnyType><unknown>AnyType.create({
            type_url: `type.googleapis.com${path}`,
            value: arrayBuffer
        })
    }

    /** 重连 */
    private retry() {
        this.dispose();
        this.init();
        const time = Math.min(this.retryTime + this.retryCount * this.retryStep, this.maxTime);
        this.retryCount++;
        this.retryTimer = setTimeout(() => {
            this.retry();
        }, time);
    }

    /** 销毁 */
    private dispose = () => {
        this.retryTimer && clearTimeout(this.retryTimer);
        this.beatTimer && clearTimeout(this.beatTimer);
        this.close();
    }

    /** 关闭webSocket */
    private close() {
        this.#ws?.close();
    }
}