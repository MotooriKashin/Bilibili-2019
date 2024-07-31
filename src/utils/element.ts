/** DOM 操作的封装 */
export namespace Element {

    /**
     * 创建HTML节点
     * 
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    export function add<T extends keyof HTMLElementTagNameMap>(
        tag: T,
        attribute?: Record<string, string | number | boolean>,
        parrent?: HTMLElement,
        innerHTML?: string,
        top?: boolean,
        replaced?: Element,
    ): HTMLElementTagNameMap[T] {
        const element = document.createElement(tag);
        attribute && (Object.entries(attribute).forEach(d => {
            Object.hasOwn(attribute, d[0]) && element.setAttribute(d[0], <string>d[1])
        }));
        innerHTML && element.insertAdjacentHTML('beforeend', innerHTML);
        replaced
            ? replaced.replaceWith(element)
            : parrent && (top
                ? parrent.insertAdjacentElement('afterbegin', element)
                : parrent.insertAdjacentElement('beforeend', element)
            )
        return element;
    }

    /**
     * 生成svg系节点
     * 
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点
     */
    export function addSvg<T extends keyof SVGElementTagNameMap>(
        tag: T,
        attribute?: Record<string, string | number | boolean>,
        parrent?: ParentNode,
    ) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", tag);
        attribute && (Object.entries(attribute).forEach(d => {
            Object.hasOwn(attribute, d[0]) && svg.setAttribute(d[0], <string>d[1])
        }));
        parrent && parrent.append(svg);
        return svg;
    }

    /**
     * 加载外源脚本，
     * 支持加载完成后执行回调函数或者返回Promise
     * 
     * @param src 外源脚本url
     * @param onload 加载完成后的回调函数
     */
    export function loadScript(src: string, onload?: () => void) {
        return new Promise((r, j) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload && onload();
                r(true);
            });
            script.addEventListener('error', () => {
                script.remove();
                j();
            });
            (document.body || document.head || document.documentElement || document).appendChild(script);
        });
    }
}