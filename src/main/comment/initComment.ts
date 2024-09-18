import { Comment } from ".";
import { ProxyHook } from "../../utils/hook/Proxy";

export class InitComment {

    constructor() {
        ProxyHook.property(self, 'initComment', this.initComment);
        ProxyHook.property(self, 'bbComment', class {
            constructor(
                /** 绑定到的节点的选择符 */
                parent: string,
                /** 视频aid或话题topic id */
                oid: Record<string, any> | number,
                /** 评论所在页面类型 1:视频，2:话题 */
                pageType: number,
                /** 用户信息 */
                userStatus: object,
                /** 需要跳转到的评论的id */
                jumpId: number,
                ex: unknown,
            ) {
                const target = document.querySelector(parent);
                if (target) {
                    if (typeof oid === 'object') {
                        target.replaceChildren(new Comment(oid.oid, undefined, undefined, oid.pageType, oid.jumpId));
                    } else {
                        target.replaceChildren(new Comment(oid, undefined, undefined, pageType, jumpId));
                    }
                }
            }
        });
        ProxyHook.property(self, 'BiliComments', class extends EventTarget {

            $parent?: HTMLElement;

            constructor(private arg: IBiliComments) {
                super();
            }

            mount(parent: HTMLElement) {
                this.$parent = parent;
                const [type, oid] = this.arg.params.split(",");
                parent.replaceChildren(new Comment(oid, undefined, undefined, +type, this.arg.seekId));
                setTimeout(() => {
                    this.dispatchEvent(new Event('inited'));
                    this.dispatchEvent(new Event('expand'));
                    // this.dispatchEvent(new Event('seek'));
                });
                return this;
            }

            dispatchAction({ type, args, callback }: IDispatchAction) {
                switch (type) {
                    case 'reload': {
                        const [type, oid] = args[0].params.split(",");
                        this.$parent?.replaceChildren(new Comment(oid, undefined, undefined, +type, this.arg.seekId));
                        callback?.();
                        break;
                    }
                }
            }
        })
    }

    /** 拦截新版评论区 */
    initComment = (container: string, { oid, pageType, jumpReplyId }: IInitComment) => {
        const target = document.querySelector(container);
        if (target) {
            target.replaceWith(new Comment(oid, undefined, undefined, pageType, jumpReplyId));
        }
        return this;
    }

    /** 新版评论区兼容 */
    registerEvent() { }

    /** 新版评论区兼容 */
    on() { }

    /** 新版评论区兼容 */
    Off() { }
}

interface IInitComment {
    allowForwardToDynamic?: boolean;
    commentType?: string;
    jumpReplyId?: number;
    oid: string | number;
    pageType: number;
    scene?: string;
    showMaxReplyCount?: number;
    theme?: string;
}

interface IBiliComments {
    params: string;
    seekId?: number;
}

interface IDispatchAction {
    type: 'reload';
    callback?: () => void;
    args: { params: string }[];
}