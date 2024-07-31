import { Api } from "../../..";
import { REGION } from "../dynamic/region";

export async function region(
    rid: REGION
) {
    const url = new URL(Api + '/x/web-interface/ranking/region');
    url.searchParams.set('rid', <any>rid);
    url.searchParams.set('day', <any>'3');
    url.searchParams.set('original', <any>'0');
    const response = await fetch(url, { credentials: 'include' });
    return <IRegion[]>(await response.json()).data;
}

interface IRegion {
    aid: string;
    author: string;
    coins: number;
    create: string;
    description: string;
    duration: string;
    favorites: number;
    mid: number;
    pic: string;
    play: number;
    review: number;
    subtitle: string;
    title: string;
    typename: string;
    video_review: string;
}