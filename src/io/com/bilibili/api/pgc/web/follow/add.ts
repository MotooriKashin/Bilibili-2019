import { Api } from "../../..";
import { RestType } from "../../../../../../code";

export async function followAdd(
    csrf: string,
    season_id: number | string,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        season_id,
        csrf,
    });
    const response = await fetch(Api + '/pgc/web/follow/add', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <IPgcFollow>await response.json();
}

export interface IPgcFollow extends RestType {
    result: {
        fmid: number;
        relation: boolean;
        status: number;
        toast: string;
    }
}