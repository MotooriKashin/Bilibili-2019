import { BitmapFilter } from "./BitmapFilter";

/**
 * 用于矩阵转换的值的数组。
 * 数组中的项数必须等于 matrixX * matrixY。  
 * 矩阵盘绕基于一个 n x m 矩阵，该矩阵说明输入图像中的给定像素值如何与其相邻的像素值合并以生成最终的像素值。
 * 每个结果像素通过将矩阵应用到相应的源像素及其相邻像素来确定。  
 * 对于 3 x 3 矩阵卷积，将以下公式用于每个独立的颜色通道：
 * ```
 * dst (x, y) = ((src (x-1, y-1) * a0 + src(x, y-1) * a1....
 *    src(x, y+1) * a7 + src (x+1,y+1) * a8) / divisor) + bias
 * ```
 * 某些规格的滤镜在由提供 SSE（SIMD 流扩展）的处理器运行时执行速度更快。
 * 以下是更快的卷积操作的条件：
 *    - 滤镜必须是 3x3 滤镜。
 *    - 所有滤镜项必须是介于 -127 和 +127 之间的整数。
 *    - 所有滤镜项的总和不能包含大于 127 的绝对值。
 *    - 如果任何滤镜项为负，则除数必须介于 2.00001 和 256 之间。
 *    - 如果所有滤镜项都为正，则除数必须介于 1.1 和 256 之间。
 *    - 偏差必须是整数。
 * 
 * **注意：**如果使用不带参数的构造函数创建了 ConvolutionFilter 实例，则为矩阵属性赋值的顺序将影响滤镜的行为。
 */
export class ConvolutionFilter extends BitmapFilter {

    /**
     * 用指定参数初始化 ConvolutionFilter 实例。
     * 
     * @param matrixX 矩阵的 x 维度（矩阵中列的数目）。默认值为 0。
     * @param matrixY 矩阵的 y 维度（矩阵中行的数目）。默认值为 0。
     * @param matrix 用于矩阵转换的值的数组。数组中的项数必须等于 matrixX * matrixY。
     * @param divisor 矩阵转换中使用的除数。默认值为 1。如果除数是所有矩阵值的总和，则可调平结果的总体色彩强度。忽略 0 值，此时使用默认值。
     * @param bias 要添加到矩阵转换结果的偏差。默认值为 0。
     * @param preserveAlpha false 值表示未保留 Alpha 值，并且卷积适用于所有通道（包括 Alpha 通道）。值为 true 表示只对颜色通道应用卷积。默认值为 true。
     * @param clamp 对于源图像之外的像素，如果值为 true，则表明通过复制输入图像给定边缘处的颜色值，沿着输入图像的每个边框按需要扩展输入图像。如果值为 false，则表明应按照 color 和 alpha 属性中的指定使用其他颜色。默认值为 true。
     * @param color 要替换源图像之外的像素的十六进制颜色。
     * @param alpha 替换颜色的 Alpha。
     */
    constructor(
        public matrixX = 0,
        public matrixY = 0,
        public matrix?: number[],
        public divisor = 1,
        public bias = 0,
        public preserveAlpha = true,
        public clamp = true,
        public color = 0,
        public alpha = 0,
    ) {
        super();
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new ConvolutionFilter(this.matrixX, this.matrixY, this.matrix, this.divisor, this.bias, this.preserveAlpha, this.clamp, this.color, this.alpha);
    }
}