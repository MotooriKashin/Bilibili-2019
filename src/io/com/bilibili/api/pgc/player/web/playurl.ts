import { Api } from "../../..";
import { RestType } from "../../../../../../code";
import { FNVAL } from "../../../../../../fnval";
import { QUALITY } from "../../../../../../quality";
import { EP_STATUS } from "../../../../../../stat";

export async function pgcPlayurl(
    avid: number,
    cid: number,
    ep_id: number,
    qn = QUALITY.P_8K,
    fnval = FNVAL.DASH_H265 ^ FNVAL.HDR ^ FNVAL.DASH_4K ^ FNVAL.DOLBY_AUDIO ^ FNVAL.DOLBY_VIDEO ^ FNVAL.DASH_8K ^ FNVAL.DASH_AV1,
    fnver = FNVAL.VER,
) {
    const url = new URL(Api + '/pgc/player/web/playurl');
    url.searchParams.set('avid', <any>avid);
    url.searchParams.set('cid', <any>cid);
    url.searchParams.set('ep_id', <any>ep_id);
    url.searchParams.set('qn', <any>qn);
    url.searchParams.set('fnval', <any>fnval);
    url.searchParams.set('fnver', <any>fnver);
    const response = await fetch(url, { credentials: 'include' });
    return <IPlayurl>(await response.json());
}

interface IPlayurl extends RestType {
    result: {
        accept_description: string[];
        accept_format: string;
        accept_quality: QUALITY[];
        clip_info_list: {
            clipType: string;
            end: number;
            materialNo: number;
            start: number;
            toastText: string;
        }[];
        dash?: IDash;
        durl?: IDurl[];
        durls?: {
            durl: IDurl[];
            quality: QUALITY;
        }[];
        fnval: number;
        fnver: FNVAL;
        format: string;
        from: string;
        has_paid: boolean;
        is_drm: boolean;
        is_preview: number;
        message: string;
        quality: QUALITY;
        record_info: { record_icon: string; record: string };
        result: string;
        seek_param: string;
        seek_type: string;
        status: EP_STATUS;
        support_formats: {
            codecs: string[];
            description: string;
            display_desc: string;
            format: string;
            has_preview: boolean;
            need_login: boolean;
            need_vip: boolean;
            new_description: string;
            quality: QUALITY;
            sub_description: string;
            superscript: string;
        }[];
        timelength: number;
        type: string;
        video_codecid: number;
        video_project: boolean;
        vip_status: number;
        vip_type: number;
    }
}

export interface IDurl {
    url: string;
    backup_url: string[];
    length: number;
    size: number;
    order: number;
}

export interface IDash {
    audio: {
        SegmentBase: {
            Initialization: string;
            indexRange: string;
        };
        backupUrl: string[];
        backup_url: string[];
        bandwidth: number;
        baseUrl: string;
        base_url: string;
        codecid: number;
        codecs: string;
        frameRate: string;
        frame_rate: string;
        height: number;
        id: number;
        md5: string;
        mimeType: string;
        mime_type: string;
        sar: string;
        segment_base: {
            index_range: string;
            initialization: string;
        };
        size: number;
        startWithSAP: number;
        start_with_sap: number;
        width: number;
    }[];
    dolby: {
        audio?: IDash['audio'];
        type: number;
    };
    duration: number;
    flac?: {
        audio: IDash['audio'][0];
        display: boolean;
    }
    minBufferTime: number;
    min_buffer_time: number;
    video: IDash['audio'];
}