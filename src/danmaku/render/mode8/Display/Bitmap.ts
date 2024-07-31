import { Element } from "../../../../utils/element";
import { BitmapFilter } from "../filters/BitmapFilter";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { BlendMode } from "./BlendMode";
import { ByteArray } from "./ByteArray";
import { DirtyArea } from "./DirtyArea";
import { IDisplay } from "./Display";
import { DisplayObject, rootSprite } from "./DisplayObject";
import { Event } from "./Event";
import { Simple2D } from "./Simple2D";
import { StageQuality } from "./StageQuality";

/**
 * 使用 BitmapData 类，您可以处理 Bitmap 对象的数据（像素）。
 * 可以使用 BitmapData 类的方法创建任意大小的透明或不透明位图图像，并在运行时采用多种方式操作这些图像。
 * 也可以访问使用 flash.display.Loader 类加载的位图图像的 BitmapData。  
 * 此类允许您将位图呈现操作与 Flash Player 的内部显示更新例程分隔开来。
 * 通过直接操作 BitmapData 对象，您可以创建复杂的图像，不会因连续重新绘制矢量数据的内容而产生每帧开销。  
 * BitmapData 类的方法支持通过可用于非位图显示对象的滤镜无法得到的效果。  
 * BitmapData 对象包含像素数据的数组。
 * 此数据可以表示完全不透明的位图，或表示包含 Alpha 通道数据的透明位图。
 * 以上任一类型的 BitmapData 对象都作为 32 位整数的缓冲区进行存储。
 * 每个 32 位整数确定位图中单个像素的属性。  
 * 每个 32 位整数都是四个 8 位通道值（从 0 到 255）的组合，这些值描述像素的 Alpha 透明度以及红色、绿色、蓝色 (ARGB) 值。
 * （对于 ARGB 值，最高有效字节代表 Alpha 通道值，其后的有效字节分别代表红色、绿色和蓝色通道值。）  
 * 将这四个通道（Alpha、红色、绿色和蓝色）与 BitmapData.copyChannel() 方法或 DisplacementMapFilter.componentX 及 DisplacementMapFilter.componentY 属性一起使用时，这些通道以数字形式表示，并且这些数字在 BitmapDataChannel 类中由常量。  
 * 通过使用 Bitmap 对象的 bitmapData 属性，可以将 BitmapData 对象附加到 Bitmap 对象。  
 * 可以使用 Graphics.beginBitmapFill() 方法用 BitmapData 对象填充 Graphics 对象。  
 * 在 AIR 运行时中，DockIcon、Icon、InteractiveIcon 和 SystemTrayIcon 类中的每个类都包括一个 bitmaps 属性，该属性是定义图标的位图图像的 BitmapData 对象的数组。  
 * 在 AIR 1.5 和 Flash Player 10 中，BitmapData 对象的最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。
 * （因此，如果 BitmapData 对象的宽度为 8,191 像素，则其高度只能为 2,048 像素。）
 * 在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。  
 * 从 AIR 3 和 Flash Player 11 开始，已删除了对 BitmapData 对象的大小限制。
 * 现在，位图的最大大小取决于操作系统。  
 * 如果 BitmapData 对象无效（例如，如果它的 height == 0 且 width == 0），或者已通过 dispose() 处理了该对象，则对 BitmapData 对象的任何方法或属性的调用都会引发 ArgumentError 错误。
 */
export class BitmapData {

    private locked = false;

    protected dirtyArea = new DirtyArea();

    private _data: ImageData;

    protected $rect: Rectangle;

    protected byteArray: number[] = [];

    protected _notifyList: Bitmap[] = [];

    /** 定义位图图像大小和位置的矩形。矩形的顶部和左侧为零；宽度和高度等于 BitmapData 对象的宽度和高度（以像素为单位）。 */
    get rect() {
        return this.$rect;
    }

    /**
     * 创建一个具有指定的宽度和高度的 BitmapData 对象。
     * 如果为 fillColor 参数指定一个值，则位图中的每个像素都将设置为该颜色。  
     * 默认情况下，将位图创建为透明位图，除非您为 transparent 参数传递值 false。
     * 创建了不透明位图后，将无法将其更改为透明位图。
     * 不透明位图中的每个像素仅使用 24 位的颜色通道信息。
     * 如果将位图定义为透明，则每个像素将使用 32 位的颜色通道信息，其中包括 Alpha 透明度通道。  
     * 在 AIR 1.5 和 Flash Player 10 中，BitmapData 对象的最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。
     * （因此，如果 BitmapData 对象的宽度为 8,191 像素，则其高度只能为 2,048 像素。）
     * 在 Flash Player 9 及早期版本和 AIR 1.1 及早期版本中，高度最大为 2,880 像素，宽度最大为 2,880 像素。
     * 如果指定的宽度值或高度值大于 2880，则不会创建新实例。
     * 
     * @param width 位图图像的宽度，以像素为单位。
     * @param height 位图图像的高度，以像素为单位。
     * @param transparent 指定位图图像是否支持每个像素具有不同的透明度。默认值为 true（透明）。要创建完全透明的位图，请将 transparent 参数的值设置为 true，将 fillColor 参数的值设置为 0x00000000（或设置为 0）。将 transparent 属性设置为 false 可以略微提升呈现性能。
     * @param fillColor 用于填充位图图像区域的 32 位 ARGB 颜色值。默认值为 0xFFFFFFFF（纯白色）。
     */
    constructor(
        public width: number,
        public height: number,
        public transparent = true,
        public fillColor = 0xFFFFFFFF,
    ) {
        this.$rect = new Rectangle(0, 0, width, height);
        this._data = new ImageData(width, height);
        for (let i = 0; i < width * height; i++) {
            this.byteArray.push(fillColor);
        }
    }

    /**
     * 取得一个源图像和一个滤镜对象，并生成过滤的图像。  
     * 此方法依赖于内置滤镜对象的行为，这些对象确定受输入源矩形影响的目标矩形。  
     * 应用滤镜后，结果图像可能会大于输入图像。
     * 例如，如果使用 BlurFilter 类来模糊源矩形 (50,50,100,100)，并且目标点为 (10,10)，则在目标图像中更改的区域将会由于该模糊处理而大于 (10,10,60,60)。
     * 这会在 applyFilter() 调用过程中在内部发生。  
     * 如果 sourceBitmapData 参数的 sourceRect 参数是内部区域，如 200 x 200 图像中的 (50,50,100,100)，则滤镜会使用 sourceRect 参数外部的源像素来生成目标矩形。  
     * 如果 BitmapData 对象和指定为 sourceBitmapData 参数的对象是同一对象，应用程序将使用该对象的临时副本来执行滤镜。
     * 为了获得最佳性能，请避免这种情况。
     * 
     * @param sourceBitmapData 要使用的输入位图图像。源图像可以是另一个 BitmapData 对象，也可以引用当前 BitmapData 实例。
     * @param sourceRect 定义要用作输入的源图像区域的矩形。
     * @param destPoint 目标图像（当前 BitmapData 实例）中与源矩形的左上角对应的点。
     * @param filter 用于执行过滤操作的滤镜对象。每种滤镜都有某些要求，如下所示：
     *    - BlurFilter — 此滤镜可使用不透明或透明的源图像和目标图像。如果这两种图像的格式不匹配，则在过滤过程中生成的源图像副本将与目标图像的格式匹配。
     *    - BevelFilter、DropShadowFilter、GlowFilter — 这些滤镜的目标图像必须是透明图像。调用 DropShadowFilter 或 GlowFilter 会创建包含投影或发光的 Alpha 通道数据的图像。它不会在目标图像上创建投影。如果将这些滤镜中的任何滤镜用于不透明的目标图像，将会引发异常。
     *    - ConvolutionFilter — 此滤镜可使用不透明或透明的源图像和目标图像。
     *    - ColorMatrixFilter — 此滤镜可使用不透明或透明的源图像和目标图像。
     *    - DisplacementMapFilter — 此滤镜可使用不透明或透明的源图像和目标图像，但源图像和目标图像的格式必须相同。
     * 
     * @deprecated 暂未实现
     */
    applyFilter(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, filter: BitmapFilter) { }

    /** 返回一个新的 BitmapData 对象，它是对原始实例的克隆，包含与原始实例所含位图完全相同的副本。 */
    clone() {
        const data = new BitmapData(this.width, this.height, this.transparent, this.fillColor);
        data.byteArray = this.byteArray.slice(0);
        data._updateBox(data.rect);
        return data;
    }

    /**
     * 使用 ColorTransform 对象调整位图图像的指定区域中的颜色值。
     * 如果矩形与位图图像的边界匹配，则此方法将转换整个图像的颜色值。
     * 
     * @param rect 一个 Rectangle 对象，它定义在其中应用 ColorTransform 对象的图像区域。
     * @param colorTransform 一个 ColorTransform 对象，它描述要应用的颜色转换值。
     * @deprecated 暂未实现
     */
    colorTransform(rect: Rectangle, colorTransform: ColorTransform) { }

    /**
     * 比较两个 BitmapData 对象。
     * 如果两个 BitmapData 对象的尺寸（宽度和高度）相同，该方法将返回一个新的 BitmapData 对象，其中的每个像素都是两个源对象中的像素之间的“差”：
     *    - 如果两个像素相等，则差异像素为 0x00000000。
     *    - 如果两个像素具有不同的 RGB 值（忽略 Alpha 值），则差异像素为 0xRRGGBB，其中 RR/GG/BB 分别是红色、绿色和蓝色通道之间的个别差异值（源对象中的像素值减去 otherBitmapData 对象中的像素值）。本例中忽略了 Alpha 通道差异。
     *    - 如果只有 Alpha 通道值不同，则像素值为 0xZZFFFFFF，其中 ZZ 是 Alpha 值差异（源对象中的 Alpha 值减去 otherBitmapData 对象中的 Alpha 值）。
     * 
     * **注意：**用于填充这两个 BitmapData 对象的颜色具有略微不同的 RGB 值（0xFF0000 和 0xFFAA00）。
     * compare() 方法的结果是一个新的 BitmapData 对象，其中的每个像素都显示两个位图之间 RGB 值的差异。  
     * 如果 BitmapData 对象相同（宽度、高度和像素值都相同），则方法返回数字 0。  
     * 如果这两个 BitmapData 对象的宽度不相等，则该方法返回数字 -3。  
     * 如果 BitmapData 对象的高度不相等，但宽度相同，则方法返回数字 -4。  
     * 
     * @param otherBitmapData 要与源 BitmapData 对象比较的 BitmapData 对象。
     * @deprecated 暂未实现
     */
    compare(otherBitmapData: BitmapData) { }

    /**
     * 将数据从另一个 BitmapData 对象或当前 BitmapData 对象的一个通道传输到当前 BitmapData 对象的某个通道中。
     * 目标 BitmapData 对象的其他通道中的所有数据都将被保留。
     * 
     * @param sourceBitmapData 要使用的输入位图图像。源图像可以是另一个 BitmapData 对象，也可以指当前 BitmapData 对象。
     * @param sourceRect 源 Rectangle 对象。若只想复制位图内较小区域中的通道数据，请指定一个小于 BitmapData 对象整体大小的源矩形。
     * @param destPoint  目标 Point 对象，它表示将要在其中放置新通道数据的矩形区域的左上角。若只想将通道数据从目标图像中的一个区域复制到其他区域，请指定一个 (0,0) 以外的点。
     * @param sourceChannel 源通道。使用来自 BitmapDataChannel 类（BitmapDataChannel.RED、BitmapDataChannel.BLUE、BitmapDataChannel.GREEN、BitmapDataChannel.ALPHA）的值。
     * @param destChannel 目标通道。使用来自 BitmapDataChannel 类（BitmapDataChannel.RED、BitmapDataChannel.BLUE、BitmapDataChannel.GREEN、BitmapDataChannel.ALPHA）的值。
     * @deprecated 暂未实现
     */
    copyChannel(
        sourceBitmapData: BitmapData,
        sourceRect: Rectangle,
        destPoint: Point,
        sourceChannel: number,
        destChannel: number,
    ) { }

    /**
     * 为没有拉伸、旋转或色彩效果的图像之间的像素处理提供一个快速例程。
     * 此方法在目标 BitmapData 对象的目标点将源图像的矩形区域复制为同样大小的矩形区域。  
     * 如果包括 alphaBitmap 参数和 alphaPoint 参数，则可以将另一个图像用作源图像的 Alpha 源。
     * 如果源图像具有 Alpha 数据，则这两组 Alpha 数据都用于将源图像中的像素组合到目标图像中。
     * alphaPoint 参数是 Alpha 图像中与源矩形左上角对应的点。
     * 源图像和 Alpha 图像交叉区域之外的任何像素都不会被复制到目标图像。  
     * mergeAlpha 属性控制在将透明图像复制到另一透明图像时是否使用 Alpha 通道。
     * 要复制含有 Alpha 通道数据的像素，请将 mergeAlpha 属性设置为 true。
     * 默认情况下，mergeAlpha 属性为 false。
     * 
     * @param sourceBitmapData 要从中复制像素的输入位图图像。源图像可以是另一个 BitmapData 实例，也可以指当前 BitmapData 实例。
     * @param sourceRect 定义要用作输入的源图像区域的矩形。
     * @param destPoint 目标点，它表示将在其中放置新像素的矩形区域的左上角。
     * @param alphaBitmapData 第二个 Alpha BitmapData 对象源。
     * @param alphaPoint Alpha BitmapData 对象源中与 sourceRect 参数的左上角对应的点。
     * @param mergeAlpha 要使用 Alpha 通道，请将该值设置为 true。要复制不含 Alpha 通道的像素，请将该值设置为 false。
     */
    copyPixels(
        sourceBitmapData: BitmapData,
        sourceRect: Rectangle,
        destPoint: Point,
        alphaBitmapData?: BitmapData,
        alphaPoint?: Point,
        mergeAlpha = false,
    ) {
        this.lock();
        for (let x = 0; x < sourceRect.width; x++) {
            for (let y = 0; y < sourceRect.height; y++) {
                this.setPixel32(x + destPoint.x, y + destPoint.y, sourceBitmapData.getPixel32(x + sourceRect.x, y + sourceRect.y));
            }
        }
        this.unlock();
    }

    /**
     * 根据像素数据的矩形区域填充一个字节数组。
     * 从 ByteArray 的 position 索引开始，此方法为每个像素将一个无符号整数（32 位未经相乘的像素值）写入字节数组。
     * 如果需要，字节数组的大小将增大到必要的字节数以容纳所有像素数据。
     * 
     * @param rect 当前 BitmapData 对象中的一个矩形区域
     * @param data 目标 ByteArray 对象
     * @deprecated 暂未实现
     */
    copyPixelsToByteArray(rect: Rectangle, data: number[]) { }

    /**
     * 释放用来存储 BitmapData 对象的内存。  
     * 对图像调用 dispose() 方法时，该图像的宽度和高度将设置为 0。
     * 对此 BitmapData 实例的方法或属性的所有后续调用都将失败，并引发异常。  
     * BitmapData.dispose() 立即释放由实际的位图数据占用的内存（一个位图最多可使用 64 MB 的内存）。
     * 使用 BitmapData.dispose() 后，BitmapData 对象不再可用，而且，如果对 BitmapData 对象调用函数，Flash 运行时将引发异常。
     * 但是，BitmapData.dispose() 不会将 BitmapData 对象（大约 128 个字节）作为垃圾回收；由实际的 BitmapData 对象占用的内存在垃圾回收器收集 BitmapData 对象时释放。
     */
    dispose() { }

    /**
     * 使用 Flash 运行时矢量渲染器在位图图像上绘制 source 显示对象。
     * 可以指定 matrix、colorTransform、blendMode 和目标 clipRect 参数来控制呈现的执行方式。
     * 您可以根据需要指定是否应在缩放时对位图进行平滑处理（这只适用于源对象是 BitmapData 对象的情况）。  
     * **注意：**drawWithQuality() 方法与 draw() 方法非常相似，但不使用 Stage.quality 属性确定矢量呈现的品质，您需要为 drawWithQuality() 方法指定 quality 参数  
     * 此方法与如何在创作工具界面中使用对象的标准矢量渲染器来绘制对像直接对应。  
     * 源显示对象不对此调用使用其任何已应用的转换。
     * 它会被视为存在于库或文件中，没有矩阵转换、没有颜色转换，也没有混合模式。
     * 要使用对象自己的 transform 属性来绘制显示对象（如影片剪辑），可以将其 transform 属性对象复制到使用 BitmapData 对象的 Bitmap 对象的 transform 属性。  
     * 如果 source 对象和其所有子对象（如果是 Sprite 或 MovieClip 对象）与调用方不来自同一个域，或者不在调用方可通过调用 Security.allowDomain() 方法访问的内容中，则调用 draw() 将引发 SecurityError 异常。
     * 此限制不适用于应用程序安全沙箱中的 AIR 内容。  
     * 对于使用所加载的位图图像作为 source 也有一些限制。
     * 如果所加载的图像来自与调用方相同的域，则调用 draw() 方法成功。
     * 此外，图像服务器上的跨域策略文件可以向调用 draw() 方法的 SWF 内容的域授予权限。
     * 在这种情况下，必须设置 LoaderContext 对象的 checkPolicyFile 属性，并在调用用于加载图像的 Loader 对象的 load() 方法时使用 LoaderContext 对象作为 context 参数。
     * 这些限制不适用于应用程序安全沙箱中的 AIR 内容。  
     * 在 Windows 中，draw() 方法无法在 Adobe AIR 的 HTMLLoader 对象中捕获嵌入 HTML 页的 SWF 内容。  
     * draw() 方法无法捕获 Adobe AIR 中的 PDF 内容。
     * 也无法捕获 Adobe AIR 中 wmode 属性设置为“window”的 HTML 中嵌入的 SWF 内容。
     * 
     * @param source 要绘制到 BitmapData 对象的显示对象或 BitmapData 对象。（DisplayObject 和 BitmapData 类实现 IBitmapDrawable 接口。）
     * @param matrix 一个 Matrix 对象，用于缩放、旋转位图或转换位图的坐标。如果不想将矩阵转换应用于图像，请将此参数设置为恒等矩阵（使用默认 new Matrix() 构造函数创建），或传递 null 值。
     * @param colorTransform 一个 ColorTransform 对象，用于调整位图的颜色值。如果没有提供任何对象，则不会转换位图图像的颜色。如果必须传递此参数但又不想转换图像，请将此参数设置为使用默认 new ColorTransform() 构造函数创建的 ColorTransform 对象。
     * @param blendMode 来自 BlendMode 类的一个字符串值，指定要应用于所生成位图的混合模式。
     * @param clipRect 一个 Rectangle 对象，定义要绘制的源对象的区域。 如果不提供此值，则不会进行剪裁，并且将绘制整个源对象。
     * @param smoothing 一个布尔值，用于确定因在 matrix 参数中指定缩放或旋转而对 BitmapData 对象进行缩放或旋转以后，是否对该对象进行平滑处理。smoothing 参数只有在 source 参数是 BitmapData 对象时才适用。在将 smoothing 设置为 false 的情况下，经过旋转或缩放的 BitmapData 图像可能会显得像素化或带有锯齿。
     */
    draw(
        source: BitmapData,
        matrix?: Matrix,
        colorTransform?: ColorTransform,
        blendMode?: BlendMode,
        clipRect?: Rectangle,
        smoothing = false,
    ) {
        this.drawWithQuality(source, matrix, colorTransform, blendMode, clipRect, smoothing);
    }

    /**
     * 使用 Flash 运行时矢量渲染器在位图图像上绘制 source 显示对象。
     * 可以指定 matrix、colorTransform、blendMode 和目标 clipRect 参数来控制呈现的执行方式。
     * 您可以根据需要指定是否应在缩放时对位图进行平滑处理（这只适用于源对象是 BitmapData 对象的情况）。  
     * **注意：**drawWithQuality() 方法与 draw() 方法非常相似，但不使用 Stage.quality 属性确定矢量呈现的品质，您需要为 drawWithQuality() 方法指定 quality 参数。  
     * 此方法与如何在创作工具界面中使用对象的标准矢量渲染器来绘制对像直接对应。  
     * 源显示对象不对此调用使用其任何已应用的转换。
     * 它会被视为存在于库或文件中，没有矩阵转换、没有颜色转换，也没有混合模式。
     * 要使用对象自己的 transform 属性来绘制显示对象（如影片剪辑），可以将其 transform 属性对象复制到使用 BitmapData 对象的 Bitmap 对象的 transform 属性。  
     * 如果源对象（如果是 Sprite 或 MovieClip 对象）和其所有子对象与调用方不来自同一个域，或者不在调用方可通过调用 Security.allowDomain() 方法访问的内容中，则调用 drawWithQuality() 将引发 SecurityError 异常。
     * 此限制不适用于应用程序安全沙箱中的 AIR 内容。  
     * 对于使用所加载的位图图像作为 source 也有一些限制。
     * 如果所加载的图像来自与调用方相同的域，则调用 drawWithQuality() 方法将成功。
     * 此外，图像服务器上的跨域策略文件可以向调用 drawWithQuality() 方法的 SWF 内容的域授予权限。
     * 在这种情况下，必须设置 LoaderContext 对象的 checkPolicyFile 属性，并在调用用于加载图像的 Loader 对象的 load() 方法时使用 LoaderContext 对象作为 context 参数。
     * 这些限制不适用于应用程序安全沙箱中的 AIR 内容。  
     * 在 Windows 中，drawWithQuality() 方法无法在 Adobe AIR 的 HTMLLoader 对象中捕获嵌入 HTML 页中的 SWF 内容。  
     * drawWithQuality() 方法无法捕获 Adobe AIR 中的 PDF 内容。  
     * 也无法捕获 Adobe AIR 中 wmode 属性设置为“window”的 HTML 中嵌入的 SWF 内容。
     * 
     * @param source 要绘制到 BitmapData 对象的显示对象或 BitmapData 对象。（DisplayObject 和 BitmapData 类实现 IBitmapDrawable 接口。）
     * @param matrix 一个 Matrix 对象，用于缩放、旋转位图或转换位图的坐标。如果不想将矩阵转换应用于图像，请将此参数设置为恒等矩阵（使用默认 new Matrix() 构造函数创建），或传递 null 值。
     * @param colorTransform 一个 ColorTransform 对象，用于调整位图的颜色值。如果没有提供任何对象，则不会转换位图图像的颜色。如果必须传递此参数但又不想转换图像，请将此参数设置为使用默认 new ColorTransform() 构造函数创建的 ColorTransform 对象。
     * @param blendMode 来自 BlendMode 类的一个字符串值，指定要应用于所生成位图的混合模式。
     * @param clipRect 一个 Rectangle 对象，定义要绘制的源对象的区域。 如果不提供此值，则不会进行剪裁，并且将绘制整个源对象。
     * @param smoothing 一个布尔值，用于确定因在 matrix 参数中指定缩放或旋转而对 BitmapData 对象进行缩放或旋转以后，是否对该对象进行平滑处理。smoothing 参数只有在 source 参数是 BitmapData 对象时才适用。在将 smoothing 设置为 false 的情况下，经过旋转或缩放的 BitmapData 图像可能会显得像素化或带有锯齿。
     * @param quality 任意一个 StageQuality 值。选择要在绘制矢量图形时使用的消除锯齿品质。
     */
    drawWithQuality(
        source: BitmapData,
        matrix?: Matrix,
        colorTransform?: ColorTransform,
        blendMode?: BlendMode,
        clipRect = new Rectangle(0, 0, source.width, source.height),
        smoothing = false,
        quality?: StageQuality,
    ) {
        this.lock();
        this.setPixels(clipRect, source.getPixels(clipRect));
        this.unlock();
    }

    /**
     * 使用选定的压缩程序算法压缩此 BitmapData 对象，并返回一个新 ByteArray 对象。
     * 或者，向指定 ByteArray 写入结果数据。
     * compressor 参数指定编码算法，可以是 PNGEncoderOptions、JPEGEncoderOptions 或 JPEGXREncoderOptions。
     * 
     * @param rect 要压缩的 BitmapData 对象的区域。
     * @param compressor 要使用的压缩程序类型。有效值为：PNGEncoderOptions、JPEGEncoderOptions 和 JPEGXREncoderOptions。
     * @param byteArray 保存编码图像的输出 ByteArray。
     * @deprecated 暂未实现
     */
    encode(rect: Rectangle, compressor: Object, byteArray?: number[]) { }

    /**
     * 使用指定的 ARGB 颜色填充一个矩形像素区域。
     * 
     * @param rect 要填充的矩形区域。
     * @param color 用于填充区域的 ARGB 颜色值。通常以十六进制格式指定 ARGB 颜色；例如，0xFF336699。
     */
    fillRect(rect: Rectangle, color: number) {
        this.lock();
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.setPixel32(x, y, this.transparent ? this.fillColor : (0xff000000 | this.fillColor));
            }
        }
        this.unlock();
    }

    /**
     * 对图像执行倾倒填充操作，从 (x, y) 坐标开始，填充一种特定的颜色。
     * floodFill() 方法类似于各种绘图程序中的“颜料桶”工具。
     * 该颜色是包含 Alpha 信息和颜色信息的 ARGB 颜色。
     * 
     * @param x 图像的 x 坐标。
     * @param y 图像的 y 坐标。
     * @param color 要用作填充色的 ARGB 颜色。
     * @deprecated 暂未实现
     */
    floodFill(x: number, y: number, color: number) { }

    /** @deprecated */
    fromImage(img: CanvasImageSource, dx = 0, dy = 0, opt_dw = 0, opt_dy = 0) { }

    /**
     * 已知 BitmapData 对象、源矩形和滤镜对象，确定 applyFilter() 方法调用所影响的目标矩形。  
     * 例如，模糊滤镜影响的区域通常比原始图像大。
     * 由一个默认 BlurFilter 实例过滤的 100 x 200 像素图像，其中 blurX = blurY = 4 将生成一个目标矩形 (-2,-2,104,204)。generateFilterRect() 方法使您可以提前了解到此目标矩形的大小，以便能够在执行滤镜操作之前相应地调整目标图像的大小。  
     * 有些滤镜会基于源图像大小裁剪其目标矩形。
     * 例如，一个内部 DropShadow 不会生成比其源图像大的结果。
     * 在此 API 中，BitmapData 对象用作源范围而不是源 rect 参数。
     * 
     * @param sourceRect 一个矩形，它定义要用作输入的源图像的区域。
     * @param filter 一个滤镜对象，用于计算目标矩形。
     */
    generateFilterRect(sourceRect: Rectangle, filter: BitmapFilter) {
        // if (filter instanceof ShaderFilter) {
        //     return this.rect.clone();
        // }
        return sourceRect.clone();
    }

    /**
     * 确定矩形区域是将位图图像中指定颜色的所有像素完全包括起来（如果将 findColor 参数设置为 true），还是将不包括指定颜色的所有像素完全包括起来（如果将 findColor 参数设置为 false）。  
     * 例如，如果有一个源图像并且想要确定包含非零 Alpha 通道的图像矩形，请传递 {mask: 0xFF000000, color: 0x00000000} 作为参数。
     * 如果 findColor 参数设置为 true，则会在整个图像中搜索其 (value & mask) == color 的像素范围（其中 value 是像素的颜色值）。
     * 如果 findColor 参数设置为 false，则在整个图像中搜索以下像素的范围，这些像素满足条件 (value & mask) != color（其中 value 是像素的颜色值）。
     * 要确定图像周围的空白区域，请传递 {mask: 0xFFFFFFFF, color: 0xFFFFFFFF} 以查找非空白像素的范围
     * 
     * @param mask 一个十六进制值，指定要考虑的 ARGB 颜色的位。通过使用 & (bitwise AND) 运算符，将颜色值与此十六进制值合并。
     * @param color 一个十六进制值，指定要匹配（如果 findColor 设置为 true）或不 匹配（如果 findColor 设置为 false）的 ARGB 颜色。
     * @param findColor 如果该值设置为 true，则返回图像中颜色值的范围。如果该值设置为 false，则返回图像中不存在此颜色的范围。
     * @deprecated 暂未实现
     */
    getColorBoundsRect(mask: number, color: number, findColor = true) { }

    /**
     * 返回一个整数，它表示 BitmapData 对象中在某个特定点 (x, y) 处的 RGB 像素值。
     * getPixel() 方法将返回一个未经过相乘的像素值。
     * 没有返回任何 Alpha 信息。  
     * BitmapData 对象中的所有像素都作为预乘颜色值进行存储。
     * 预乘图像像素具有已经与 Alpha 数据相乘的红色、绿色和蓝色通道值。
     * 例如，如果 Alpha 值为 0，则 RGB 通道的值也为 0，与它们未经过相乘的值无关。
     * 这种丢失数据的情况可能会在执行操作时导致一些问题。
     * 所有 BitmapData 方法都采用并返回未经过相乘的值。
     * 内部像素表示形式在其作为值返回之前从经过预乘的形式转换为未经过相乘的形式。
     * 在设置操作过程中，设置原始图像像素之前，像素值是经过预乘的。
     * 
     * @param x 像素的 x 位置。
     * @param y 像素的 y 位置。
     */
    getPixel(x: number, y: number) {
        return this.getPixel32(x, y) & 0x00ffffff;
    }

    /**
     * 返回一个 ARGB 颜色值，它包含 Alpha 通道数据和 RGB 数据。
     * 此方法与 getPixel() 方法类似，后者返回没有 Alpha 通道数据的 RGB 颜色。  
     * BitmapData 对象中的所有像素都作为预乘颜色值进行存储。
     * 预乘图像像素具有已经与 Alpha 数据相乘的红色、绿色和蓝色通道值。
     * 例如，如果 Alpha 值为 0，则 RGB 通道的值也为 0，与它们未经过相乘的值无关。
     * 这种丢失数据的情况可能会在执行操作时导致一些问题。
     * 所有 BitmapData 方法都采用并返回未经过相乘的值。
     * 内部像素表示形式在其作为值返回之前从经过预乘的形式转换为未经过相乘的形式。
     * 在设置操作过程中，设置原始图像像素之前，像素值是经过预乘的。
     * 
     * @param x 像素的 x 位置。
     * @param y 像素的 y 位置。
     */
    getPixel32(x: number, y: number) {
        try {
            return this.transparent ? this.byteArray[y * this.rect.width + x] :
                (this.byteArray[y * this.rect.width + x] & 0x00ffffff) + 0xff000000;
        } catch (e) {
            return this.fillColor;
        }
    }

    /**
     * 从像素数据的矩形区域生成一个字节数组。
     * 为每个像素将一个无符号整数（32 位未经相乘的像素值）写入字节数组。
     * 
     * @param rect 当前 BitmapData 对象中的一个矩形区域。
     * @deprecated TODO
     */
    getPixels(rect: Rectangle) {
        if (rect.width === 0 || rect.height === 0) {
            return new ByteArray();
        }
        const region = new ByteArray();
        for (let i = 0; i < rect.height; i++) {
            this.byteArray.slice((rect.y + i) * this.rect.width + rect.x,
                (rect.y + i) * this.rect.width + rect.x + rect.width).forEach(function (v) {
                    region.push(v)
                });
        }
        return region;
    }

    /**
     * 从像素数据的矩形区域生成一个矢量数组。
     * 为指定矩形返回一个无符号整数（32 位未经相乘的像素值）的 Vector 对象。
     * 
     * @param rect 当前 BitmapData 对象中的一个矩形区域。
     */
    getVector(rect: Rectangle) {
        if (this.rect.equals(rect)) {
            return this.byteArray;
        }
        const vector: number[] = [];
        for (let j = rect.y; j < rect.y + rect.height; j++) {
            for (let i = rect.x; i < rect.x + rect.width; i++) {
                vector.push((<any>rect)[j * this.rect.width + i]);
            }
        }
        return vector;
    }

    /**
     * 计算 BitmapData 对象的 256 值二进制数直方图。
     * 此方法返回包含四个矢量的 Vector 对象。
     * <Number> 个实例（四个包含数字对象的 Vector 对象）。
     * 这四个 Vector 实例依次表示红色、绿色、蓝色和 Alpha 成分。
     * 每个 Vector 实例包含从 0 到 255 这 256 个值，这些值表示各个成分值的填充计数。
     * 
     * @param hRect 要使用的 BitmapData 对象的区域。
     * @deprecated 暂未实现
     */
    histogram(hRect?: Rectangle) { }

    /**
     * 在一个位图图像与一个点、矩形或其他位图图像之间执行像素级的点击检测。
     * 根据定义，点击区域是指一个不透明像素或两个重叠的不透明像素上的点或矩形的重叠部分。
     * 在执行点击测试时，将不会考虑两个对象中任何一个对象的拉伸、旋转或其他变形。  
     * 如果某个图像是不透明图像，则此方法会将其视为完全不透明的矩形。
     * 两个图像必须是透明图像才能执行判断透明度的像素级点击测试。
     * 当您在测试两个透明图像时，Alpha 阈值参数将控制哪些 Alpha 通道值（从 0 到 255）将被视为是不透明的。
     * 
     * @param firstPoint 任意坐标空间中 BitmapData 图像的左上角的位置。在定义 secondBitmapPoint 参数时，使用了相同的坐标空间。
     * @param firstAlphaThreshold  最小的 Alpha 通道值，此点击测试将其视为不透明的。
     * @param secondObject 一个 Rectangle、Point、Bitmap 或 BitmapData 对象。
     * @param secondBitmapDataPoint 一个点，用于定义第二个 BitmapData 对象中的一个像素位置。仅当 secondObject 的值是 BitmapData 对象时使用此参数。
     * @param secondAlphaThreshold 最小的 Alpha 通道值，它在第二个 BitmapData 对象中被视为不透明的。仅当 secondObject 的值是 BitmapData 对象，并且这两个 BitmapData 对象都为透明时使用此参数。
     */
    hitTest(
        firstPoint: Point,
        firstAlphaThreshold: number,
        secondObject: Rectangle | Point | Bitmap | BitmapData,
        secondBitmapDataPoint?: Point,
        secondAlphaThreshold = 1,
    ) {
        return false;
    }

    /** 
     * 锁定图像，以使引用 BitmapData 对象的任何对象（如 Bitmap 对象）在此 BitmapData 对象更改时不会更新。
     * 要提高性能，请在对 setPixel() 或 setPixel32() 方法进行多次调用之前和之后使用此方法及 unlock() 方法。
     */
    lock() {
        this.locked = true;
    }

    /**
     * 对每个通道执行从源图像向目标图像的混合。
     * 对于每个通道和每个像素，将基于源和目标像素的通道值来计算新值。
     * 例如，在红色通道中，新值是按如下方式计算的（其中 redSrc 是源图像中像素的红色通道值，而 redDest 是目标图像中对应像素的红色通道值）：
     * ```
     * new redDest = [(redSrc * redMultiplier) + (redDest * (256 - redMultiplier))] / 256;
     * ```
     * redMultiplier、greenMultiplier、blueMultiplier 和 alphaMultiplier 值是用于每个颜色通道的乘数。
     * 应使用从 0 到 0x100 (256) 的十六进制值范围，其中 0 指定在结果中使用来自目标的完整值，0x100 指定使用来自源的完整值，介于两者之间的数字指定使用混合值 （如 0x80 表示 50%）。
     * 
     * @param sourceBitmapData 要使用的输入位图图像。源图像可以是另一个 BitmapData 对象，也可以引用当前 BitmapData 对象。
     * @param sourceRect 定义要用作输入的源图像区域的矩形。
     * @param destPoint 目标图像（当前 BitmapData 实例）中与源矩形的左上角对应的点。
     * @param redMultiplier 一个要与红色通道值相乘的十六进制 uint 值。
     * @param greenMultiplier 一个要与绿色通道值相乘的十六进制 uint 值。
     * @param blueMultiplier 一个要与蓝色通道值相乘的十六进制 uint 值。
     * @param alphaMultiplier 一个要与 Alpha 透明度值相乘的十六进制 uint 值。
     * @deprecated 暂未实现
     */
    merge(
        sourceBitmapData: BitmapData,
        sourceRect: Rectangle,
        destPoint: Point,
        redMultiplier: number,
        greenMultiplier: number,
        blueMultiplier: number,
        alphaMultiplier: number,
    ) { }

    /**
     * 使用表示随机杂点的像素填充图像。
     * 
     * @param randomSeed 要使用的随机种子数。如果您保持使所有其他参数不变，可以通过改变随机种子值来生成不同的伪随机结果。杂点函数是一个映射函数，不是真正的随机数生成函数，所以它每次都会根据相同的随机种子创建相同的结果。
     * @param low 要为每个通道生成的最低值（0 到 255）。
     * @param high 要为每个通道生成的最高值（0 到 255）。
     * @param channelOptions 一个数字，可以是四个颜色通道值（BitmapDataChannel.RED、BitmapDataChannel.BLUE、BitmapDataChannel.GREEN 和 BitmapDataChannel.ALPHA）的任意组合。您可以使用 logical OR (|) 运算符来组合通道值。
     * @param grayScale 一个布尔值。如果该值为 true，则会通过将所有颜色通道设置为相同的值来创建一个灰度图像。将此参数设置为 true 不会影响 Alpha 通道的选择。
     */
    noise(
        randomSeed: number,
        low = 0,
        high = 255,
        channelOptions = 7,
        grayScale = false,
    ) {
        this.lock();
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.setPixel32(x, y, 0xff000000 | 0xffffff * Math.random());
            }
        }
        this.unlock();
    }

    /**
     * 重新映射一个具有最多四组调色板数据（每个通道一组）的图像中的颜色通道值。  
     * Flash 运行时通过下列步骤生成结果图像：
     *    1. 计算了红色、绿色、蓝色和 Alpha 值后，将使用标准 32 位整数算法将它们相加在一起。
     *    2. 每个像素的红色、绿色、蓝色和 Alpha 通道值被分别提取为一个 0 到 255 的值。使用这些值在相应的数组中查找新的颜色值：redArray、greenArray、blueArray 和 alphaArray。这四个数组中的每一个都应包含 256 个值。
     *    3. 在检索了所有四个新通道值之后，它们会被组合成一个应用于像素的标准 ARGB 值。
     * 
     * 此方法可以支持跨通道效果。
     * 每个输入数组可以包含完整的 32 位值，并且在将这些值相加到一起时不会发生任何移位。
     * 此例程不支持按通道锁定。  
     * 如果没有为通道指定数组，则颜色通道会从源图像复制到目标图像。  
     * 您可以为多种效果（例如，常规调色板映射）使用此方法（采用一个通道并将其转换为假颜色图像）。
     * 您也可以为各种高级颜色操作算法（例如，灰度系数、曲线、级别和量化）使用此方法。
     * 
     * @param sourceBitmapData 要使用的输入位图图像。源图像可以是另一个 BitmapData 对象，也可以引用当前 BitmapData 实例。
     * @param sourceRect 定义要用作输入的源图像区域的矩形。
     * @param destPoint 目标图像（当前 BitmapData 对象）中与源矩形的左上角对应的点。
     * @param redArray 如果 redArray 不为 null，则 red = redArray[source red value] else red = source rect value。
     * @param greenArray 如果 greenArray 不为 null，则 green = greenArray[source green value] else green = source green value.
     * @param blueArray 如果 blueArray 不为 null，则 blue = blueArray[source blue value] else blue = source blue value。
     * @param alphaArray 如果 alphaArray 不为 null，则 alpha = alphaArray[source alpha value] else alpha = source alpha value。
     * @deprecated 暂未实现
     */
    paletteMap(
        sourceBitmapData: BitmapData,
        sourceRect: Rectangle,
        destPoint: Point,
        redArray?: number[],
        greenArray?: number[],
        blueArray?: number[],
        alphaArray?: number[],
    ) { }

    /**
     * 生成 Perlin 杂点图像。  
     * Perlin 杂点生成算法会内插单个随机杂点函数名为 octave 并将它们组合成一个函数，该函数生成多个看起来很自然的随机杂点。
     * 就像音乐上的八音度，每个 octave 函数的频率都是其前面一个 octave 函数频率的两倍。
     * Perlin 杂点被描述为“杂点的碎片总和”，因为它将多组杂点数据与不同级别的细节组合在一起。  
     * 您可以使用 Perlin 杂点函数来模拟自然现象和风景，例如，木材纹理、云彩或山脉。
     * 在大多数情况下，Perlin 杂点函数的输出不会直接显示出来，而是用于增强其他图像并为其他图像提供伪随机变化。  
     * 简单的数字随机杂点函数通常生成具有粗糙的对比度点的图像。
     * 这种粗糙的对比度在自然界中通常是找不到的。
     * Perlin 杂点算法混合了在不同的详细级别上进行操作的多个杂点函数。
     * 此算法在相邻的像素值间产生较小的变化。
     * 
     * @param baseX 要在 x 方向上使用的频率。例如，要生成大小适合 64 x 128 图像的杂点，请为 baseX 值传递 64。
     * @param baseY 要在 y 方向上使用的频率。例如，要生成大小适合 64 x 128 图像的杂点，请为 baseY 值传递 128。
     * @param numOctaves 要组合以创建此杂点的 octave 函数或各个杂点函数的数目。octave 的数目越多，创建的图像越细腻。octave 的数目越多，需要的处理时间也会越长。
     * @param randomSeed 要使用的随机种子数。如果您保持使所有其他参数不变，可以通过改变随机种子值来生成不同的伪随机结果。Perlin 杂点函数是一个映射函数，不是真正的随机数生成函数，所以它会每次根据相同的随机种子创建相同的结果。
     * @param stitch 一个布尔值。如果该值为 true，则该方法将尝试平滑图像的转变边缘以创建无缝的纹理，用于作为位图填充进行平铺。
     * @param fractalNoise 一个布尔值。如果该值为 true，则该方法将生成碎片杂点；否则，它将生成湍流。带有湍流的图像具有可见的不连续性渐变，可以使其具有更接近锐化的视觉效果，例如火焰或海浪。
     * @param channelOptions 一个数字，可以是四个颜色通道值（BitmapDataChannel.RED、BitmapDataChannel.BLUE、BitmapDataChannel.GREEN 和 BitmapDataChannel.ALPHA）的任意组合。您可以使用 logical OR (|) 运算符来组合通道值。
     * @param grayScale 一个布尔值。如果该值为 true，则通过将红色、绿色和蓝色通道的每一个值都设置为相同的值来创建一个灰度图像。如果此值设置为 true，则 Alpha 通道值将不会受到影响。
     * @param offsets 与每个 octave 的 x 和 y 偏移量相对应的点数组。通过操作这些偏移量值，您可以平滑滚动 perlinNoise 图像的图层。偏移数组中的每个点将影响一个特定的 octave 杂点函数。
     * @deprecated 暂未实现
     */
    perlinNoise(
        baseX: number,
        baseY: number,
        numOctaves: number,
        randomSeed: number,
        stitch: boolean,
        fractalNoise: boolean,
        channelOptions = 7,
        grayScale = false,
        offsets?: Point[],
    ) { }

    /**
     * 执行源图像到目标图像的像素溶解，或使用同一图像执行像素溶解。
     * Flash 运行时使用 randomSeed 值生成随机像素溶解。函数的返回值必须在后续调用中传入才能继续进行像素溶解，直至完成。  
     * 如果源图像不等于目标图像，则会使用所有的属性将像素从源复制到目标。
     * 此过程允许从空白图像溶解到完全填充的图像。  
     * 如果源图像和目标图像相等，则使用 color 参数填充像素。
     * 此过程允许从完全填充的图像溶解掉。
     * 在此模式中，将会忽略目标 point 参数。
     * 
     * @param sourceBitmapData 要使用的输入位图图像。源图像可以是另一个 BitmapData 对象，也可以引用当前 BitmapData 实例。
     * @param sourceRect 定义要用作输入的源图像区域的矩形。
     * @param destPoint 目标图像（当前 BitmapData 实例）中与源矩形的左上角对应的点。
     * @param randomSeed 用于开始像素溶解的随机种子。
     * @param numPixels 默认值是源区域（宽度 x 高度）的 1/30。
     * @param fillColor 一个 ARGB 颜色值，用于填充其源值等于目标值的像素。
     */
    pixelDissolve(
        sourceBitmapData: BitmapData,
        sourceRect: Rectangle,
        destPoint: Point,
        randomSeed = 0,
        numPixels = 0,
        fillColor = 0,
    ) {
        return 0;
    }

    /**
     * 将图像按一定量的 (x, y) 像素进行滚动。
     * 滚动区域之外的边缘区域保持不变。
     * 
     * @param x 水平滚动量。
     * @param y 垂直滚动量。
     * @deprecated 暂未实现
     */
    scroll(x: number, y: number) { }

    /**
     * 设置 BitmapData 对象的单个像素。
     * 在此操作过程中将会保留图像像素的当前 Alpha 通道值。
     * RGB 颜色参数的值被视为一个未经过相乘的颜色值。  
     * **注意：**要提高性能，请在重复使用 setPixel() 或 setPixel32() 方法时，在调用 setPixel() 或 setPixel32() 方法之前先调用 lock() 方法，然后在做出所有像素更改后调用 unlock() 方法。
     * 此过程可防止引用此 BitmapData 实例的对象在您完成像素更改之前进行更新。
     * 
     * @param x 像素值会更改的像素的 x 位置。
     * @param y 像素值会更改的像素的 y 位置。
     * @param color 生成的像素 RGB 颜色。
     */
    setPixel(x: number, y: number, color: number) {
        this.setPixel32(x, y, (color & 0x00ffffff) + 0xff000000);
    }

    /**
     * 设置 BitmapData 对象单个像素的颜色和 Alpha 透明度值。
     * 此方法与 setPixel() 方法类似；主要差别在于 setPixel32() 方法采用包含 Alpha 通道信息的 ARGB 颜色值。  
     * BitmapData 对象中的所有像素都作为预乘颜色值进行存储。
     * 预乘图像像素具有已经与 Alpha 数据相乘的红色、绿色和蓝色通道值。
     * 例如，如果 Alpha 值为 0，则 RGB 通道的值也为 0，与它们未经过相乘的值无关。
     * 这种丢失数据的情况可能会在执行操作时导致一些问题。
     * 所有 BitmapData 方法都采用并返回未经过相乘的值。
     * 内部像素表示形式在其作为值返回之前从经过预乘的形式转换为未经过相乘的形式。
     * 在设置操作过程中，设置原始图像像素之前，像素值是经过预乘的。  
     * **注意：**要提高性能，请在重复使用 setPixel() 或 setPixel32() 方法时，在调用 setPixel() 或 setPixel32() 方法之前先调用 lock() 方法，然后在做出所有像素更改后调用 unlock() 方法。
     * 此过程可防止引用此 BitmapData 实例的对象在您完成像素更改之前进行更新。
     * 
     * @param x 像素值会更改的像素的 x 位置。
     * @param y 像素值会更改的像素的 y 位置。
     * @param color 生成的像素 ARGB 颜色。如果位图是不透明的（非透明）位图，则会忽略此颜色值的 Alpha 透明度部分。
     */
    setPixel32(x: number, y: number, color: number) {
        if (!this.transparent) {
            // Force alpha channel
            color = (color & 0x00ffffff) + 0xff000000;
        }
        this.byteArray[y * this.rect.width + x] = color;
        this.dirtyArea.expand(x, y);
        this._updateBox();
    }

    /**
     * 将字节数组转换为像素数据的矩形区域。
     * 对于每个像素，将调用 ByteArray.readUnsignedInt() 方法并将返回值写入像素。
     * 如果字节数组在写入整个矩形之前结束，将返回函数。
     * 字节数组中的数据应该是 32 位 ARGB 像素值。
     * 在读取像素之前或之后，不会对字节数组执行搜索。
     * 
     * @param rect 指定 BitmapData 对象的矩形区域。
     * @param inputByteArray 一个 ByteArray 对象，由要在矩形区域中使用的 32 位未经过相乘的像素值组成。
     * @deprecated TODO
     */
    setPixels(rect: Rectangle, inputByteArray: number[]) {
        if (!this.transparent) {
            inputByteArray = inputByteArray.map(color => (color & 0x00ffffff) + 0xff000000);
        }
        for (let i = 0; i < rect.width; i++) {
            for (let j = 0; j < rect.height; j++) {
                this.byteArray[(rect.y + j) * this.width + (rect.x + i)] =
                    inputByteArray[j * rect.width + i];
                this.dirtyArea.expand(i, j);
            }
        }
        this._updateBox();
    }

    protected _updateBox(changeRect?: Rectangle) {
        if (this.dirtyArea.isEmpty() || this.locked) {
            return;
        }

        const change = changeRect ?? this.dirtyArea.asRect();
        const region: number[] = [];
        for (let i = 0; i < change.height; i++) {
            for (let j = 0; j < change.width; j++) {
                region.push(this.byteArray[(change.y + i) * this.rect.width +
                    change.x + j]);
            }
        }
        for (let y = change.y; y < change.y + change.height; y++) {
            for (let x = change.x; x < change.x + change.width; x++) {
                // Unpack ARGB
                const color = region[y * change.width + x];
                const r = (color >> 16) & 0xff,
                    g = (color >> 8) & 0xff,
                    b = color & 0xff,
                    a = (color >> 24) & 0xff;
                const i = 4 * (y * this._data.width + x);
                this._data.data[i] = r;
                this._data.data[i + 1] = g;
                this._data.data[i + 2] = b;
                this._data.data[i + 3] = a;
            }
        }
        this._notifyList.forEach((image) => {
            image._draw(this._data);
        });
        this.dirtyArea.reset();
    }

    _registerNotify(bitmap: Bitmap) {
        if (this._notifyList.indexOf(bitmap) < 0) {
            this._notifyList.push(bitmap);
            // Also notify immediately
            bitmap._draw(this._data);
        }
    };

    _deregisterNotify(bitmap: Bitmap) {
        const index = this._notifyList.indexOf(bitmap);
        if (index >= 0) {
            this._notifyList.splice(index, 1);
        }
    };

    _fill(color: number) {
        const r = (color >> 16) & 0xff,
            g = (color >> 8) & 0xff,
            b = color & 0xff,
            a = (color >> 24) & 0xff;
        for (let y = 0; y < this._data.height; y++) {
            for (let x = 0; x < this._data.width; x++) {
                const i = 4 * (y * this._data.width + x);
                this._data.data[i] = r;
                this._data.data[i + 1] = g;
                this._data.data[i + 2] = b;
                this._data.data[i + 3] = a;
            }
        }
    }

    /**
     * 将 Vector 转换为像素数据的矩形区域。
     * 对于每个像素，将会读取 Vector 元素并将其写入到 BitmapData 像素中。
     * Vector 中的数据应该是 32 位 ARGB 像素值。
     * 
     * @param rect 指定 BitmapData 对象的矩形区域。
     * @param inputVector 一个 Vector 对象，由将在矩形区域中使用的 32 位未经过相乘的像素值组成。
     */
    setVector(rect: Rectangle, inputVector: number[]) {
        this.lock();
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.setPixel(x, y, inputVector[x + y * this.width]);
            }
        }
        this.unlock();
    }

    /**
     * 根据指定的阈值测试图像中的像素值，并将通过测试的像素设置为新的颜色值。
     * 通过使用 threshold() 方法，您可以隔离和替换图像中的颜色范围，并对图像像素执行其他逻辑操作。  
     * threshold() 方法的测试逻辑如下所示：
     *    1. 如果 ((pixelValue & mask) operation (threshold & mask))，则将像素设置为 color；
     *    2. 否则，如果 copySource == true，则将像素设置为 sourceBitmap 中的对应像素值。
     * 
     * operation 参数指定要用于阈值测试的比较运算符。
     * 例如，通过使用“==”作为 operation 参数，您可以隔离图像中的特定颜色值。
     * 或者通过使用 {operation: "<", mask: 0xFF000000, threshold: 0x7F000000, color: 0x00000000}，您可以将所有目标像素设置为在源图像像素的 Alpha 小于 0x7F 时是完全透明的。
     * 您可以将此技巧用于动画过渡和其他效果。
     * 
     * @param sourceBitmapData 要使用的输入位图图像。源图像可以是另一个 BitmapData 对象，也可以引用当前 BitmapData 实例。
     * @param sourceRect 定义要用作输入的源图像区域的矩形。
     * @param destPoint 目标图像（当前 BitmapData 实例）中与源矩形的左上角对应的点。
     * @param operation 下列比较运算符之一（作为字符串传递）:“<”、“<=”、“>”、“>=”、“==”“!=”
     * @param threshold 测试每个像素时要比较的值，以查看该值是达到还是超过阈值。
     * @param color 阈值测试成功时对像素设置的颜色值。默认值为 0x00000000。
     * @param mask 用于隔离颜色成分的遮罩。
     * @param copySource 如果该值为 true，则源图像中的像素值将在阈值测试失败时复制到目标图像。如果为 false，则在阈值测试失败时不会复制源图像。
     */
    threshold(
        sourceBitmapData: BitmapData,
        sourceRect: Rectangle,
        destPoint: Point,
        operation: String,
        threshold: number,
        color = 0,
        mask = 0xFFFFFFFF,
        copySource = false,
    ) {
        return 0;
    }

    /**
     * 解除锁定图像，以使引用 BitmapData 对象的任何对象（如 Bitmap 对象）在此 BitmapData 对象更改时更新。
     * 要提高性能，请在对 setPixel() 或 setPixel32() 方法进行多次调用之前和之后使用此方法及 lock() 方法。
     * 
     * @param changeRect 已更改的 BitmapData 对象的区域。如果没有为此参数指定值，则会认为 BitmapData 对象的整个区域已更改。此参数需要 Flash Player 9.0.115.0 版或更高版本。
     */
    unlock(changeRect?: Rectangle) {
        this.locked = false;
        if (!changeRect) {
            this._updateBox();
        } else {
            this._updateBox(changeRect);
        }
    }
}

export class Bitmap extends DisplayObject<HTMLCanvasElement> {

    /**
     * 创建一个具有指定的宽度和高度的 BitmapData 对象。
     * 如果为 fillColor 参数指定一个值，则位图中的每个像素都将设置为该颜色。  
     * 默认情况下，将位图创建为透明位图，除非您为 transparent 参数传递值 false。
     * 创建了不透明位图后，将无法将其更改为透明位图。
     * 不透明位图中的每个像素仅使用 24 位的颜色通道信息。
     * 如果将位图定义为透明，则每个像素将使用 32 位的颜色通道信息，其中包括 Alpha 透明度通道。  
     * BitmapData 对象的最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。
     * （因此，如果 BitmapData 对象的宽度为 8,191 像素，则其高度只能为 2,048 像素。）
     * 
     * @param width 位图图像的宽度，以像素为单位。
     * @param height 位图图像的高度，以像素为单位。
     * @param transparent 指定位图图像是否支持每个像素具有不同的透明度。默认值为 true（透明）。要创建完全透明的位图，请将 transparent 参数的值设置为 true，将 fillColor 参数的值设置为 0x00000000（或设置为 0）。将 transparent 属性设置为 false 可以略微提升呈现性能。
     * @param fillColor 用于填充位图图像区域的 32 位 ARGB 颜色值。默认值为 0xFFFFFFFF（纯白色）。
     */
    static createBitmapData(width: number, height: number, transparent = true, fillColor = 0xFFFFFFFF) {
        return new BitmapData(width, height, transparent, fillColor);
    }

    static createParticle({ obj, radius = 200 }: any) {
        const pic = obj;
        const Arr_tp: Simple2D[] = [];
        let Out = 0;
        const bm = new BitmapData(pic.width, pic.height);
        bm.draw(pic);
        const bm1 = new BitmapData(pic.width + radius * 2, pic.height + radius * 2, true, 0);
        const bms = new CommentBitmap(<any>{ bitmapData: bm1 });
        rootSprite.addChild(bms);
        bms.x = 0;
        bms.y = 0;
        let i = 0;
        while (i < pic.width) {
            let j = 0;
            while (j < pic.height) {
                if (bm.getPixel32(i, j) != 0) {
                    bm1.setPixel32(i + radius, j + radius, bm.getPixel32(i, j));
                    const tp = new Simple2D(i + radius, j + radius, (Math.random() - Math.random()) * 5, (Math.random() - Math.random()) * 5, 0.5 + Math.random() * 5, bm.getPixel32(i, j));
                    Arr_tp.push(tp);
                }
                j++;
            }
            i++;
        }
        const rect = new Rectangle(0, 0, bms.width, bms.height);
        const loop = () => {
            bm1.lock();
            bm1.fillRect(rect, 0);
            let i = 0;
            while (i < Arr_tp.length) {
                const d = Arr_tp[i];
                if (!d.isOut) {
                    d.update();
                    if (d.valid(bm1)) {
                        Out++;
                    }
                    bm1.setPixel32(d.x, d.y, d.Allcolor);
                }
                i++;
            }
            bm1.unlock();
            if (Out / Arr_tp.length > 0.8) {
                bms.removeEventListener(Event.ENTER_FRAME, loop);
                bms.remove();
                bm1.dispose();
            }
        }
        bms.addEventListener(Event.ENTER_FRAME, loop);
        return bms;
    }

    /**
     * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
     * 如果调用此函数时不使用任何参数，将创建一个 x、y、width 和 height 属性均设置为 0 的矩形。
     * 
     * @param x 矩形左上角的 x 坐标。
     * @param y 矩形左上角的 y 坐标。
     * @param width 矩形的宽度（以像素为单位）。
     * @param height 矩形的高度（以像素为单位）。
     */
    static createRectangle(x: number, y: number, width: number, height: number) {
        return new Rectangle(x, y, width, height);
    }

    /** 初始化 Bitmap 对象以引用指定的 BitmapData 对象。 */
    static createBitmap(param: IBitmap) {
        return new CommentBitmap(param);
    }

    protected $bitmapData?: BitmapData;

    get bitmapData() {
        return this.$bitmapData;
    }

    set bitmapData(value) {
        this.$bitmapData = value;
        this.$bitmapData?._registerNotify(this);
    }

    get width() {
        return this.bitmapData ? this.bitmapData.width * this.scaleX : 0;
    }

    set width(w) {
        if (this.bitmapData && this.bitmapData.width > 0) {
            this.scaleX = w / this.bitmapData.width;
        }
    }

    get height() {
        return this.bitmapData ? this.bitmapData.height * this.scaleY : 0;
    }

    set height(h: number) {
        if (this.bitmapData && this.bitmapData.height > 0) {
            this.scaleY = h / this.bitmapData.height;
        }
    }

    constructor(param: IBitmap) {
        super(param, true, Element.add('canvas', { class: 'as3-danmaku-item' }));
        this.$host.style.cssText = `position: absolute; inset-block-start: 0; inset-inline-start: 0; transform-origin: 0 0 0;`;
        param.bitmapData && (this.bitmapData = param.bitmapData);
        this.init();
    }

    _draw(imageData: ImageData) {
        this.$host.setAttribute('width', <any>imageData.width);
        this.$host.setAttribute('height', <any>imageData.height);
        const ctx = this.$host.getContext('2d')!;
        ctx.putImageData(imageData, 0, 0);
    }
}

export class CommentBitmap extends Bitmap {

    constructor(param: IBitmap) {
        super(param);
    }
}

export interface IBitmap extends IDisplay {
    /** 被引用的 BitmapData 对象。 */
    bitmapData?: BitmapData;
    /** Bitmap 对象是否贴紧至最近的像素。 */
    pixelSnapping?: string;
    /** 在缩放时是否对位图进行平滑处理。 */
    smoothing: boolean;
    /** 创建的 Bitmap 对象的缩放比例 */
    scale: number;
}