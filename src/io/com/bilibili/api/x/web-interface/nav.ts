import { Api } from "../..";

let CATCH: INav;
export async function nav() {
    if (CATCH) return CATCH;
    const response = await fetch(Api + '/x/web-interface/nav', { credentials: 'include' });
    return CATCH = <INav>(await response.json()).data;
}

interface INav {
    allowance_count: number;
    answer_status: number;
    email_verified: number;
    face: string;
    face_nft: number;
    face_nft_type: number;
    has_shop: boolean;
    isLogin: boolean;
    is_jury: boolean;
    /** 是否硬核会员 */
    is_senior_member: number;
    level_info: {
        current_exp: number;
        current_level: number;
        current_min: number;
        next_exp: string;
    };
    mid: number;
    mobile_verified: number;
    money: number;
    moral: number;
    name_render?: unknown;
    official: {
        desc: string;
        role: number;
        title: string;
        type: number;
    };
    officialVerify: {
        desc: string;
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
    scores: number;
    shop_url: string;
    uname: string;
    vip: {
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
    };
    wallet: {
        bcoin_balance: number;
        coupon_balance: number;
        coupon_due_time: number;
        mid: number;
    };
    wbi_img: {
        img_url: string;
        sub_url: string;
    };
}