/** LineScaleMode 类为 Graphics.lineStyle() 方法中的 scaleMode 参数提供值。 */
export enum LineScaleMode {
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细只会水平缩放。 */
    HORIZONTAL = "horizontal",
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细不会缩放。 */
    NONE = "none",
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细会始终随对象的缩放而缩放（默认值）。 */
    NORMAL = "normal",
    /** 将此设置用作 lineStyle() 方法的 scaleMode 参数时，线条粗细只会垂直缩放。 */
    VERTICAL = "vertical",
}