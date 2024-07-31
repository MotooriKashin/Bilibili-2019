import { Api } from "../../../../..";

export async function status(season_id: number | string) {
    const url = new URL(Api + '/pgc/view/web/season/user/status');
    url.searchParams.set('season_id', <any>season_id);
    const response = await fetch(url, { credentials: 'include' });
    return <ICoins>(await response.json()).result;
}

interface ICoins {
    area_limit: number;
    ban_area_show: number;
    dialog: {
        btn_right: {
            title: string;
            type: string;
        };
        desc: string;
        title: string;
    };
    follow: number;
    follow_status: number;
    login: number;
    pay: number;
    pay_pack_paid: number;
    progress: {
        last_ep_id: number;
        last_ep_index: string;
        last_time: number;
    };
    real_price: string;
    sponsor: number;
    vip_info: {
        due_date: number;
        status: number;
        type: number;
    }
}