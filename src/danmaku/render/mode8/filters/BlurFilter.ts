import { BitmapFilter } from "./BitmapFilter";
import { BitmapFilterQuality } from "./BitmapFilterQuality";

/**
 * 可使用 BlurFilter 类将模糊视觉效果应用于显示对象。
 * 模糊效果可以柔化图像的细节。
 * 您可以生成一些模糊效果，范围从创建一个柔化的、未聚焦的外观到高斯模糊（就像通过半透明玻璃查看图像一样的朦胧的外观）。
 * 当此滤镜的 quality 属性设置为低时，结果为柔化的、未聚焦的外观。
 * 当 quality 属性设置为高时，该属性接近高斯模糊滤镜。
 * 您可以将滤镜应用于任何显示对象（即，从 DisplayObject 类继承的对象），例如 MovieClip、SimpleButton、TextField 和 Video 对象，以及 BitmapData 对象。  
 * 要创建新的滤镜，请使用构造函数 new BlurFilter()。滤镜的具体使用取决于要应用滤镜的对象：
 *    - 要对影片剪辑、文本字段、按钮和视频应用滤镜，请使用 filters 属性（继承自 DisplayObject）。设置对象的 filters 属性不会修改相应的对象，而清除 filters 属性可以删除相应的滤镜。
 *    - 要对 BitmapData 对象应用滤镜，请使用 BitmapData.applyFilter() 方法。对 BitmapData 对象调用 applyFilter() 会取得源 BitmapData 对象和滤镜对象，并最终生成一个过滤图像。
 * 
 * 如果对显示对象应用滤镜，显示对象的 cacheAsBitmap 属性将设置为 true。
 * 如果删除所有滤镜，将恢复 cacheAsBitmap 的原始值。  
 * 此滤镜支持舞台缩放。
 * 但是，它不支持常规缩放、旋转和倾斜。
 * 如果对象本身进行了缩放（scaleX 和 scaleY 未设置为 100%），滤镜效果将不进行缩放。
 * 只有用户在舞台上进行放大时它才会缩放。  
 * 如果所得图像超过最大尺寸，则不应用滤镜。
 * 在 AIR 1.5 和 Flash Player 10 中，最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。
 * （因此，如果图像的宽度为 8,191 像素，则其高度只能为 2,048 像素。）
 * 在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。
 * 例如，如果在放大某大型影片剪辑时应用了滤镜，则所得图像超过最大尺寸时，将关闭该滤镜。
 */
export class BlurFilter extends BitmapFilter {

    /**
     * 用指定参数初始化滤镜。
     * 默认值会创建一个柔化的、未聚焦的图像。
     * 
     * @param blurX 水平模糊量。有效值为 0 到 255.0（浮点值）。
     * @param blurY 垂直模糊量。有效值为 0 到 255.0（浮点值）。
     * @param quality 应用滤镜的次数。您可以使用 BitmapFilterQuality 常量来指定品质。高品质接近高斯模糊。对于大多数应用，这三个值已足够了。虽然您可以使用不超过 15 的其它数值来达到不同的效果，但是请注意，值越高，呈现速度越慢。
     */
    constructor(
        public blurX = 4,
        public blurY = 4,
        public quality = BitmapFilterQuality.LOW,
    ) {
        super();
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new BlurFilter(this.blurX, this.blurY, this.quality);
    }
}