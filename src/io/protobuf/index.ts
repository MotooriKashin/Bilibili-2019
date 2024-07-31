import { Type } from "protobufjs";
import { ProtobufRoot } from "./root";

/** Protobuf实例 */
export class Protobuf {

    static #dm = 'bilibili.community.service.dm.v1';

    static #broadcast = 'bilibili.broadcast.v1';

    static #broadcastMessage = 'bilibili.broadcast.message.main';

    static #DmWebViewReply: Type;

    static #DmSegMobileReply: Type;

    static #BroadcastFrame: Type;

    static #TargetPath: Type;

    static #HeartbeatReq: Type;

    static #MessageAckReq: Type;

    static #anyType: Type;

    static #RoomReq: Type;

    static #RoomResp: Type;

    static #RoomJoinEvent: Type;

    static #RoomLeaveEvent: Type;

    static #RoomOnlineEvent: Type;

    static #RoomMessageEvent: Type;

    static #DanmukuEvent: Type;

    /** 弹幕view */
    static get DmWebViewReply() {
        return this.#DmWebViewReply || (this.#DmWebViewReply = ProtobufRoot.dm.lookupType(`${this.#dm}.DmWebViewReply`));
    }

    /** 弹幕列表 */
    static get DmSegMobileReply() {
        return this.#DmSegMobileReply || (this.#DmSegMobileReply = ProtobufRoot.dm.lookupType(`${this.#dm}.DmSegMobileReply`));
    }

    /** broadcast 返回消息 */
    static get BroadcastFrame() {
        return this.#BroadcastFrame || (this.#BroadcastFrame = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.BroadcastFrame`));
    }

    /** broadcast any 类型 */
    static get TargetPath() {
        return this.#TargetPath || (this.#TargetPath = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.TargetPath`));
    }

    /** broadcast 心跳请求 */
    static get HeartbeatReq() {
        return this.#HeartbeatReq || (this.#HeartbeatReq = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.HeartbeatReq`));
    }

    /** broadcast 心跳返回 */
    static get MessageAckReq() {
        return this.#MessageAckReq || (this.#MessageAckReq = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.MessageAckReq`));
    }

    /** broadcast any 类型 */
    static get anyType() {
        return this.#anyType || (this.#anyType = ProtobufRoot.broadcast.lookupType('google.protobuf.Any'));
    }

    /** broadcast 房间请求 */
    static get RoomReq() {
        return this.#RoomReq || (this.#RoomReq = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.RoomReq`));
    }

    /** broadcast 房间响应 */
    static get RoomResp() {
        return this.#RoomResp || (this.#RoomResp = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.RoomResp`));
    }

    /** broadcast 加入房间 */
    static get RoomJoinEvent() {
        return this.#RoomJoinEvent || (this.#RoomJoinEvent = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.RoomJoinEvent`));
    }

    /** broadcast 离开房间 */
    static get RoomLeaveEvent() {
        return this.#RoomLeaveEvent || (this.#RoomLeaveEvent = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.RoomLeaveEvent`));
    }

    /** broadcast 在线人数 */
    static get RoomOnlineEvent() {
        return this.#RoomOnlineEvent || (this.#RoomOnlineEvent = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.RoomOnlineEvent`));
    }

    /** broadcast 房间消息 */
    static get RoomMessageEvent() {
        return this.#RoomMessageEvent || (this.#RoomMessageEvent = ProtobufRoot.broadcast.lookupType(`${this.#broadcast}.RoomMessageEvent`));
    }

    /** broadcast 实时弹幕 */
    static get DanmukuEvent() {
        return this.#DanmukuEvent || (this.#DanmukuEvent = ProtobufRoot.broadcastMessage.lookupType(`${this.#broadcastMessage}.DanmukuEvent`));
    }
}