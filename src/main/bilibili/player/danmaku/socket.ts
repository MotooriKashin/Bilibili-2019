import { AnyType, IAnyType } from "../../../../io/protobuf/AnyType";
import { BroadcastFrame, PATH, IBroadcastFrame } from "../../../../io/protobuf/BroadcastFrame";
import { MessageAckReq } from "../../../../io/protobuf/MessageAckReq";
import { RoomJoinEvent } from "../../../../io/protobuf/RoomJoinEvent";
import { RoomReq } from "../../../../io/protobuf/RoomReq";
import { TargetPath } from "../../../../io/protobuf/TargetPath";
import { EVENTS, IEvents } from "./state";

/** webSoket */
export class Socket {

    private mutex = Math.random().toString(36).substring(2);

    static weakmap = new WeakMap<Function, Function>();

    /** WebSocket实例 */
    private ws?: WebSocket;

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
    private retryTimer?: number;

    /** 心跳定时器 */
    private beatTimer?: number;

    /* 每次发送消息，唯一标识 */
    private seq = 1;

    /** 心跳三次没收到回复，重连 */
    private beatCount = 0;

    /** webSocket 状态 */
    private get readyState() {
        return this.ws?.readyState;
    }

    /** 是否已鉴权 */
    private authed = false;

    constructor(
        private url: string,
        private subscribe: string[] = [],
        private room: string[] = [],
        private protocols = 'proto',
    ) {
        this.init();
    }

    /** 初始化或重连websocket */
    private init() {
        try {
            this.ws = new WebSocket(this.url, this.protocols);
            this.ws.binaryType = 'arraybuffer';
            this.ws.addEventListener('open', this.onopen);
            this.ws.addEventListener('message', this.onmessage);
            this.ws.addEventListener('close', this.onclose);
            this.ws.addEventListener('error', this.onerror);
            this.trigger(EVENTS.B_INITED, void 0);
        } catch (e) {
            this.trigger(EVENTS.B_ERROR, <Event>e);
        }
    }

    /**
     * 事件监听（只监听一次）
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    one<K extends keyof IEvents>(type: K, listener: (evt: IEvents[K]) => void) {
        this.ws?.addEventListener(this.mutex + type, <EventListener>(({ detail }: CustomEvent) => listener(detail)), { once: true });
    }

    /**
     * 事件监听
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    bind = <K extends keyof IEvents>(type: K, listener: (evt: IEvents[K]) => void) => {
        function nListener({ detail }: CustomEvent) {
            listener(detail);
        }
        Socket.weakmap.set(listener, nListener);
        this.ws?.addEventListener(this.mutex + type, <EventListener>nListener);
    }

    /**
     * 取消事件监听
     * 
     * @param type 事件类型
     * @param listener 事件回调
     */
    unbind = <K extends keyof IEvents>(type: K, listener: (evt: IEvents[K]) => void) => {
        const nListener = Socket.weakmap.get(listener);
        if (nListener) {
            this.ws?.removeEventListener(this.mutex + type, <EventListener>nListener);
            Socket.weakmap.delete(listener);
        }
    }

    /**
     * 分发事件
     * 
     * @param type 事件类型
     * @param detail 分发给回调的数据
     */
    trigger = <K extends keyof IEvents>(type: K, detail: IEvents[K]) => {
        this.ws?.dispatchEvent(new CustomEvent(this.mutex + type, { detail }))
    }

    private onopen = (e: Event) => {
        this.retryCount = 0;
        this.trigger(EVENTS.B_OPEN, e);
        this.auth();
    }

    private onmessage = (e: MessageEvent<ArrayBuffer>) => {
        const msg = BroadcastFrame.decode(e.data);
        this.beatCount = 0;
        this.retryTimer && clearTimeout(this.retryTimer);
        this.heartBeat();
        if (msg) {
            if (msg.options.isAck) {
                this.send({
                    options: {
                        sequence: ++this.seq,
                    },
                    targetPath: PATH.MSG_ACK,
                    body: this.encodeAny(PATH.MSG_ACK_REQ, MessageAckReq.encode({
                        ackId: msg.options.messageId,
                        ackOrigin: msg.options.ackOrigin,
                        targetPath: msg.targetPath,
                    }),
                    ),
                });
            }
            if (msg.targetPath) {
                switch (msg.targetPath) {
                    case PATH.AUTH: {
                        this.onAuthed(msg);
                        break;
                    }
                    case PATH.HEARTBEAT: {
                        this.trigger(EVENTS.B_HEARTBEAT, msg);
                        break;
                    }
                    case PATH.SUBSCRIBE: {
                        this.trigger(EVENTS.B_SUB, msg);
                        break;
                    }
                    case PATH.UNSUBSCRIBE: {
                        this.trigger(EVENTS.B_UN_SUB, msg);
                        break;
                    }
                    case PATH.ENTER: {
                        this.trigger(EVENTS.B_ROOM, msg);
                        break;
                    }
                    default: {
                        this.trigger(EVENTS.B_MSG, msg);
                        break;
                    }
                }
            }
        }
    }

    private onclose = (e: CloseEvent) => {
        this.trigger(EVENTS.B_CLOSE, void 0);
    }

    private onerror = (e: Event) => {
        this.trigger(EVENTS.B_ERROR, e);
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
    dispose() {
        this.retryTimer && clearTimeout(this.retryTimer);
        this.beatTimer && clearTimeout(this.beatTimer);
        this.close();
    }

    /** 关闭webSocket */
    private close() {
        this.ws?.close();
    }

    private send(data: IBroadcastFrame, type = BroadcastFrame) {
        const info = type.encode(data);
        if (info) {
            switch (this.readyState) {
                case 0:
                    console.warn('is CONNECTING');
                    break;
                case 1:
                    this.ws?.send(info);
                    break;
                default:
                    this.retry();
                    break;
            }
        } else {
            console.warn('格式不对');
        }
    }

    /** 鉴权 */
    private auth() {
        this.send({
            options: {
                sequence: ++this.seq,
            },
            targetPath: PATH.AUTH,
            body: this.encodeAny(PATH.AUTHREQ, AnyType.encode({}))
        })
    }

    /** any 类型文件 */
    private encodeAny(path: PATH, arrayBuffer: ArrayBuffer) {
        return <IAnyType><unknown>AnyType.create({
            type_url: `type.googleapis.com${path}`,
            value: arrayBuffer
        })
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
        this.trigger(EVENTS.B_AUTH, msg);
        this.authed = true;

        // 订阅
        this.enSubscribe();

        // 进入房间
        this.enRoom();
    }

    /** 订阅，如果是初始话传入的subscribe，则不进行重复判断 */
    private enSubscribe(subscribe = true) {
        this.send({
            options: {
                sequence: ++this.seq
            },
            targetPath: subscribe ? PATH.SUBSCRIBE : PATH.UNSUBSCRIBE,
            body: this.encodeAny(PATH.TARGETPATH, TargetPath.encode({
                targetPaths: this.subscribe
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
}