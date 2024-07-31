import { Api } from "../../../..";

export async function favoured(aid: number | string) {
    const url = new URL(Api + '/x/v2/fav/video/favoured');
    url.searchParams.set('aid', <any>aid);
    const response = await fetch(url, { credentials: 'include' });
    return <IFavoured>(await response.json()).data;
}

interface IFavoured {
    count: number;
    favoured: boolean;
}