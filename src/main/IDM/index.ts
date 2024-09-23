import { toastr } from "../../toastr";
import { msToday } from "../../utils/msToday";
import { GM } from "../GM";

/** IDM 工具集 */
export namespace IDM {

    /** 消息序号 */
    let i = 0;

    /** 浏览器窗口序号 */
    let wid = 1;

    /** IDM 链接实例 */
    let ws: WebSocket | undefined;

    let cid: number | undefined;

    const Ra = false;

    const ha = Function.apply.bind(String.fromCharCode, null);

    const lb = { ftp: 2, ftps: 10, http: 1, https: 9, idmreg: 12, xup: 33 };

    /**
     * 构造并发送消息
     *
     * @param type 消息类型
     * @param sort 二级消息类型？
     * @param flag 未知
     * @param ext 消息附加信息？
     * @param obj 消息内容
     * @param tag 未知
     */
    function MSG(type: number, sort: number, flag: number, ext: (string | number | null)[], obj?: Record<number, any>, tag?: boolean) {
        const arr: any[] = ["MSG#", ++i, "#", type, "#", sort, "#", flag];
        if (ext) {
            for (let i = 0; i < ext.length; i++)
                arr.push(":", ext[i] || 0);
        }
        if (obj) {
            for (let key in obj) {
                const value = obj[key];
                if (null != value) {
                    arr.push(",", key, "=");
                    if (value instanceof Array) {
                        let length = arr.length;
                        let b = 0;
                        for (var char of value) {
                            b = char instanceof Uint8Array ? b + (tag ? ob(char = <any>ha(<any>char)) : char.length) : b + ob(char = char.toString());
                            arr.push(char);
                        }
                        arr.splice(length, 0, b, ":");
                    } else {
                        "string" == typeof value ? arr.push(ob(value), ":", value) : value instanceof Blob ? arr.push(value.size, ":", value) : arr.push(value);
                    }
                }
            }
        }
        arr.push(";")
        ws?.send(new Blob(arr));
    }

    function ob(a: string) {
        for (var b = a.length, c = b, d = 0; d < c;) {
            var e = a.charCodeAt(d++);
            128 <= e && (2048 <= e ? (b += 2,
                e - 55296 & 56320 || d++) : b++)
        }
        return b
    }

    /**
     * 连接到 IDM
     * 
     * @param callback 连接后回调
     */
    function connect(callback?: () => void) {
        cid || (cid = msToday());
        GM.updateSessionRules([{
            id: cid,
            action: {
                type: <any>'modifyHeaders',
                requestHeaders: [
                    {
                        header: 'origin',
                        operation: <any>'set',
                        value: 'chrome-extension://ngpampappnmepgilojfohadhhmbhlaek'
                    }
                ]
            },
            condition: {
                urlFilter: '||127.0.0.1:1001',
            }
        }])
            .then(() => {
                ws = new WebSocket(`ws://127.0.0.1:1001/?cid=1&rnd=${Math.random().toString().substring(2, 11)}`, 'plugin.v3.internetdownloadmanager.com');
                ws.addEventListener('open', () => {
                    init();
                    windowUpdate();
                    windowShow();
                    callback && setTimeout(() => callback?.());
                });
                ws.addEventListener('error', e => {
                    toastr.error('连接 IDM 出错', <any>e);
                    console.error(e);
                    ws = undefined;
                });
                ws.addEventListener('close', e => {
                    toastr.warn('IDM 连接已关闭')
                    console.warn('IDM 连接已关闭', e);
                });
                ws.addEventListener('message', async ({ data }) => {
                    if (data instanceof Blob) {
                        data = await data.text();
                    }
                    console.log('[IDM]', data);
                });
            })
            .catch(e => {
                toastr.error('连接 IDM 出错', <any>e);
                console.error(e);
                ws = undefined;
            })
    }

    /** open 回执（模拟） */
    function init() {
        const e = navigator.userAgent;
        const la = e.match(/\bChrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)\b/) ? e.match(/\bChrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)\b/)![0] : "UNKNOWN/0.0";
        const b = [16, 48, Ra ? 1028 : 1031, 0];
        const c = {
            112: la,
            113: la,
            114: "Chrome_RenderWidgetHostHWND", // "MozillaWindowClass" | "Windows.UI.Core.CoreWindow"
            125: undefined,
            116: "zh-CN"
        }
        MSG(2, 1, Ra ? 0 : 1024, b, c);
    }

    /** 浏览器窗口刷新消息（模拟） */
    function windowUpdate() {
        const info = [wid, null, window.screen.availWidth, window.screen.availHeight, -8, -8, 1];
        MSG(6, 2, 2312, info);
    }

    /** 浏览器窗口获得焦点（模拟） */
    function windowShow() {
        const info = [wid, 8, 111, window.screen.availWidth, window.screen.availHeight];
        MSG(7, 2, 256, info);
    }

    /** 浏览器窗口关闭（模拟） */
    function windowClose() {
        MSG(5, 1, 32, [wid]);
        wid++;
    }

    function Yb(a: string) {
        a = a.split(":", 1).shift()!.toLowerCase();
        const n = lb[<'ftp'>a] || 0;
        return n % 8;
    }

    /** 下载 */
    export function download(data: IDMDownloadData) {
        if (ws) {
            const { url, referer, origin, userAgent, fileName } = data;
            const x = Yb(url);
            if (!x) throw new ReferenceError(`IDM 不支持的下载链接！`);
            const k = <Record<number, string | number>>{
                6: url,
                7: origin ? location.origin : referer,
                8: 4,
                50: referer === undefined ? location.origin : referer,
                51: '',
                54: userAgent || navigator.userAgent,
                121: '4',
            };
            fileName && (k[100] = fileName);
            MSG(14, 1, 0, [x], k);
        } else {
            connect(() => {
                download(data);
            })
        }
    }

    interface IDMDownloadData {
        /** 下载链接 */
        url: string;
        /** 请求头 referer 要移除请传递空字符串 */
        referer?: string;
        /** 请求头 origin 要移除请传递空字符串 */
        origin?: string;
        /** 请求头 user-agent 默认使用当前环境 */
        userAgent?: string;
        /** 文件名（含拓展名） 保持默认可以不提供 */
        fileName?: string;
    }
}