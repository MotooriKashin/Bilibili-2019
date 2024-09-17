import { Api } from "../..";
import { RestType } from "../../../../../code";
import { FNVAL } from "../../../../../fnval";
import { QUALITY } from "../../../../../quality";
import { IDash, IDurl } from "../../pgc/player/web/playurl";

export async function playurl(
    avid: number,
    cid: number,
    qn = QUALITY.P_8K,
    fnval = FNVAL.DASH_H265 ^ FNVAL.HDR ^ FNVAL.DASH_4K ^ FNVAL.DOLBY_AUDIO ^ FNVAL.DOLBY_VIDEO ^ FNVAL.DASH_8K ^ FNVAL.DASH_AV1,
    fnver = FNVAL.VER,
) {
    const url = new URL(Api + '/x/player/playurl');
    url.searchParams.set('avid', <any>avid);
    url.searchParams.set('cid', <any>cid);
    url.searchParams.set('qn', <any>qn);
    url.searchParams.set('fnval', <any>fnval);
    url.searchParams.set('fnver', <any>fnver);
    const response = await fetch(url, { credentials: 'include' });
    return <IPlayurl>(await response.json());
}

interface IPlayurl extends RestType {
    data: {
        accept_description: string[];
        accept_format: string;
        accept_quality: QUALITY[];
        dash?: IDash;
        durl?: IDurl[];
        format: string;
        from: string;
        high_format?: string;
        last_play_cid: number;
        last_play_time: number;
        message: string;
        quality: QUALITY;
        result: string;
        seek_param: string;
        seek_type: string;
        support_formats: {
            codecs: string[];
            display_desc: string;
            format: string;
            new_description: string;
            quality: QUALITY;
            superscript: string;
        }[];
        timelength: number;
        video_codecid: number;
        view_info: unknown;
    }
}