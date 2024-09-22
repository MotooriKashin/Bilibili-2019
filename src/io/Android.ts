import { GM } from "../main/GM";
import { base64 } from "../utils/base64";
import { Device } from "./com/bapis/bilibili/metadata/Device";
import { FawkesReq } from "./com/bapis/bilibili/metadata/Fawkes";
import { Locale, LocaleIds } from "./com/bapis/bilibili/metadata/Locale";
import { Metadata } from "./com/bapis/bilibili/metadata/Metadata";
import { Network, NetworkType } from "./com/bapis/bilibili/metadata/Network";
import { genAuroraEid } from "./sign/genAuroraEid";
import { genTraceId } from "./sign/genTraceId";

/** Android端通用变量 */
export namespace Andoroid {
    /** 包类型 */
    export const mobiApp = 'android';

    /** 客户端在fawkes系统的唯一名 */
    export const appkey = 'android64';

    /** 客户端在fawkes系统中的环境参数 */
    export const env = 'prod';

    /** 启动id */
    export const sessionId = crypto.randomUUID().split('-')[0];

    /** 版本号(version_code) */
    export const build = 8080200;

    /** 渠道 */
    export const channel = 'html5_app_bili';

    /** 设备buvid */
    export const buvid = `XU${crypto.randomUUID().split('-').join(Math.floor(Math.random() * 10).toString()).slice(-35).toLocaleUpperCase()}`;

    /** 设备类型 */
    export const platform = 'android';

    /**
     * 产品编号
     * | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 |
     * | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
     * | 粉 | 白 | 蓝 | 直播姬 | HD | 海外 | OTT | 漫画 | TV野版 | 小视频 | 网易漫画 | 网易漫画lite | 网易漫画HD | 国际版 |
     */
    export const appId = 0;

    /** 手机品牌 */
    export const brand = 'Apple';

    /** 手机型号 */
    export const model = '16';

    /** 系统版本 */
    export const osver = '16';

    /** 设备指纹, 不区分本地或远程设备指纹，作为推送目标的索引. */
    export const fp = genTraceId() + genTraceId();

    /** 版本号(version_name) */
    export const versionName = '8.14.0';

    /** 首次启动时的毫秒时间戳 */
    export const fts = BigInt(Math.floor(Date.now() / 1000));

    export const userAgent = `Dalvik/2.1.0 (Linux; U; Android 12; ${model} Build/${build}) ${versionName} os/android model/${model} mobi_app/${mobiApp} build/${build} channel/master innerVer/${build} osVer/12 network/2 grpc-java-cronet/1.36.1`;

    const localeIds = LocaleIds.create({ language: 'zh', region: 'CN' });

    /** 发送 grpc 请求 */
    export async function rpc(
        /** 请求url */
        input: RequestInfo | URL,
        /** 请求 body */
        post: Uint8Array,
        /** 登录鉴权 */
        accessKey: string,
        /** 用户uid */
        mid = 0n,
    ) {
        const body = new ArrayBuffer(post.length + 5);
        const dataview = new DataView(body);
        dataview.setUint32(1, post.length); // 写入字节标记
        const uInt8 = new Uint8Array(body);
        uInt8[0] = 1; // 写入压缩标记
        uInt8.set(post, 5); // 写入数据
        const response = await GM.fetch(
            input,
            {
                method: 'POST',
                body,
            },
            [
                {
                    header: 'referer', // grpc 请求不该有referer
                    operation: <any>'remove',
                },
                {
                    header: 'user-agent',
                    operation: <any>'set',
                    value: userAgent,
                },
                {
                    header: 'Content-type',
                    operation: 'set',
                    value: 'application/grpc',
                },
                {
                    header: 'te',
                    operation: 'set',
                    value: 'trailers',
                },
                {
                    header: 'x-bili-gaia-vtoken',
                    operation: 'set',
                    value: '',
                },
                {
                    header: 'x-bili-aurora-eid',
                    operation: 'set',
                    value: genAuroraEid(mid),
                },
                {
                    header: 'x-bili-mid',
                    operation: 'set',
                    value: mid.toString(),
                },
                {
                    header: 'x-bili-aurora-zone',
                    operation: 'set',
                    value: '',
                },
                {
                    header: 'x-bili-trace-id',
                    operation: 'set',
                    value: genTraceId(),
                },
                {
                    header: 'x-bili-fawkes-req-bin',
                    operation: 'set',
                    value: base64.fromUint8Array(FawkesReq.encode({ appkey, env, sessionId }).finish()),
                },
                {
                    header: 'x-bili-metadata-bin',
                    operation: 'set',
                    value: base64.fromUint8Array(Metadata.encode({ accessKey, mobiApp, build, channel, buvid, platform }).finish()),
                },
                {
                    header: 'authorization',
                    operation: 'set',
                    value: `identify_v1 ${accessKey}`,
                },
                {
                    header: 'x-bili-device-bin',
                    operation: 'set',
                    value: base64.fromUint8Array(Device.encode({ appId, build, buvid, mobiApp, platform, channel, brand, model, osver, fpLocal: fp, fpRemote: fp, versionName, fp, fts }).finish()),
                },
                {
                    header: 'x-bili-network-bin',
                    operation: 'set',
                    value: base64.fromUint8Array(Network.encode({ type: NetworkType.WIFI }).finish()),
                },
                {
                    header: 'x-bili-restriction-bin',
                    operation: 'set',
                    value: '',
                },
                {
                    header: 'x-bili-locale-bin',
                    operation: 'set',
                    value: base64.fromUint8Array(Locale.encode({ cLocale: localeIds, sLocale: localeIds }).finish()),
                },
                {
                    header: 'x-bili-exps-bin',
                    operation: 'set',
                    value: '',
                },
                {
                    header: 'buvid',
                    operation: 'set',
                    value: buvid,
                },
                {
                    header: 'grpc-encoding',
                    operation: 'set',
                    value: 'gzip',
                },
                {
                    header: 'grpc-accept-encoding',
                    operation: 'set',
                    value: 'identity,gzip',
                },
            ],
            [
                {
                    header: 'Access-Control-Allow-Credentials', // 允许携带cookie
                    operation: <any>'set',
                    value: 'true',
                },
                {
                    header: 'Access-Control-Allow-Methods', // 允许各种请求方法
                    value: 'GET,POST,PUT,OPTIONS,DELETE',
                    operation: 'set'
                },
                {
                    header: 'Access-Control-Allow-Origin', // 允许请求来源
                    operation: 'set',
                    value: 'https://www.bilibili.com',
                },
                {
                    header: 'Access-Control-Expose-Headers', // 允许读取grpc头
                    operation: 'set',
                    value: 'grpc-status,grpc-message,grpc-status-details-bin,grpc-encoding',
                }
            ]
        );
        const arraybuffer = await response.arrayBuffer();
        // 需要剔除5字节的grpc压缩及字节标记！
        const uint8Array = new Uint8Array(arraybuffer.slice(5));
        return new Response(new Blob([uint8Array]).stream().pipeThrough(new DecompressionStream('gzip')));
    }
}