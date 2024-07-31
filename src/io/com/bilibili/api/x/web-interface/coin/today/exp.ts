import { Api } from "../../../..";

export async function coinTodayExp() {
    const response = await fetch(Api + '/x/web-interface/coin/today/exp', { credentials: 'include' });
    return <number>(await response.json()).data;
}