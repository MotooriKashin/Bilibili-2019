/**
 * JointStyle 类是指定要在绘制线条中使用的联接点样式的常量值枚举。
 * 提供的这些常量用作 flash.display.Graphics.lineStyle() 方法的 joints 参数中的值。
 */
export enum JointStyle {
    /** 在 flash.display.Graphics.lineStyle() 方法的 joints 参数中指定斜角连接。 */
    BEVEL = "bevel",
    /** 在 flash.display.Graphics.lineStyle() 方法的 joints 参数中指定尖角连接。 */
    MITER = "miter",
    /** 在 flash.display.Graphics.lineStyle() 方法的 joints 参数中指定圆角连接。 */
    ROUND = "round",
}