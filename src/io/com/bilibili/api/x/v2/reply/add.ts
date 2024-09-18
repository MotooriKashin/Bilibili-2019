import { Api } from "../../..";
import { IReplies } from ".";
import { RestType } from "../../../../../../code";

/**
 * 发送评论
 * 
 * @param csrf cookie校验：bili_jct
 * @param oid 评论所属页面id，对于视频页面，取aid
 * @param message 要回复的信息
 * @param type 评论类型，视频页是1
 * @param pictures 评论图片
 * @param root 要回复的评论id
 * @param parent 要回复的评论所在父评论id
 * @param ordering 当前评论排序模式
 * @param plat 评论平台，网页端是1
 */
export async function replyAdd(req: IReplyAddReq) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    req.pictures ? (Array.isArray(req.pictures) || (req.pictures = [req.pictures])) : (delete req.pictures);
    req.type || (req.type = 1);
    req.plat || (req.plat = 1);
    req.ordering || (req.ordering = 'heat');
    req.root || (delete req.root);
    req.parent || (delete req.parent);
    const body = new URLSearchParams(<any>req);
    const response = await fetch(Api + '/x/v2/reply/add', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <IReplyAdd>(await response.json());
}

interface IReplyAdd extends RestType {
    data: {
        dialog_str: string;
        need_captcha: boolean;
        parent_str: string;
        reply: IReplies;
        root_str: string;
        rpid_str: string;
        success_action: number;
        success_animation: string;
        success_toast: string;
        url: string;
    }
}

interface IReplyPic {
    img_height: number;
    img_size: number;
    img_src: string;
    img_width: number;
}

interface IReplyAddReq {
    /** cookie校验：bili_jct */
    csrf: string;
    /** 评论所属页面id，对于视频页面，取aid */
    oid: string | number;
    /** 要回复的信息 */
    message: string;
    /** 评论类型，视频页是1 */
    type?: number;
    /** 评论图片 */
    pictures?: IReplyPic | IReplyPic[];
    /** 要回复的评论id */
    root?: string | number;
    /** 要回复的评论所在父评论id */
    parent?: string | number;
    /** 当前评论排序模式 */
    ordering?: 'heat' | 'time';
    /** 评论平台，网页端是1 */
    plat?: number;
}