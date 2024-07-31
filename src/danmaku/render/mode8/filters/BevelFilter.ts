import { BitmapFilter } from "./BitmapFilter";
import { BitmapFilterQuality } from "./BitmapFilterQuality";
import { BitmapFilterType } from "./BitmapFilterType";

/**
 * 可使用 BevelFilter 类对显示对象添加斜角效果。
 * 斜角效果使对象（如按钮）具有三维外观。
 * 您可以利用不同的加亮颜色和阴影颜色、斜角上的模糊量、斜角的角度、斜角的位置和挖空效果来自定义斜角的外观。
 * 您可以将滤镜应用于任何显示对象（即，从 DisplayObject 类继承的对象），例如 MovieClip、SimpleButton、TextField 和 Video 对象，以及 BitmapData 对象。  
 * 要创建新滤镜，请使用构造函数 new BevelFilter()。滤镜的具体使用取决于要应用滤镜的对象：
 *    - 要对影片剪辑、文本字段、按钮和视频应用滤镜，请使用 filters 属性（继承自 DisplayObject）。设置对象的 filters 属性不会修改相应的对象，而清除 filters 属性可以删除相应的滤镜。
 *    - 要对 BitmapData 对象应用滤镜，请使用 BitmapData.applyFilter() 方法。对 BitmapData 对象调用 applyFilter() 会取得源 BitmapData 对象和滤镜对象，并最终生成一个过滤图像。
 * 
 * 如果对显示对象应用滤镜，则该对象的 cacheAsBitmap 属性值将设置为 true。
 * 如果删除所有滤镜，将恢复 cacheAsBitmap 的原始值。  
 * 此滤镜支持舞台缩放。
 * 但是，它不支持常规缩放、旋转和倾斜。
 * 如果对象本身进行了缩放（如果 scaleX 和 scaleY 属性未被设置为 100%），则滤镜不进行缩放。
 * 只有用户在舞台上进行放大时它才会缩放。  
 * 如果所得图像超过最大尺寸，则不应用滤镜。
 * 在 AIR 1.5 和 Flash Player 10 中，最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素
 * 因此，如果图像的宽度为 8,191 像素，则其高度只能为 2,048 像素。）在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。
 * 例如，如果在放大某大型影片剪辑时应用了滤镜，则所得图像超过最大尺寸时，将关闭该滤镜。
 */
export class BevelFilter extends BitmapFilter {

    /**
     * 用指定参数初始化新的 BevelFilter 实例。
     * 
     * @param distance 斜角的偏移距离，以像素为单位（浮点）。
     * @param angle 斜角的角度，0 至 360 度。
     * @param highlightColor 斜角的加亮颜色，0xRRGGBB。
     * @param highlightAlpha 加亮颜色的 Alpha 透明度值。有效值为 0.0 到 1.0。例如，0.25 设置透明度值为 25%。
     * @param shadowColor 斜角的阴影颜色，0xRRGGBB。
     * @param shadowAlpha 阴影颜色的 Alpha 透明度值。有效值为 0.0 到 1.0。例如，0.25 设置透明度值为 25%。
     * @param blurX 水平模糊量，以像素为单位。有效值为 0 到 255.0（浮点）。
     * @param blurY 垂直模糊量，以像素为单位。有效值为 0 到 255.0（浮点）。
     * @param strength 印记或跨页的强度。该值越高，压印的颜色越深，而且斜角与背景之间的对比度也越强。有效值为 0 到 255.0。
     * @param quality 斜角的品质。有效值为 0 至 15，但是对于大多数应用，可以使用 BitmapFilterQuality 常量。这些值越低，滤镜的呈现速度就越快。可以使用其它可用的数值来实现不同的效果。
     * @param type 斜角类型。有效值为 BitmapFilterType 常数：BitmapFilterType.INNER、BitmapFilterType.OUTER 或 BitmapFilterType.FULL。
     * @param knockout 应用挖空效果 (true)，这将有效地使对象的填色变为透明，并显示文档的背景颜色。
     */
    constructor(
        public distance = 4,
        public angle = 45,
        public highlightColor = 0xFFFFFF,
        public highlightAlpha = 1,
        public shadowColor = 0x000000,
        public shadowAlpha = 1,
        public blurX = 4,
        public blurY = 4,
        public strength = 1,
        public quality = BitmapFilterQuality.LOW,
        public type = BitmapFilterType.INNER,
        public knockout = false,
    ) {
        super()
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new BevelFilter(
            this.distance,
            this.angle,
            this.highlightColor,
            this.highlightAlpha,
            this.shadowColor,
            this.shadowAlpha,
            this.blurX,
            this.blurY,
            this.strength,
            this.quality,
            this.type,
            this.knockout
        );
    }
}