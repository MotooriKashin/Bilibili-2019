/**
 * 提供了从页面或服务工作线程异步获取和设置 cookie 的方法。  
 * 作为全局范围内的属性来访问。
 * 因此没有构造函数。
 */
declare class CookieStore extends EventTarget {
    /** 任何 cookie 进行更改时会触发该事件 */
    onchange?: (event: CookieChangeEvent) => void;
    private cookieMap;
    get [Symbol.toStringTag](): 'CookieStore';
    constructor(cookieString: string);
    /** 获取具有给定名称或选项对象的单个 cookie */
    get(init?: CookieStoreGetOptions['name'] | CookieStoreGetOptions): Promise<Cookie | undefined>;
    /** 使用给定的名称和值或选项对象设置 cookie */
    set(init: CookieListItem | string, possibleValue?: string): Promise<void>;
    /** 获取所有匹配的 cookie */
    getAll(init?: CookieStoreGetOptions['name'] | CookieStoreGetOptions): Promise<Cookie[]>;
    /** 删除具有给定名称或选项对象的 cookie */
    delete(init: CookieStoreDeleteOptions['name'] | CookieStoreDeleteOptions): Promise<void>;
}

declare var cookieStore: CookieStore;

declare interface Cookie {
    /** 包含 cookie 域的字符串。 */
    domain?: string;
    /** 时间戳，以Unix 时间（以毫秒为单位）表示，包含 cookie 的到期日期。 */
    expires?: number;
    /** 包含 cookie 名称的字符串 */
    name: string;
    /** 包含 cookie 路径的字符串。 */
    path?: string;
    /** 一个布尔值，指示 cookie 是否仅在安全上下文中使用（`true`）或不（`false`）。 */
    secure?: boolean;
    /**
     * 以下值之一：
     * - `strict` Cookie 只会在第一方上下文中发送，不会与第三方网站发起的请求一起发送。
     * - `lax` Cookie 不会在正常的跨站点子请求（例如将图像或框架加载到第三方站点）中发送，而是在用户在原始站点内导航时（即点击链接时）发送。
     * - `none` Cookie 将在所有情况下发送。
     */
    sameSite?: CookieSameSite;
    /** 包含 cookie 值的字符串。 */
    value: string;
    httpOnly?: boolean;
    /** 一个布尔值，指示 cookie 是否是分区 cookie ( true) 或不是 ( false)。 */
    partitioned?: boolean;
}
declare interface CookieStoreDeleteOptions {
    /** 带有 cookie 名称的字符串。 */
    name: string;
    /** 带有 cookie 域的字符串。默认为null. */
    domain?: string;
    /** 包含路径的字符串。默认为/. */
    path?: string
    /** 一个布尔值，默认为false。将其设置为true指定要删除的 cookie 将是分区 cookie。 */
    partitioned?: boolean;
}
declare interface CookieStoreGetOptions {
    /** 带有 cookie 名称的字符串。 */
    name?: string;
    /** 带有 cookie URL 的字符串。 */
    url?: string;
}
declare type CookieSameSite = 'strict' | 'lax' | 'none';
declare interface CookieListItem {
    /** 带有 cookie 名称的字符串。 */
    name?: string;
    /** 包含 cookie 值的字符串。 */
    value?: string;
    /** 包含 cookie 域的字符串。默认为null */
    domain: string | null;
    /** 包含 cookie 路径的字符串。默认为/. */
    path?: string;
    /** 时间戳，以Unix 时间（以毫秒为单位）表示，包含 cookie 的到期日期。默认为null. */
    expires: Date | number | null;
    secure?: boolean;
    /**
     * 以下值之一：
     * - `strict` Cookie 只会在第一方上下文中发送，不会与第三方网站发起的请求一起发送。这是默认设置。
     * - `lax` Cookie 不会在正常的跨站点子请求（例如将图像或框架加载到第三方站点）中发送，而是在用户在原始站点内导航时（即点击链接时）发送。
     * - `none` Cookie 将在所有情况下发送。
     */
    sameSite?: CookieSameSite;
    httpOnly?: boolean;
    /** 一个布尔值，默认为false。如果设置为true，则设置的 cookie 将是分区 cookie。 */
    partitioned?: boolean;
}
declare type CookieList = CookieListItem[];
declare interface CookieChangeEventInit extends EventInit {
    changed: CookieList;
    deleted: CookieList;
}

declare interface CookieChangeEvent extends Event {
    changed: CookieList;
    deleted: CookieList;
    constructor(type: string, eventInitDict?: CookieChangeEventInit);
}