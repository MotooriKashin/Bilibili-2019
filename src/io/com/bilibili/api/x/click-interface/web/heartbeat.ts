import { Api } from "../../..";

/**
 * 上报视频播放心跳
 * 
 * @param aid 稿件avid
 * @param cid 视频cid
 * @param played_time 视频播放进度
 * @param play_type 播放动作
 * @param type 视频类型
 * @param sub_type 剧集副类型
 */
export async function heartbeat(
    csrf: string,
    aid: number,
    cid: number,
    played_time = 0,
    play_type = HEARTBEAT_PLAY_TYPE.PLAYING,
    type = HEARTBEAT_TYPE.AV,
    sub_type = HEARTBEAT_TYPE_SUB.ANIME,
) {
    played_time = Math.floor(played_time);
    const url = new URL(Api + '/x/click-interface/web/heartbeat');
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        aid,
        cid,
        played_time,
        play_type,
        type,
        dt: 2,
        csrf,
    });
    type === HEARTBEAT_TYPE.BANGUMI && body.set('sub_type', <any>sub_type);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return response.json();
}

/** 视频类型 */
export enum HEARTBEAT_TYPE {
    /** 投稿视频 */
    AV = 3,
    /** 剧集 */
    BANGUMI = 4,
    /** 课程 */
    CHEESE = 10,
}

/** 剧集副类型当`HEARTBEAT_TYPE.BANGUMI`时本参数有效 */
export enum HEARTBEAT_TYPE_SUB {
    /** 番剧 */
    ANIME = 1,
    /** 电影 */
    MOVIE = 2,
    /** 纪录片 */
    RECOVERY = 3,
    /** 国创 */
    DONGHUA = 4,
    /** 电视剧 */
    TV = 5,
    /** 综艺 */
    VARIETY = 6,
}

export enum HEARTBEAT_PLAY_TYPE {
    /** 播放中 */
    PLAYING,
    /** 开始播放 */
    START,
    /** 暂停 */
    PAUSE,
    /** 继续播放 */
    CONTINUE,
    /** 播放结束 */
    ENDED,
}