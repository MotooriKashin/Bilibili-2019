import { BitmapFilter } from "./BitmapFilter";
import { BitmapFilterQuality } from "./BitmapFilterQuality";
import { BitmapFilterType } from "./BitmapFilterType";

/**
 * 使用 GradientBevelFilter 类可以对显示对象应用渐变斜角效果。
 * 渐变斜角是位于对象外部、内部或顶部的使用渐变色增强的有斜面的边缘。
 * 有斜面的边缘使对象具有三维外观。
 * 您可以将滤镜应用于任何显示对象（即，从 DisplayObject 类继承的对象），例如 MovieClip、SimpleButton、TextField 和 Video 对象，以及 BitmapData 对象。  
 * 滤镜的具体使用取决于要应用滤镜的对象：
 *    - 要对显示对象应用滤镜，请使用 filters 属性。设置对象的 filters 属性不会修改相应的对象，而清除 filters 属性可以删除相应的滤镜。
 *    - 要对 BitmapData 对象应用滤镜，请使用 BitmapData.applyFilter() 方法。对 BitmapData 对象调用 applyFilter() 会取得源 BitmapData 对象和滤镜对象，并最终生成一个过滤图像。
 * 
 * 如果对显示对象应用滤镜，显示对象的 cacheAsBitmap 属性将设置为 true。
 * 如果清除所有滤镜，将恢复 cacheAsBitmap 的原始值。  
 * 此滤镜支持舞台缩放。
 * 但是，它不支持常规缩放、旋转和倾斜；如果对象本身进行了缩放（如果将 scaleX 和 scaleY 设置为除 1.0 以外的其他值），滤镜效果将不进行缩放。
 * 只有用户在舞台上进行放大时它才会缩放。  
 * 如果所得图像超过最大尺寸，则不应用滤镜。
 * 在 AIR 1.5 和 Flash Player 10 中，最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。
 * （因此，如果图像的宽度为 8,191 像素，则其高度只能为 2,048 像素。）
 * 在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。
 * 例如，如果在放大某大型影片剪辑时应用了滤镜，则所得图像超过最大尺寸时，将关闭该滤镜。
 */
export class GradientBevelFilter extends BitmapFilter {

    /**
     * 用指定参数初始化滤镜。
     * 
     * @param distance 偏移距离。有效值为 0 到 8。
     * @param angle 角度，以度为单位。有效值为 0 到 360。
     * @param colors 渐变中使用的 RGB 十六进制颜色值数组。例如，红色为 0xFF0000，蓝色为 0x0000FF 等等。
     * @param alphas colors 数组中对应颜色的 Alpha 透明度值的数组。数组中每个元素的有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
     * @param ratios 颜色分布比例的数组；有效值为 0 到 255。
     * @param blurX 水平模糊量。有效值为 0 到 255。如果模糊量小于或等于 1，则表明原始图像是按原样复制的。默认值为 4。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。
     * @param blurY 垂直模糊量。有效值为 0 到 255。如果模糊量小于或等于 1，则表明原始图像是按原样复制的。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。
     * @param strength 印记或跨页的强度。该值越高，压印的颜色越深，而且斜角与背景之间的对比度也越强。有效值为 0 到 255。值为 0 表示未应用滤镜。
     * @param quality 滤镜的品质。使用 BitmapFilterQuality 常。
     * @param type 斜角效果的放置。可能的值为 BitmapFilterType 常量。
     * @param knockout 指定是否应用挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。
     */
    constructor(
        public distance = 4,
        public angle = 45,
        public colors?: number[],
        public alphas?: number[],
        public ratios?: number[],
        public blurX = 4,
        public blurY = 4,
        public strength = 1,
        public quality = BitmapFilterQuality.LOW,
        public type = BitmapFilterType.INNER,
        public knockout = false,
    ) {
        super();
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new GradientBevelFilter(this.distance, this.angle, this.colors, this.alphas, this.ratios, this.blurX, this.blurY, this.strength, this.quality, this.type, this.knockout);

    }
}