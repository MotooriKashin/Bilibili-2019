import { crypto } from "../../utils/md5";
import { APP_KEY } from "./key_secret";

/**
 * 对REST API进行参数签名
 * 
 * @param url 未签名的url
 * @param appkey 签名所属平台的appkey，参看{@link APP_KEY}
 * @returns 已签名的url
 */
export function sign(
    url: string | URL,
    appkey: keyof typeof APP_KEY
) {
    const n_url = new URL(url);
    n_url.searchParams.set('appkey', appkey);
    n_url.searchParams.delete('sign');
    n_url.searchParams.sort();
    n_url.searchParams.set('sign', crypto.md5.toHex(n_url.searchParams.toString() + APP_KEY[appkey]));
    return n_url;
}