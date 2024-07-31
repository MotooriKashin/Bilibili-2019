import { BitmapFilter } from "./BitmapFilter";
import { BitmapFilterQuality } from "./BitmapFilterQuality";

/**
 * 可使用 DropShadowFilter 类向显示对象添加投影。
 * 阴影算法基于模糊滤镜使用的同一个框型滤镜。
 * 投影样式有多个选项，包括内侧或外侧阴影和挖空模式。
 * 您可以将滤镜应用于任何显示对象（即，从 DisplayObject 类继承的对象），例如 MovieClip、SimpleButton、TextField 和 Video 对象，以及 BitmapData 对象。  
 * 滤镜的具体使用取决于要应用滤镜的对象：
 *    - 要对显示对象应用滤镜，请使用 filters 属性（继承自 DisplayObject）。设置对象的 filters 属性不会修改相应的对象，而清除 filters 属性可以删除相应的滤镜。
 *    - 要对 BitmapData 对象应用滤镜，请使用 BitmapData.applyFilter() 方法。对 BitmapData 对象调用 applyFilter() 会取得源 BitmapData 对象和滤镜对象，并最终生成一个过滤图像。
 * 
 * 如果对显示对象应用滤镜，则该显示对象的 cacheAsBitmap 属性值将设置为 true。
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
export class DropShadowFilter extends BitmapFilter {

    /**
     * 用指定参数创建新的 DropShadowFilter 实例。
     * 
     * @param distance 阴影的偏移距离，以像素为单位。
     * @param angle 阴影的角度，0 到 360 度（浮点）。
     * @param color 阴影颜色，采用十六进制格式 0xRRGGBB。默认值为 0x000000。
     * @param alpha 阴影颜色的 Alpha 透明度值。有效值为 0.0 到 1.0。例如，0.25 设置透明度值为 25%。
     * @param blurX 水平模糊量。有效值为 0 到 255.0（浮点）。
     * @param blurY 垂直模糊量。有效值为 0 到 255.0（浮点）。
     * @param strength 印记或跨页的强度。该值越高，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255.0。
     * @param quality 应用滤镜的次数。使用 BitmapFilterQuality 常量。
     * @param inner 表示阴影是否为内侧阴影。值 true 指定内侧阴影。值 false 指定外侧阴影（对象外缘周围的阴影）。
     * @param knockout 应用挖空效果 (true)，这将有效地使对象的填色变为透明，并显示文档的背景颜色。
     * @param hideObject 表示是否隐藏对象。如果值为 true，则表示没有绘制对象本身，只有阴影是可见的。
     */
    constructor(
        public distance = 4,
        public angle = 45,
        public color = 0,
        public alpha = 1,
        public blurX = 4,
        public blurY = 4,
        public strength = 1,
        public quality = BitmapFilterQuality.LOW,
        public inner = false,
        public knockout = false,
        public hideObject = false,
    ) {
        super();
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new DropShadowFilter(this.distance, this.angle, this.color, this.alpha, this.blurX, this.blurY, this.strength, this.quality, this.inner, this.knockout, this.hideObject);
    }
}