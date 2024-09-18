/**
 * CSS 样式表转样式节点
 * 
 * @param stylesheet CSS 样式表
 */
export function CSSStyleSheet2HTMLStyleElement(stylesheet: CSSStyleSheet) {
    const style = document.createElement('style');
    style.textContent = [...stylesheet.cssRules].map(d => d.cssText).join('');
    return style;
}