import { ComponentEvent } from "./ComponentEvent";
import { Sprite } from "./Sprite";

/**
 * UIComponent 类是所有可视组件（交互式和非交互式）的基类。
 * 交互式组件被定义为接收用户输入（例如键盘或鼠标活动）的组件。
 * 非交互式组件用于显示数据；它们对用户交互不做响应。
 * ProgressBar 和 UILoader 组件是非交互式组件的示例。  
 * Tab 和箭头键可以用来将焦点移到交互式组件上以及将焦点从交互式组件上移开；交互式组件可以接受低级别事件，例如鼠标和键盘设备的输入。
 * 也可以禁用交互式组件，以便它无法接收鼠标和键盘输入。
 */
export class UIComponent extends Sprite {

    #enabled = true;

    /**
     * 获取或设置一个值，该值指示组件是否可以接受用户交互。 
     * true 值指示组件可以接受用户交互；false 值指示组件无法接受用户交互。  
     * 如果将 enabled 属性设置为 false，则容器的颜色将变暗，并且禁止用户输入（Label 和 ProgressBar 组件除外）。
     * 默认值为 true。
     */
    get enabled() {
        return this.#enabled;
    }

    set enabled(value) {
        this.#enabled = value;
        if (value) {
            (<HTMLButtonElement><HTMLElement>this.$host).disabled && ((<HTMLButtonElement><HTMLElement>this.$host).disabled = false);
            this.$host.style.pointerEvents = '';
        } else {
            (<HTMLButtonElement><HTMLElement>this.$host).disabled = true;
            this.$host.style.pointerEvents = 'none';
        }
    }

    /**
     * 获取或设置一个布尔值，该值指示组件是否可以在用户单击它后获得焦点。 
     * true 值指示其可以获得焦点；false 值指示其无法获得焦点。  
     * 如果该属性为 false，焦点会转移到其 mouseFocusEnabled 属性设置为 true 的第一个父项。  
     * 默认值为 true。
     */
    get focusEnabled() {
        return this.#enabled;
    }

    set focusEnabled(value) {
        this.#enabled = value;
        if (value) {
            (<HTMLButtonElement><HTMLElement>this.$host).disabled && ((<HTMLButtonElement><HTMLElement>this.$host).disabled = false);
            this.$host.style.pointerEvents = '';
        } else {
            (<HTMLButtonElement><HTMLElement>this.$host).disabled = true;
            this.$host.style.pointerEvents = 'none';
        }
    }

    /**
     * 获取或设置为此组件及其同级组件控制焦点的 FocusManager。
     * 每个弹出组件都保留有自己的焦点循环和 FocusManager 实例。 
     * 使用该属性可以访问该组件的正确 FocusManager。
     * @deprecated 暂未实现
     */
    focusManager: unknown;

    /**
     * 获取或设置一个值，该值指示组件是否可以在用户单击它后获得焦点。
     * true 值指示其可以获得焦点；false 值指示其无法获得焦点。  
     * 如果该属性为 false，焦点会转移到其 mouseFocusEnabled 属性设置为 true 的第一个父项。  
     * 默认值为 true。
     */
    get mouseFocusEnabled() { return this.#enabled; }

    set mouseFocusEnabled(value) {
        this.#enabled = value;
        if (value) {
            (<HTMLButtonElement><HTMLElement>this.$host).disabled && ((<HTMLButtonElement><HTMLElement>this.$host).disabled = false);
            this.$host.style.pointerEvents = '';
        } else {
            (<HTMLButtonElement><HTMLElement>this.$host).disabled = true;
            this.$host.style.pointerEvents = 'none';
        }
    }

    /** 组件的版本号。 */
    readonly version = "3.0.3.1";

    #styles: Record<string, any> = {};

    /**
     * 删除此组件实例的样式属性。  
     * 这并不一定会导致 getStyle() 方法返回 undefined 值。
     * 
     * @param style 样式属性的名称。
     */
    clearStyle(style: string) {
        delete this.#styles[style];
    }

    /**
     * 在此组件上显示或隐藏焦点指示符。  
     * UIComponent 类通过创建并放置 focusSkin 样式指定的类的实例来实现该方法。
     * 
     * @param focused 指示是显示还是隐藏焦点指示符。如果该值为 true，则显示焦点指示符；如果该值为 false，则隐藏焦点指示符。
     * @deprecated 暂未实现
     */
    drawFocus(focused: boolean) { }

    /**
     * 启动立即绘制操作，但不像 invalidateNow 那样使全部设置失效。
     * @deprecated 暂未实现
     */
    drawNow() { }

    /**
     * 检索当前具有焦点的对象。  
     * 请注意，此方法不一定返回具有焦点的组件。
     * 它可能返回具有焦点的组件的内部子组件。
     * 若要获取具有焦点的组件，请使用 focusManager.focus 属性。
     * @deprecated 暂未实现
     */
    getFocus() { }

    /**
     * 检索组件的样式查找链中设置的样式属性。  
     * 根据方法检索的样式属性，该方法返回的类型会有所不同。 
     * 可能类型的范围包括 Boolean、String、Number、int、用于 RGB 颜色的 uint、用于外观的 Class 或任何对象类型。  
     * 如果调用该方法来检索特定样式属性，其类型将为已知类型，您可以将其存储在相同类型的变量中。 
     * 不需要进行类型转换。  
     * 如果样式查找链中未设置样式属性，则该方法返回 undefined 值。
     * 注意，undefined 是一个特殊的值，它不同于 false、""、NaN、0 或 null。
     * 如果没有有效的样式值，则总是 undefined。
     * 可以使用静态方法 StyleManager.isValidStyleValue() 来测试是否设置了值。
     * 
     * @param style 样式属性的名称。
     * @returns 样式值。
     */
    getStyle(style: string) {
        return this.#styles[style];
    }

    /**
     * 检索当前组件的默认样式映射。  
     * 样式映射包含适合组件的类型，具体取决于组件使用的样式。
     * @deprecated 暂未实现
     */
    getStyleDefinition() { }

    /**
     * 参照在全局级别、组件级别和实例级别上设置的所有样式，为组件返回指定的样式。  
     * @deprecated 暂未实现
     */
    getStyleValue(name: string) { }

    /**
     * 在未另外指定的情况下，将属性标记为无效，并在下一帧上重绘组件。
     * 
     * @param property 要使其无效的属性。
     * @param callLater 一个布尔值，该值指示是否应该在下一帧上重绘组件。默认值为 true。
     * @deprecated 暂未实现
     */
    invalidate(property: string, callLater = true) { }

    /**
     * 将多个类的样式合并到一个对象中。
     * 如果在多个对象中定义了某种样式，则使用找到的第一个对象的样式。
     * 
     * @param list 包含要合并的默认样式的逗号分隔对象列表。
     * @deprecated 暂未实现
     */
    mergeStyles(...list: unknown[]) { }

    /**
     * 将组件移动到其父项内的指定位置。
     * 这与通过设置其 x 和 y 属性更改组件位置的效果相同。
     * 调用该方法将触发 ComponentEvent.MOVE 事件被调度。  
     * 若要覆盖自定义组件中的 updateDisplayList() 方法，请使用 move() 方法，而不是设置 x 和 y 属性。 
     * 这是因为，对 move() 方法的调用会导致 move 事件对象在移动操作完成以后立即被调度。
     * 相比之下，通过设置 x 和 y 属性更改组件位置时，事件对象会在下一次刷新屏幕时被调度。
     * 
     * @param x 指定组件在其父项内位置的 x 坐标值（以像素为单位）。从左边计算该值。
     * @param y 指定组件在其父项内位置的 y 坐标值（以像素为单位）。从顶部计算该值。
     */
    move(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.dispatchEvent(<any>ComponentEvent.MOVE);
    }

    /**
     * 设置此组件的焦点。
     * 组件可能接下来将焦点提供给子组件。  
     * **注意：**此方法设置焦点时，只有 TextInput 和 TextArea 组件显示焦点指示符。 
     * 所有组件在用户使用 Tab 切换到它时都显示焦点指示符。
     */
    setFocus() {
        this.$host.focus();
    }

    /**
     * 将组件设置为指定宽度和高度。
     * 
     * @param width 组件的宽度，以像素为单位。
     * @param height 组件的高度，以像素为单位。
     */
    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    /**
     * 对此组件实例设置样式属性。
     * 该样式可能会覆盖以全局方式设置的样式。  
     * 调用该方法会导致性能降低。
     * 仅在必要时才使用它。
     * 
     * @param style 样式属性的名称。
     * @param value 样式的值。
     */
    setStyle(style: string, value: object) {
        this.#styles[style] = value;
    }

    /**
     * 验证并更新此对象的属性和布局，如果需要的话重绘对象。  
     * 通常只有当脚本执行完毕后，才会处理需要大量计算的属性。 
     * 这是因为，设置一个属性可能需要处理其他属性。
     * 例如，设置 width 属性可能需要同时计算对象子项或父项的宽度。
     * 而且，如果脚本多次重新计算对象的宽度，则这些相互依赖的属性可能也需要重新计算。
     * 使用该方法可以手动覆盖该行为。
     * @deprecated 暂未实现
     */
    validateNow() { }
}