/**
 * 【装饰器】注册自定义节点
 * @param tagName 节点**唯一**名字
 * @param extend 基础节点名字，与被装饰的类的基类严格对应，如`HTMLDivElement`之于`div`。基于`HTMLElement`时不用提供
 */
export function customElement(
    extend?: keyof HTMLElementTagNameMap,
    tagName = `bofqi-${crypto.randomUUID()}`
) {
    return function <Class extends HTMLElement>(
        target: new (...args: any) => Class,
        context: ClassDecoratorContext<new (...args: any) => Class>
    ) {
        context.addInitializer(function () {
            customElements.get(tagName) || customElements.define(tagName, this, extend ? { extends: extend } : void 0);
        })
    }
}