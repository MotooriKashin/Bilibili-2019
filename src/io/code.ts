export interface RestType {
    /** 当且仅当`===0`表示操作成功 */
    code: number;
    /** `code!==0`的错误信息  */
    message: string;
    ttl: number;
}