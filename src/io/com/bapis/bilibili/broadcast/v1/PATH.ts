const PACKAGE = '/bilibili.broadcast.v1';
const BROADCAST = '.Broadcast';

/** 业务target_path */
export enum PATH {
    /** 进行鉴权 */
    AUTH = `${PACKAGE + BROADCAST}/Auth`,
    /** 心跳发送和发送（如果有上行消息可不进行发心跳） */
    HEARTBEAT = `${PACKAGE + BROADCAST}/Heartbeat`,
    /** 订阅target_paths，可以订阅到对应的消息 */
    SUBSCRIBE = `${PACKAGE + BROADCAST}/Subscribe`,
    /** 取消订阅target_paths */
    UNSUBSCRIBE = `${PACKAGE + BROADCAST}/Unsubscribe`,
    /**  如果消息is_ack=true，sdk收到后进行ack */
    MSG_ACK = `${PACKAGE + BROADCAST}/MessageAck`,

    ENTER = `${PACKAGE}.BroadcastRoom/Enter`,

    ROOMREQ = `${PACKAGE}.RoomReq`,
    ROOMRES = `${PACKAGE}.RoomResp`,

    /** 进行鉴权响应 */
    AUTHREQ = `${PACKAGE}.AuthReq`,
    /** 订阅target_paths，响应 */
    TARGETPATH = `${PACKAGE}.TargetPath`,
    /** 心跳，响应 */
    HEARTBEATRES = `${PACKAGE}.HeartbeatResp`,
    /** 心跳，响应 */
    MSG_ACK_REQ = `${PACKAGE}.MessageAckReq`,
}