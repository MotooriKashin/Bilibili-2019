import { Api } from "../../../..";
import { RestType } from "../../../../../../../code";

export async function coinTodayExp() {
    const response = await fetch(Api + '/x/web-interface/coin/today/exp', { credentials: 'include' });
    return <ICoinTodayExp>await response.json();
}

interface ICoinTodayExp extends RestType {
    data: number;
}