import { Api } from "../../../..";

/**
 * 添加收藏夹
 * 
 * @returns 收藏夹`fid`
 */
export async function favFolderAdd(
    csrf: string,
    name: string,
) {
    const headers = new Headers({
        'Content-type': 'application/x-www-form-urlencoded'
    });
    const body = new URLSearchParams(<any>{
        name,
        csrf,
    });
    const response = await fetch(Api + '/x/v2/fav/folder/add', {
        method: 'POST',
        credentials: 'include',
        headers,
        body,
    });
    return <number>(await response.json()).data.fid;
}