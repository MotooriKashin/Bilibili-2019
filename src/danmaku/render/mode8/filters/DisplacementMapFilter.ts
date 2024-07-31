import { BitmapData } from "../Display/Bitmap";
import { Point } from "../geom/Point";
import { BitmapFilter } from "./BitmapFilter";
import { DisplacementMapFilterMode } from "./DisplacementMapFilterMode";

/**
 * DisplacementMapFilter 类使用指定的 BitmapData 对象（称为置换图图像）的像素值执行对象置换。
 * 您可以使用此滤镜将扭曲或斑点效果应用于从 DisplayObject 类中继承的任何对象，例如 MovieClip、SimpleButton、TextField 和 Video 对象，以及 BitmapData 对象。  
 * 滤镜的具体使用取决于要应用滤镜的对象：
 *    - 要将滤镜应用于显示对象，请使用显示对象的 filters 属性。设置对象的 filters 属性不会修改相应的对象，而清除 filters 属性可以删除相应的滤镜。
 *    - 要对 BitmapData 对象应用滤镜，请使用 BitmapData.applyFilter() 方法。对 BitmapData 对象调用 applyFilter() 会取得源 BitmapData 对象和滤镜对象，并生成一个过滤后的图像。
 * 
 * 如果对显示对象应用滤镜，则该显示对象的 cacheAsBitmap 属性值将设置为 true。
 * 如果清除所有滤镜，将恢复 cacheAsBitmap 的原始值。  
 * 此滤镜使用以下公式：
 * ```
 * dstPixel[x, y] = srcPixel[x + ((componentX(x, y) - 128) * scaleX) / 256, y + ((componentY(x, y) - 128) *scaleY) / 256)
 * ```
 * 其中，componentX(x, y) 从 mapBitmap 属性获得 (x - mapPoint.x ,y - mapPoint.y) 处的 componentX 属性颜色值。  
 * 滤镜使用的映射图像会进行缩放，以匹配舞台缩放比例。
 * 当对象自身呈一定的比例时，它不会进行缩放。  
 * 此滤镜支持舞台缩放。但不支持常规缩放、旋转和倾斜。
 * 如果对象本身进行了缩放（如果将 scaleX 和 scaleY 属性设置为除 1.0 以外的其它值），滤镜效果将不进行缩放。
 * 只有用户在舞台上进行放大时它才会缩放。
 */
export class DisplacementMapFilter extends BitmapFilter {

    /**
     * 用指定参数初始化 DisplacementMapFilter 实例。
     * 
     * @param mapBitmap 包含置换映射数据的 BitmapData 对象。
     * @param mapPoint 一个值，它包含目标显示对象的左上角相对于映射图像左上角的偏移量。
     * @param componentX 说明在映射图像中使用哪个颜色通道来置换 x 结果。可能的值为 BitmapDataChannel 常量。
     * @param componentY 说明在映射图像中使用哪个颜色通道来置换 y 结果。可能的值为 BitmapDataChannel 常量。
     * @param scaleX 用于缩放映射计算的 x 置换结果的乘数。
     * @param scaleY 用于缩放映射计算的 y 置换结果的乘数。
     * @param mode 滤镜模式。可能的值为 DisplacementMapFilterMode 常量。
     * @param color 指定对于超出范围的替换应用什么颜色。置换的有效范围是 0.0 到 1.0。如果 mode 设置为 DisplacementMapFilterMode.COLOR，则使用此参数。
     * @param alpha  指定对于超出范围的替换应用什么 Alpha 值。它被指定为 0.0 到 1.0 之间的标准值。例如，0.25 设置透明度值为 25%。如果 mode 设置为 DisplacementMapFilterMode.COLOR，则使用此参数。
     */
    constructor(
        public mapBitmap?: BitmapData,
        public mapPoint?: Point,
        public componentX = 0,
        public componentY = 0,
        public scaleX = 0,
        public scaleY = 0,
        public mode = DisplacementMapFilterMode.WRAP,
        public color = 0,
        public alpha = 0,
    ) {
        super();
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new DisplacementMapFilter(this.mapBitmap?.clone(), this.mapPoint?.clone(), this.componentX, this.componentY, this.scaleX, this.scaleY, this.mode, this.color, this.alpha);
    }
}