import { Api } from "../../../..";

export async function like(aid: number | string) {
    const url = new URL(Api + '/x/web-interface/archive/has/like');
    url.searchParams.set('aid', <any>aid);
    const response = await fetch(url, { credentials: 'include' });
    return <number>(await response.json()).data;
}