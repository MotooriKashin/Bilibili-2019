export class Storage {

    #score: Record<string, number> = {};

    #userData: any;

    /**
     * 加载分数排名
     * 
     * @param complete 读取成功回调函数。
     * @param err 读取失败回调函数。
     * @deprecated
     */
    loadRank(complete: Function, err?: Function) {
        complete({ ...this.#score });
    }

    /**
     * 上传分数
     * 
     * @param score 分数。
     * @param name 用户名。
     * @param complete 成功回调函数。
     * @param err 失败回调函数。
     * @deprecated
     */
    uploadScore(score: number, name?: string, complete?: Function, err?: Function) {
        name || (name = '');
        this.#score[name] = score;
        complete?.();
    }

    /**
     * 存储数据
     * 
     * @param userData 存储数据。
     * @param complete 成功回调函数。
     * @param err 失败回调函数。
     * @deprecated
     */
    saveData(userData: any, complete?: Function, err?: Function) {
        this.#userData = userData;
        complete?.();
    }

    /**
     * 读取数据
     * 
     * @param complete 读取成功回调函数。
     * @param err 读取失败回调函数。
     */
    loadData(complete?: Function, err?: Function) {
        complete?.(this.#userData);
    }
}