import { Ssearch } from "..";

/**
 * 获取搜索建议
 * 
 * @param term 参考词
 * @param userid 用户mid
 * @param signal 中止控制器
 * @returns 建议序列
 */
export async function searchSuggest(
    term: string,
    userid = '0',
    signal?: AbortSignal,
) {
    const url = new URL(Ssearch + '/main/suggest?func=suggest&suggest_type=accurate&sub_type=tag&main_ver=v1&highlight=&bangumi_acc_num=1&special_acc_num=1&topic_acc_num=1&upuser_acc_num=3&tag_num=10&special_num=10&bangumi_num=10&upuser_num=3');
    url.searchParams.set('userid', userid);
    url.searchParams.set('term', term);
    url.searchParams.set('rnd', <any>Math.random());
    url.searchParams.set('_', <any>Date.now());
    const response = await fetch(url, { signal });
    return <ISearchSuggest[]>(await response.json()).result.tag;
}

interface ISearchSuggest {
    name: string;
    ref: number;
    spid: number;
    term: string;
    type: string;
    value: string;
}