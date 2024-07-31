import { Element } from "../../../../utils/element";
import { BlurFilter } from "../filters/BlurFilter";
import { GlowFilter } from "../filters/GlowFilter";
import { IDisplay } from "./Display";
import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";

/**
 * 此类用于使用 ActionScript 绘图应用程序编程接口 (API) 创建简单形状。
 * Shape 类包括 graphics 属性，该属性使您可以从 Graphics 类访问方法。  
 * Sprite 类也包括 graphics 属性，并且它包括不可用于 Shape 类的其他功能。
 * 例如，Sprite 对象是显示对象容器，而 Shape 对象不是（并且不能包含子显示对象）。
 * 由于此原因，Shape 对象会比包含相同图形的 Sprite 对象消耗的内存少。
 * 但是，Sprite 对象支持用户输入事件，而 Shape 对象却不支持。
 */
export class Shape extends DisplayObject<HTMLDivElement> {

    get filters() {
        return this.$filters;
    }

    set filters(value) {
        this.$filters = value;
        if (value) {
            this.#graphics.$defaultEffects.remove();
            this.#graphics.$defaultEffects = Element.addSvg('defs');
            for (let i = 0, len = value.length; i < len; i++) {
                const filter = value[i];
                const dFilter = Element.addSvg('filter', {
                    id: `fe${i}`,
                    x: '-50%',
                    y: '-50%',
                    width: '200cqi',
                    height: '200cqb',
                });
                if (filter instanceof BlurFilter) {
                    Element.addSvg('feGaussianBlur', {
                        in: 'SourceGraphic',
                        stdDeviation: `${filter.blurX} ${filter.blurY}`,
                    }, dFilter);
                } else if (filter instanceof GlowFilter) {
                    const cR = Math.floor(filter.color / 65536),
                        cG = Math.floor((filter.color % 65536) / 256),
                        cB = filter.color % 256;
                    const cMatrix = [
                        0, 0, 0, cR / 256, 0,
                        0, 0, 0, cG / 256, 0,
                        0, 0, 0, cB / 256, 0,
                        0, 0, 0, 1, 0,
                    ];
                    Element.addSvg('feColorMatrix', {
                        type: 'matrix',
                        values: cMatrix.join(' '),
                    }, dFilter);
                    Element.addSvg('feGaussianBlur', {
                        stdDeviation: `${filter.blurX} ${filter.blurY}`,
                        result: 'coloredBlur',
                    }, dFilter);
                    const m = Element.addSvg('feMerge', undefined, dFilter);
                    Element.addSvg('feMergeNode', { in: 'coloredBlur' }, m);
                    Element.addSvg('feMergeNode', { in: 'SourceGraphic' }, m);
                }
            }
            this.$host.append(this.#graphics.$defaultEffects);
            this.#graphics.$defaultGroup.remove();
            let tGroup = this.#graphics.$defaultContainer;
            for (let i = 0, len = value.length; i < len; i++) {
                const layeredG = Element.addSvg('g', { filter: `url(#fe${i})` });
                layeredG.appendChild(tGroup);
                tGroup = layeredG;
            }
            this.$host.appendChild(tGroup);
            this.#graphics.$defaultGroup = tGroup;
        }
    }

    #graphics: Graphics = new Graphics();

    /** 指定属于此 sprite 的 Graphics 对象，在此 sprite 中可执行矢量绘图命令。 */
    get graphics() {
        return this.#graphics;
    }

    // Shape类使用了width和height进行画板定位
    // 直接修改对应的style将导致画板偏移
    get width() {
        return this.$host.getBoundingClientRect().width;
    }

    set width(value: number) {
        this.$host.style.inlineSize = value + 'px';
        this.#graphics.$defaultContainer.style.cssText = `translate: ${value / 2}px ${this.height / 2}px;`;
    }

    get height() {
        return this.$host.getBoundingClientRect().height;
    }

    set height(value: number) {
        this.$host.style.height = value + 'px';
        this.#graphics.$defaultContainer.style.cssText = `translate: ${this.width / 2}px ${value / 2}px;`;
    }

    constructor(param: IDisplay) {
        super(param, true, <any>Element.addSvg('svg', { class: 'as3-danmaku-item' }));
        const { width, height } = this.root.$host.getBoundingClientRect();
        this.$host.style.cssText = `position: absolute; inline-size: 200cqi; block-size: 200cqb; translate: -50% -50%;`;
        this.#graphics.$defaultContainer.style.cssText = `translate: ${width}px ${height}px;`;
        this.$host.appendChild(this.#graphics.$globalDefs);
        this.$host.appendChild(this.#graphics.$defaultEffects);
        this.$host.appendChild(this.#graphics.$defaultContainer);
        this.init();
    }
}