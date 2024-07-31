/** SpreadMethod 类为 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法中的 spreadMethod 参数提供值。 */
export enum SpreadMethod {
    /** 不重复渐变，使用末尾颜色填充剩下的区域 */
    PAD = "pad",
    /** 交叉镜像重复填充剩下区域 */
    REFLECT = "reflect",
    /** 重复填充剩下区域 */
    REPEAT = "repeat",
}