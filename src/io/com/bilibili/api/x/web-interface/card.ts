import { Api } from "../..";

export async function card(
    mid: string | number,
) {
    const url = new URL(Api + '/x/web-interface/card');
    url.searchParams.set('mid', <string>mid);
    url.searchParams.set('photo', '1');
    CATCH[mid] || (CATCH[mid] = fetch(url, { credentials: 'include' }));
    const json = await (await CATCH[mid]).clone().json();
    return <ICard>json.data;
}

card.noCatch = function (mid: string | number,) {
    delete CATCH[mid];
}

const CATCH: Record<string, Promise<Response>> = {};

interface ICard {
    archive_count: number;
    article_count: number;
    card: {
        DisplayRank: string;
        Official: {
            desc: string;
            role: number;
            title: string;
            type: number;
        };
        approve: boolean;
        article: number;
        attention: number;
        attentions: [];
        birthday: string;
        description: string;
        face: string;
        face_nft: number;
        face_nft_type: number;
        fans: number;
        friend: number;
        is_senior_member: boolean;
        level_info: {
            current_exp: number;
            current_level: number;
            current_min: number;
            next_exp: number;
        };
        mid: string;
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
        official_verify: {
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
        place: string;
        rank: string;
        regtime: number;
        sex: string;
        sign: string;
        spacesta: number;
        vip: {
            avatar_subscript: number;
            avatar_subscript_url: string;
            due_date: number;
            label: {
                bg_color: string;
                bg_style: string;
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
            vipStatus: number;
            vipType: number;
            vip_pay_type: number;
        }
    };
    follower: number;
    following: boolean;
    like_num: number;
    space: {
        l_img: string;
        s_img: string;
    }
}