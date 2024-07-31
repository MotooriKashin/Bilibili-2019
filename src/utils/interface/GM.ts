/** 消息类型对应的消息内容 */
export interface IGMPostMessage {
    /** 跨域版`fetch` */
    fetch: { input: RequestInfo | URL, init?: RequestInit };
    /** 更新网络拦截规则 */
    updateSessionRules: { rules: any[], tab: boolean };
    /** 移除网络规则集 */
    removeSessionRules: { ids: number[] };
    /** 写入存储 */
    storageSet: { key: string, value: any };
    /** 读取存储 */
    storageGet: { key: string, def: any };
    /** 删除存储 */
    storageRemove: { key: string | string[] };
    /** 清空存储 */
    storageClear: void;
    /** 获取拓展内文件 */
    file: string;
}

/** 消息类型对应的回调参数内容 */
export interface IGMOnMessage {
    /** 跨域版`fetch` */
    fetch: {
        /** HTTP状态码 */
        status: number,
        /** HTTP状态 */
        statusText: string,
        /** 返回标头 */
        header: [string, string][],
        /** 实际URL */
        url: string,
        /** 是否重定向 */
        redirected: boolean,
        /** 请求类型 */
        type: string,
        /** 返回值类型数组转真数组（因为chromebug不支持克隆ArrayBuffer！） */
        data: number[];
    };
    /** 更新网络拦截规则 */
    updateSessionRules: void;
    /** 移除网络规则集 */
    removeSessionRules: void;
    /** 写入存储 */
    storageSet: void;
    /** 读取存储 */
    storageGet: unknown;
    /** 删除存储 */
    storageRemove: void;
    /** 清空存储 */
    storageClear: void;
    /** 获取拓展内文件 */
    file: IGMOnMessage['fetch'];
}