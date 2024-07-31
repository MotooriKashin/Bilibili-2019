/**
 * 提供混合模式可视效果的常量值的类。
 * 这些常量在以下项目中使用：  
 *    - DisplayObject 类的 blendMode 属性。
 *    - BitmapData 类的 draw() 方法的 blendMode 参数
 * 
 */
export enum BlendMode {
    /** 该显示对象出现在背景前面。 */
    NORMAL = "normal",
    /** 强制为该显示对象创建一个透明度组。 */
    LAYER = "layer",
    /** 将显示对象的原色值与背景颜色的原色值相乘，然后除以 0xFF 进行标准化，从而得到较暗的颜色。 */
    MULTIPLY = "multiply",
    /** 将显示对象颜色的补色（反色）与背景颜色的补色相乘，会产生漂白效果。 */
    SCREEN = "screen",
    /** 在显示对象原色和背景颜色中选择相对较亮的颜色（具有较大值的颜色）。 */
    LIGHTEN = "lighten",
    /** 在显示对象原色和背景颜色中选择相对较暗的颜色（具有较小值的颜色）。 */
    DARKEN = "darken",
    /** 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。 */
    ADD = "add",
    /** 从背景颜色的值中减去显示对象原色的值，下限值为 0。 */
    SUBTRACT = "subtract",
    /** 将显示对象的原色与背景颜色进行比较，然后从较亮的原色值中减去较暗的原色值。 */
    DIFFERENCE = "difference",
    /** 反转背景。 */
    INVERT = "invert",
    /** 根据背景的暗度调整每个像素的颜色。 */
    OVERLAY = "overlay",
    /** 根据显示对象的暗度调整每个像素的颜色。 */
    HARDLIGHT = "hardlight",
    /** 将显示对象的每个像素的 Alpha 值应用于背景。 */
    ALPHA = "alpha",
    /** 根据显示对象的 Alpha 值擦除背景。 */
    ERASE = "erase",
    /** 使用着色器来定义对象之间的混合。 */
    SHADER = "shader",
}