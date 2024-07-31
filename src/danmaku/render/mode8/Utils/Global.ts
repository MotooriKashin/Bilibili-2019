export class Global {

    #value: Record<string, any> = {};

    _set = (key: string, val: any) => {
        this.#value[key] = val;
    }

    _get = (key: string) => {
        return this.#value[key];
    }

    _ = this._get;
}