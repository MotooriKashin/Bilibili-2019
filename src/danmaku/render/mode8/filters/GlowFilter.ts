import { BitmapFilter } from "./BitmapFilter";
import { BitmapFilterQuality } from "./BitmapFilterQuality";

/**
 * 使用 GlowFilter 类可以对显示对象应用发光效果。
 * 有多个用于发光样式的选项，包括内侧发光或外侧发光以及挖空模式。
 * 在投影滤镜的 distance 和 angle 属性设置为 0 时，发光滤镜与投影滤镜极为相似。
 * 您可以将滤镜应用于任何显示对象（即，从 DisplayObject 类继承的对象），例如 MovieClip、SimpleButton、TextField 和 Video 对象，以及 BitmapData 对象。  
 * 滤镜的具体使用取决于要应用滤镜的对象：
 *    - 要对显示对象应用滤镜，请使用 filters 属性（继承自 DisplayObject）。设置对象的 filters 属性不会修改相应的对象，而清除 filters 属性可以删除相应的滤镜。
 *    - 要对 BitmapData 对象应用滤镜，请使用 BitmapData.applyFilter() 方法。对 BitmapData 对象调用 applyFilter() 会取得源 BitmapData 对象和滤镜对象，并最终生成一个过滤图像。
 * 
 * 如果对显示对象应用滤镜，显示对象的 cacheAsBitmap 属性将设置为 true。
 * 如果清除所有滤镜，将恢复 cacheAsBitmap 的原始值。  
 * 此滤镜支持舞台缩放。
 * 但是，它不支持常规缩放、旋转和倾斜。
 * 如果对象本身进行了缩放（如果将 scaleX 和 scaleY 设置为除 1.0 以外的其它值），滤镜将不进行缩放。
 * 只有用户在舞台上进行放大时它才会缩放。  
 * 如果所得图像超过最大尺寸，则不应用滤镜。
 * 在 AIR 1.5 和 Flash Player 10 中，最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。
 * （因此，如果图像的宽度为 8,191 像素，则其高度只能为 2,048 像素。）
 * 在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。
 * 例如，如果在放大某大型影片剪辑时应用了滤镜，则所得图像超过最大尺寸时，将关闭该滤镜。
 */
export class GlowFilter extends BitmapFilter {

    /**
     * 用指定参数初始化新的 GlowFilter 实例。
     * 
     * @param color 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。
     * @param alpha 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
     * @param blurX 水平模糊量。有效值为 0 到 255（浮点）。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。
     * @param blurY 垂直模糊量。有效值为 0 到 255（浮点）。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其它值更快。
     * @param strength 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。
     * @param quality 应用滤镜的次数。使用 BitmapFilterQuality 常量。
     * @param inner 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。
     * @param knockout 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。
     */
    constructor(
        public color = 0xFF0000,
        public alpha = 1,
        public blurX = 6,
        public blurY = 6,
        public strength = 2,
        public quality = BitmapFilterQuality.LOW,
        public inner = false,
        public knockout = false,
    ) {
        super();
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new GlowFilter(this.color, this.alpha, this.blurX, this.blurY, this.strength, this.quality, this.inner, this.knockout);
    }
}