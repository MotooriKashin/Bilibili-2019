import { Api } from "../../..";
import { RestType } from "../../../../../../code";

/** 获取默认搜索内容 */
export async function searchDefault() {
    const response = await fetch(Api + '/x/web-interface/search/default', { credentials: 'include' });
    return <ISearchDefault>await response.json();
}

interface ISearchDefault extends RestType {
    data: {
        goto_type: number;
        goto_value: string;
        id: number;
        name: string;
        seid: string;
        show_name: string;
        type: number;
        url: string;
    }
}