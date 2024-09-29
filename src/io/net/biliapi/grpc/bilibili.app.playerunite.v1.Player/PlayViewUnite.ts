import { Grpc } from "..";
import { Andoroid } from "../../../../Android";
import { PlayViewUniteReq, PlayViewUniteResp } from "../../../../com/bapis/bilibili/app/playerunite/v1/PlayViewUnite";
import { VideoVod } from "../../../../com/bapis/bilibili/playershared/VideoVod";
import { FNVAL } from "../../../../fnval";
import { QUALITY } from "../../../../quality";

/** 统一视频url */
export async function PlayViewUnite(
    {
        accessKey,
        aid,
        cid,
        qn = QUALITY.P_8K,
        extraContent = {},
        preferCodecType = 0,
        mid = 0n,
        fnval = FNVAL.DASH_H265 ^ FNVAL.HDR ^ FNVAL.DASH_4K ^ FNVAL.DOLBY_AUDIO ^ FNVAL.DOLBY_VIDEO ^ FNVAL.DASH_8K ^ FNVAL.DASH_AV1
    }: IPlayViewUnite) {
    const rep = PlayViewUniteReq.encode({
        vod: VideoVod.create({ aid, cid, qn: BigInt(qn), fnval, forceHost: 2, preferCodecType, qnTrial: 1 }),
        extraContent,
    }).finish();
    const body = new Uint8Array(await new Response(new Blob([rep]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
    const res = await Andoroid.rpc(Grpc + '/bilibili.app.playerunite.v1.Player/PlayViewUnite', body, accessKey, mid);
    return PlayViewUniteResp.decode(new Uint8Array(await res.arrayBuffer()));
}

interface IPlayViewUnite {
    /** 登录鉴权 */
    accessKey: string,
    /** 视频aid */
    aid: bigint,
    /** 视频cid */
    cid: bigint,
    /** 清晰度 */
    qn?: QUALITY,
    /** 补充信息, 如ep_id、season_id等 */
    extraContent?: Partial<Record<'ep_id' | 'season_id', string>>;
    /** 用户uid */
    mid?: bigint;
    /** 视频流格式 */
    fnval?: number;
    /**
     * 视频编码
     * | 0 | 1 | 2 | 3 |
     * | :-: | :-: | :-: | :-: |
     * | 不指定 | AVC | HEVC | AV1 |
     */
    preferCodecType?: number;
}