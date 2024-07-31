/** cookie工具 */
export namespace cookie {
    export function get(cookieName: string) {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.reduce((s, d) => {
            let key = d.split('=')[0];
            let val = d.split('=')[1];
            s[decodeURIComponent(key)] = decodeURIComponent(val);
            return s;
        }, <Record<string, string>>{});
        return cookie[cookieName];
    }
    export function set(name: string, value: string | boolean | number, days = 365) {
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(
            '' + value,
        )};expires=${exp.toUTCString()}; path=/; domain=.bilibili.com`;
    }
    export function remove(name: string) {
        set(name, '', -1);
    }
}