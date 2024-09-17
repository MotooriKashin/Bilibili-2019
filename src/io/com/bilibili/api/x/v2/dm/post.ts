import { Api } from "../../..";
import { RestType } from "../../../../../../code";

export async function dmPost(param: IDmPostIn) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        color: 0xFFFFFF,
        fontsize: 25,
        pool: 0,
        mode: 1,
        type: 1,
        play: 1,
        rnd: Date.now() * 1000 + Math.floor(Math.random() * (999 - 100 + 1)) + 100,
        ...param,
    });
    const response = await fetch(Api + '/x/v2/dm/post', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <IDmPost>await response.json();
}

export interface IDmPostIn {
    /** CSRF Token */
    csrf: string;
    oid: number;
    aid: number;
    /** 弹幕内容（长度小于 100 字符） */
    msg: string;
    /** 弹幕出现在视频内的时间：/毫秒 */
    progress: number;
    /** 弹幕颜色,十进制 RGB888 值 */
    color?: number;
    /** 弹幕字号 */
    fontsize?: number;
    /**
     * 弹幕池
     * | 0 | 1 | 2 |
     * | :-: | :-: | :-: |
     * | 普通弹幕 | 字幕弹幕 | 特殊弹幕 |
     */
    pool?: 0 | 1 | 2;
    /**
     * 弹幕模式
     * | 1 | 4 | 5 | 6 | 7 | 8 | 9 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 普通 | 底部 | 顶部 | 逆向 | 高级 | 代码 | BAS |
     */
    mode?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    /**
     * | 1 | 2 |
     * | :-: | :-: |
     * | 视频 | 漫画 |
     */
    type?: 1 | 2;
    /** 专属渐变彩色 */
    colorful?: 60001;
    /**
     * 是否带 UP 身份标识
     * | 0 | 4 |
     * | :-: | :-: |
     * | 普通 | 带有标识 |
     */
    checkbox_type?: 0 | 4;
    /**
     * 平台标识
     * | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | Unknow | Web | Android | IPhone | WPM | IPAD | PadHD | WpPC |
     */
    plat?: number;
}

interface IDmPost extends RestType {
    data: {
        action: string;
        animation: string;
        colorful_src: unknown;
        dm_content: string;
        /** @deprecated */
        dmid: number;
        dmid_str: string;
        visible: boolean;
    }
}