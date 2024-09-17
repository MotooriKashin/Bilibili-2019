import { Api } from "../..";
import { IRegion, REGION } from "./dynamic/region";

export async function newlist(
    rid: REGION
) {
    const url = new URL(Api + '/x/web-interface/newlist');
    url.searchParams.set('rid', <any>rid);
    url.searchParams.set('ps', <any>'15');
    const response = await fetch(url, { credentials: 'include' });
    return <IRegion>await response.json();
}