import { BilibiliPlayer } from "..";
import { IDanmaku } from "../../../danmaku";
import { DanmakuEvent } from "../../../io/com/bapis/bilibili/broadcast/message/main/DanmakuEvent";
import { BroadcastFrame } from "../../../io/com/bapis/bilibili/broadcast/v1/BroadcastFrame";
import { MessageAckReq } from "../../../io/com/bapis/bilibili/broadcast/v1/MessageAck";
import { PATH } from "../../../io/com/bapis/bilibili/broadcast/v1/PATH";
import { RoomJoinEvent, RoomReq, RoomResp } from "../../../io/com/bapis/bilibili/broadcast/v1/Room";
import { TargetPath } from "../../../io/com/bapis/bilibili/broadcast/v1/TargetPath";
import { Any } from "../../../io/com/bapis/google/protobuf/any";
import { ev, PLAYER_EVENT } from "../../../player/event";

export class Broadcast {

    private ws?: WebSocket;

    /* 每次发送消息，唯一标识 */
    private seq = 1n;

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

    /** 是否已订阅 */
    #subcribe = false;

    /** 已进入房间 */
    #room: string[] = [];

    #rooming: string[] = [];

    private realdmPath = 'bilibili.broadcast.message.main.DanmukuEvent';

    /** webSocket 状态 */
    private get readyState() {
        return this.ws?.readyState;
    }

    private get roomid() {
        return `video://${this.player.$aid}/${this.player.$cid}${this.player.$ssid ? `?sid=${this.player.$ssid}&epid=${this.player.$epid}` : ''}`
    }

    constructor(private player: BilibiliPlayer) {
        ev.one(PLAYER_EVENT.DANMAKU_IDENTIFY, this.dispose);
        ev.one(PLAYER_EVENT.LOAD_VIDEO_FILE, this.dispose);
    }

    private init() {
        try {
            this.ws = new WebSocket(`wss://broadcast.chat.bilibili.com:7826/sub?platform=web`, 'proto');
            this.ws.binaryType = 'arraybuffer';
            this.ws.addEventListener('open', this.onopen);
            this.ws.addEventListener('message', this.onmessage);
            this.ws.addEventListener('close', this.onclose);
            this.ws.addEventListener('error', this.onerror);
        } catch (e) { }
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
                    body: Any.create({ typeUrl: `type.googleapis.com${PATH.HEARTBEATRES}` }),
                });
                this.heartBeat();
            }, this.heartTime);
        }
    }

    private send(
        data: BroadcastFrame,
        type = BroadcastFrame
    ) {
        const info = type.encode(data).finish();
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

    private onopen = (e: Event) => {
        this.retryCount = 0;
        this.send({
            options: {
                sequence: ++this.seq,
            },
            targetPath: PATH.AUTH,
            body: Any.create({ typeUrl: `type.googleapis.com${PATH.AUTHREQ}` }),
        })
    }

    private onmessage = ({ data }: MessageEvent<ArrayBuffer>) => {
        const { options, targetPath, body } = BroadcastFrame.decode(new Uint8Array(data));
        this.beatCount = 0;
        this.retryTimer && clearTimeout(this.retryTimer);
        this.heartBeat();
        if (options?.isAck) {
            this.send({
                options: {
                    sequence: ++this.seq,
                },
                targetPath: PATH.MSG_ACK,
                body: Any.create({
                    typeUrl: `type.googleapis.com${PATH.MSG_ACK_REQ}`, value: MessageAckReq.encode({
                        ackId: options.messageId!,
                        ackOrigin: options.ackOrigin!,
                        targetPath: targetPath,
                    }).finish()
                })
            });
        }
        switch (targetPath) {
            case PATH.AUTH: {
                this.send({
                    options: {
                        sequence: ++this.seq
                    },
                    targetPath: PATH.SUBSCRIBE,
                    body: Any.create({ typeUrl: `type.googleapis.com${PATH.TARGETPATH}`, value: TargetPath.encode({ targetPaths: [this.realdmPath] }).finish() }),
                });
                break;
            }
            case PATH.SUBSCRIBE: {
                this.#subcribe = true;
                while (this.#rooming.length) {
                    const room = this.#rooming.pop();
                    room && this.room(room);
                }
                break;
            }
            case PATH.UNSUBSCRIBE: {
                this.#subcribe = false;
                break;
            }
            case PATH.ENTER: {
                if (body?.value) {
                    const { msg, id } = RoomResp.decode(body.value);
                    if (msg && msg.body && id === this.roomid) {
                        switch (msg.targetPath) {
                            case this.realdmPath: {
                                const { elems } = DanmakuEvent.decode(msg.body.value);
                                this.player.addDanmaku(<IDanmaku[]>elems);
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    private onclose = (e: CloseEvent) => {
        this.#subcribe = false;
        delete this.ws;
        console.warn('实时弹幕已关闭', e);
    }

    private onerror = (e: Event) => {
        this.#subcribe = false;
        delete this.ws;
        console.error('实时弹幕错误', e);
    }

    /** 进入房间 */
    room(room = this.roomid) {
        this.ws || this.init();
        if (!this.#room.includes(room)) {
            if (this.#subcribe) {
                this.send({
                    options: {
                        sequence: ++this.seq,
                    },
                    targetPath: PATH.ENTER,
                    body: Any.create({ typeUrl: `type.googleapis.com${PATH.ROOMREQ}`, value: RoomReq.encode({ id: room, join: RoomJoinEvent.create() }).finish() }),
                });
                this.#room.push(room);
            } else {
                this.#rooming.push(room);
            }
        }
    }

    /** 销毁 */
    private dispose = () => {
        this.retryTimer && clearTimeout(this.retryTimer);
        this.beatTimer && clearTimeout(this.beatTimer);
        this.close();
    }

    /** 关闭webSocket */
    private close() {
        this.ws?.close();
        delete this.ws;
    }
}