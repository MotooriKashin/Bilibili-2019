import { Api } from "../../..";

export async function accInfo(mid: string | number,
) {
    if (CATCH[mid]) return CATCH[mid];
    const url = new URL(Api + '/x/space/acc/info');
    url.searchParams.set('mid', <string>mid);
    const response = await fetch(url, { credentials: 'include' });
    const json = await response.json();
    return <IAccInfo>(CATCH[mid] = json.data);
}

const CATCH: Record<string, IAccInfo> = {};

interface IAccInfo {
    birthday: string;
    certificate_show: boolean;
    coins: number;
    contract: {
        is_display: boolean;
        is_follow_display: boolean;
    };
    elec: {
        show_info: {
            icon: string;
            jump_url: string;
            show: boolean;
            state: number;
            titleL: string;
        };
    };
    face: string;
    face_nft: number;
    face_nft_type: number;
    fans_badge: boolean;
    fans_medal: {
        medal: unknown;
        show: boolean;
        wear: boolean;
    };
    gaia_data: unknown;
    gaia_res_type: boolean;
    is_followed: boolean;
    is_risk: boolean;
    is_senior_member: number;
    jointime: number;
    level: number;
    live_room: {
        broadcast_type: number;
        cover: string;
        liveStatus: number;
        roomStatus: number;
        roomid: number;
        roundStatus: number;
        title: string;
        url: string;
        watched_show: {
            icon: string;
            icon_location: string;
            icon_web: string;
            num: number;
            switch: boolean;
            text_large: string;
            text_small: string;
        };
    };
    mcn_info: unknown;
    mid: number;
    moral: number;
    name: string;
    name_render: unknown;
    nameplate: {
        condition: string;
        image: string;
        image_small: string;
        level: string;
        name: string;
        nid: number;
    };
    official: {
        desc: string;
        role: number;
        title: string;
        type: number;
    };
    pendant: {
        expire: number;
        image: string;
        image_enhance: string;
        image_enhance_frame: string;
        n_pid: number;
        name: string;
        pid: number;
    };
    profession: {
        department: string;
        is_show: number;
        name: string;
        title: string;
    };
    rank: number;
    school: unknown;
    series: {
        show_upgrade_window: boolean;
        user_upgrade_status: number;
    };
    sex: string;
    sign: string;
    silence: number;
    sys_notice: [];
    tags: unknown;
    theme: [];
    top_photo: string;
    user_honour_info: {
        colour: unknown;
        is_latest_100honour: number;
        mid: number;
        tags: [];
    };
    vip: {
        avatar_subscript: number;
        due_date: number;
        label: {
            bg_color: string;
            bg_style: number;
            border_color: string;
            img_label_uri_hans: string;
            img_label_uri_hans_static: string;
            img_label_uri_hant: string;
            img_label_uri_hant_static: string;
            label_theme: string;
            path: string;
            text: string;
            text_color: string;
            use_img_label: boolean;
        };
        nickname_color: string;
        role: number;
        status: number;
        theme_type: number;
        tv_due_date: number;
        tv_vip_pay_type: number;
        tv_vip_status: number;
        type: number;
        vip_pay_type: number;
    }
}