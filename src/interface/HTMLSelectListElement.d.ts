/**
 * @deprecated
 * 关于可定制<select>元素的提案  
 * chromiun >= 97
 * 且必须启用`Experimental Web Platform features`标记
 */
declare var HTMLSelectListElement: {
    prototype: HTMLSelectElement;
    new(): HTMLSelectElement;
};

/** @deprecated */
declare interface HTMLSelectListElement extends HTMLSelectElement { };