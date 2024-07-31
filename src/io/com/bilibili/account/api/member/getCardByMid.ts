import { Account } from "../../idenx";

export async function getCardByMid(
    mid: string | number,
) {
    if (CATCH[mid]) return CATCH[mid];
    const url = new URL(Account + '/api/member/getCardByMid');
    url.searchParams.set('mid', <string>mid);
    const response = await fetch(url);
    const json = await response.json();
    return <IGetCardByMid>(CATCH[mid] = json.card);
}

const CATCH: Record<string, IGetCardByMid> = {};

interface IGetCardByMid {
    DisplayRank: string;
    approve: boolean;
    article: number;
    attention: number;
    attentions: number[];
    birthday: string;
    coins: number;
    description: string;
    face: string;
    fans: number;
    friend: number;
    level_info: { next_exp: number; current_level: number; current_min: number; current_exp: number; };
    mid: number;
    name: string;
    nameplate: { condition: string; image: string; image_small: string; level: string; name: string; nid: number };
    official_verify: { type: number; desc: string; };
    pendant: { pid: number; name: string; image: string; expire: number; };
    place: string;
    rank: string;
    regtime: number;
    sex: string;
    sign: string;
    spacesta: number;
}