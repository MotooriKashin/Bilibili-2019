/** Proxy工具 */
export namespace ProxyHook {
    /**
     * 监听对象属性变动
     * @param target 目标对象
     * @param callback 属性变动时的回调，数组的部分操作可能会短时多次回调！
     */
    export function onChange<T extends object>(
        target: T,
        callback: (target: T, key: string | symbol, oldVlue: T[keyof T], newValue?: T[keyof T]) => void,
    ): T {
        return new Proxy(target, {
            deleteProperty: (target, p) => {
                const oldVlue = Reflect.get(target, p)
                queueMicrotask(() => callback(target, p, oldVlue))
                return Reflect.deleteProperty(target, p);
            },
            set: (target, p, newValue, receiver) => {
                const oldVlue = Reflect.get(target, p)
                queueMicrotask(() => callback(target, p, oldVlue, newValue))
                return Reflect.set(target, p, newValue, receiver)
            },
            get: (target, p, receiver) => {
                const res = Reflect.get(target, p, receiver);
                if (typeof res === 'object' && String(res) === '[object Object]') {
                    return onChange(<T>res, callback);
                } else if (Array.isArray(res)) {
                    return onChange(<T>res, callback);
                }
                return res;
            },
        })
    }

    /**
     * 拦截对象属性。**方法除外**
     * @param target 属性所属对象
     * @param propertyKey 属性名
     * @param propertyValue 属性值，用于覆盖原值。覆盖后的属性将无法直接赋值修改。
     * @param configurable 是否允许重复拦截（默认允许）
     * @example
     * property(window,'aaa',1); // 覆盖window对象上的aaa值为1
     */
    export function property(target: object, propertyKey: PropertyKey, propertyValue: any, configurable = true) {
        try {
            Reflect.defineProperty(target, propertyKey, {
                configurable,
                set: v => true,
                get: () => {
                    Reflect.defineProperty(target, propertyKey, { configurable: true, value: propertyValue });
                    return propertyValue;
                }
            });
        } catch (e) { console.error(e) }
    }

    /**
     * 拦截对象属性，在原始值基础上进行修改。
     * @param target 属性所属对象
     * @param propertyKey 属性名
     * @param callback 用于修改原始值的回调，原始值将作为该函数的第一个值传入，请将修改后的值返回
     * @param once 只拦截一次
     */
    export function modify<T>(target: object, propertyKey: PropertyKey, callback: (value: T) => T, once = false) {
        try {
            // 属性已存在直接修改
            let value: T = (<any>target)[propertyKey];
            value && (value = callback(value));
            Reflect.defineProperty(target, propertyKey, {
                configurable: true,
                set: v => {
                    // 修改后来写入的属性
                    value = callback(v);
                    return true;
                },
                get: () => {
                    if (once) {
                        // 固化属性值且不再拦截
                        Reflect.deleteProperty(target, propertyKey);
                        Reflect.set(target, propertyKey, value);
                    }
                    return value
                }
            });
        } catch (e) { console.error(e) }
    }
}