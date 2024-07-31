import { Api } from "../../..";

export async function coins(aid: number | string) {
    const url = new URL(Api + '/x/web-interface/archive/coins');
    url.searchParams.set('aid', <any>aid);
    const response = await fetch(url, { credentials: 'include' });
    return <ICoins>(await response.json()).data;
}

interface ICoins {
    multiply: number;
}