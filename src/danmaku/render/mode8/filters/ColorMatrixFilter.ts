import { BitmapFilter } from "./BitmapFilter";

/**
 * 使用 ColorMatrixFilter 类可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。
 * 该类允许饱和度更改、色相旋转、亮度为 Alpha 以及各种其他效果。
 * 您可以将滤镜应用于任何显示对象（即，从 DisplayObject 类继承的对象），例如 MovieClip、SimpleButton、TextField 和 Video 对象，以及 BitmapData 对象。  
 * **注意：**对于 RGBA 值，最高有效字节代表红色通道值，其后的有效字节分别代表绿色、蓝色和 Alpha 通道值。  
 * 要创建新的颜色矩阵滤镜，请使用 new ColorMatrixFilter() 语法。
 * 滤镜的具体使用取决于要应用滤镜的对象：
 *    - 要对影片剪辑、文本字段、按钮和视频应用滤镜，请使用 filters 属性（继承自 DisplayObject）。设置对象的 filters 属性不会修改相应的对象，而清除 filters 属性可以删除相应的滤镜。
 *    - 要对 BitmapData 对象应用滤镜，请使用 BitmapData.applyFilter() 方法。对 BitmapData 对象调用 applyFilter() 会取得源 BitmapData 对象和滤镜对象，并最终生成一个过滤图像。
 * 
 * 如果对显示对象应用滤镜，显示对象的 cacheAsBitmap 属性将设置为 true。
 * 如果删除所有滤镜，将恢复 cacheAsBitmap 的原始值。  
 * 如果所得图像超过最大尺寸，则不应用滤镜。在 AIR 1.5 和 Flash Player 10 中，最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。
 * （因此，如果图像的宽度为 8,191 像素，则其高度只能为 2,048 像素。）
 * 在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。
 * 例如，如果在放大某大型影片剪辑时应用了滤镜，则所得图像达到最大尺寸时，将关闭该滤镜。
 */
export class ColorMatrixFilter extends BitmapFilter {

    /**
     * 用指定参数初始化新的 ColorMatrixFilter 实例。
     * 
     * @param _matrix 由 20 个项目（排列成 4 x 5 矩阵）组成的数组。
     */
    constructor(private _matrix = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ]) {
        super();
    }

    /**
     * 由 20 个项目组成的数组，适用于 4 x 5 颜色转换。matrix 属性不能通过直接修改它的值来更改（例如 myFilter.matrix[2] = 1;）。
     * 相反，必须先获取对数组的引用，对引用进行更改，然后重置该值。  
     * 颜色矩阵滤镜将每个源像素分离成它的红色、绿色、蓝色和 Alpha 成分，分别以 srcR、srcG、srcB 和 srcA 表示。
     * 要计算四个通道中每个通道的结果，可将图像中每个像素的值乘以转换矩阵中的值。
     * （可选）可以将偏移量（介于 -255 至 255 之间）添加到每个结果（矩阵的每行中的第五项）中。
     * 滤镜将各颜色成分重新组合为单一像素，并写出结果。  
     * 对于数组中的每个颜色值，值 1 等于正发送到输出的通道的 100%，同时保留颜色通道的值。
     * 计算是对非相乘的颜色值执行的。
     * 如果输入图形由预先相乘的颜色值组成，这些值会自动转换为非相乘的颜色值以执行此操作。
     * 可使用两种经过优化的模式：
     *    - 仅 Alpha。
     *    - 更快的版本。
     * 
     */
    get matrix() {
        return Array.from(this._matrix);
    }
    set matrix(v) {
        this._matrix = Array.from(v);
    }

    /** 返回此滤镜对象的副本。 */
    clone() {
        return new ColorMatrixFilter(this.matrix);
    }
}