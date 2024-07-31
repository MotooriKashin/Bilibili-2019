/**
 * 查询本地可用字体对象  
 * 需要用户授予访问权限。  
 * 另外，本功能可能会被服务器上设置的权限策略阻止。
 */
declare function queryLocalFonts(options?: IqueryLocalFonts): Promise<FontData[]>;

declare interface IqueryLocalFonts {
    /** 一个包含字体 PostScript 名称的数组。
     * 如果指定了此项，则只有 PostScript 名称与数组中的 PostScript 名称匹配的字体才会包含在结果中；
     * 如果没有，所有字体都将包含在结果中。
     */
    postscriptNames: string[];
}

declare interface FontData {

    /** 字体的字体族 */
    readonly family: string;

    /** 字体的全名 */
    readonly fullName: string;

    /** 字体的 PostScript 名称 */
    readonly postscriptName: string;

    /** 字体的样式 */
    readonly style: string;

    /** 一个会兑现包含底层字体文件的原始字节的 Blob 的 Promise */
    blob(): Promise<Blob>;
}