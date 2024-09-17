/** DOM 操作封装 */
export namespace Element {

    /**
     * 快速创建 Element
     * 
     * @param tagName 标签铭
     * @param param1 属性配置
     */
    export function add<T extends keyof HTMLElementTagNameMap>(
        tagName: T,
        option?: IAddOption,
    ) {
        const ele = document.createElement(tagName);
        if (option) {
            const { insertTo, appendTo, prependTo, style, attribute, class: classList, data, innerText, innerHTML, children } = option;
            attribute && Object.entries(attribute).forEach(d => { ele.setAttribute(...d) });
            style && Object.entries(style).forEach(([key, value]) => { (<any>ele).style[key] = value });
            classList && ele.classList.add(...Array.isArray(classList) ? classList : [classList]);
            data && Object.entries(data).forEach(([key, value]) => { ele.dataset[key] = value });
            innerText ? (ele.innerText = innerText) : innerHTML ? (ele.innerHTML = innerHTML) : (children && ele.replaceChildren(...Array.isArray(children) ? children : [children]));
            if (insertTo) {
                insertTo.target.insertAdjacentElement(insertTo.where || 'afterend', ele);
            } else {
                appendTo ? appendTo.append(ele) : (prependTo?.prepend(ele));
            }
        }
        return ele;
    }

    interface IAddOption {
        /** 插入到（比`appendTo`和`prependTo`优先级更高） */
        insertTo?: {
            /** 对应节点 */
            target: Element;
            /** 位置，默认为目标同级后 */
            where?: InsertPosition;
        }
        /** 要添加到对应节点的末尾 */
        appendTo?: ParentNode;
        /** 要添加到对应节点的末尾 */
        prependTo?: ParentNode;
        /** 样式 */
        style?: Partial<CSSStyleDeclaration>;
        /** 属性 */
        attribute?: Record<string, string>;
        /** 类（禁止含空格） */
        class?: string | string[];
        /** data-* */
        data?: DOMStringMap;
        /** 子节点字符串 */
        innerHTML?: string;
        /** 子节点文本 */
        innerText?: string;
        /** 子节点（优先级在`innerHTML`和`innerText`之后） */
        children?: Node | Node[];
    }
}