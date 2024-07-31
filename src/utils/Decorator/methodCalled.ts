/**
 * 【装饰器】方法被调用，用于开发调试
 */
export function methodCalled<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Return
    >
) {
    return function (this: This, ...args: Args) {
        console.log(`[${context.kind}] ${String(context.name)} called~`, ...args);
        return target.call(this, ...args);
    }
}