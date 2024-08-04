import { crypto } from "../../utils/md5";
import { APP_KEY } from "./key_secret";

/**
 * 对REST API进行参数签名
 * 
 * @param url 未签名的url
 * @param appkey 签名所属平台的appkey，参看{@link APP_KEY}
 * @returns 已签名的url
 */
export function sign<T extends URL | URLSearchParams>(
    url: T,
    appkey: keyof typeof APP_KEY
): T {
    if (url instanceof URLSearchParams) {
        url.set('appkey', appkey);
        url.delete('sign');
        url.sort();
        url.set('sign', crypto.md5.toHex(url.toString() + APP_KEY[appkey]));
        return url;
    }
    url.searchParams.set('appkey', appkey);
    url.searchParams.delete('sign');
    url.searchParams.sort();
    url.searchParams.set('sign', crypto.md5.toHex(url.searchParams.toString() + APP_KEY[appkey]));
    return url;
}