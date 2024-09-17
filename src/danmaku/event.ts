import { IDanmaku } from ".";

/** 弹幕事件 */
export enum DanmakuEvent {

    /** 添加弹幕，注意参数为新增弹幕 */
    DANMAKU_ADD,

    /** 发送弹幕 */
    DANMAKU_SEND,
}


/** 弹幕事件对应的数据类型 */
export interface IDanmakuEvent {
    0: IDanmaku[];
    1: IDanmaku;
}