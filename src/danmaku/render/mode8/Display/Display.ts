import { Danmaku } from "../../..";
import { BevelFilter } from "../filters/BevelFilter";
import { BitmapFilterType } from "../filters/BitmapFilterType";
import { BlurFilter } from "../filters/BlurFilter";
import { ColorMatrixFilter } from "../filters/ColorMatrixFilter";
import { ConvolutionFilter } from "../filters/ConvolutionFilter";
import { DisplacementMapFilter } from "../filters/DisplacementMapFilter";
import { DisplacementMapFilterMode } from "../filters/DisplacementMapFilterMode";
import { DropShadowFilter } from "../filters/DropShadowFilter";
import { GlowFilter } from "../filters/GlowFilter";
import { GradientBevelFilter } from "../filters/GradientBevelFilter";
import { GradientGlowFilter } from "../filters/GradientGlowFilter";
import { ColorTransform } from "../geom/ColorTransform";
import { Matrix } from "../geom/Matrix";
import { Matrix3D } from "../geom/Matrix3D";
import { Point } from "../geom/Point";
import { Vector3D } from "../geom/Vector3D";
import { BitmapData } from "./Bitmap";
import { ICommentButton, CommentButton } from "./CommentButton";
import { CommentCanvas } from "./CommentCanvas";
import { CommentField } from "./CommentField";
import { DisplayObject, rootSprite } from "./DisplayObject";
import { Shape } from "./Shape";
import { TextFormat } from "./TextFormat";

export class Display {

    constructor(private danmaku: Danmaku) { }

    /**
     * 返回变为全屏大小时使用的显示器宽度（如果立即进入该状态）。
     * 如果用户有多台显示器，则使用的显示器是此时显示大部分舞台的显示器。  
     * **注意：**在检索值和变为全屏大小之间，如果用户有机会将浏览器从一台显示器移到另一台显示器，则该值可能不正确。
     */
    readonly fullScreenWidth = screen.width;

    /**
     * 返回变为全屏大小时使用的显示器高度（如果立即进入该状态）。
     * 如果用户有多台显示器，则使用的显示器是此时显示大部分舞台的显示器。  
     * **注意：**在检索值和变为全屏大小之间，如果用户有机会将浏览器从一台显示器移到另一台显示器，则该值可能不正确。
     */
    readonly fullScreenHeight = screen.height;

    frameRate = 24;

    /** 指示显示对象的宽度，以像素为单位。 */
    get width() {
        return this.danmaku.$width;
    }

    /** 指示显示对象的高度，以像素为单位。 */
    get height() {
        return this.danmaku.$height;
    }

    get root() {
        return <DisplayObject<HTMLElement>>rootSprite;
    }

    get stage() {
        return this.root;
    }

    /** 使用指定参数创建新的{@link Matrix}对象。 */
    createMatrix(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number) {
        return new Matrix(a, b, c, d, tx, ty);
    }

    createGradientBox(width: number, height: number, rotation: number, tX: number, tY: number) {
        return new Matrix().createGradientBox(width, height, rotation, tX, tY);
    }

    /** 创建的{@link Point}对象。 */
    createPoint(x = 0, y = 0) {
        return new Point(x, y);
    }

    /**
     * 使用指定参数创建新的弹幕对象。
     * 
     * @param text 弹幕对象中的文字信息。
     * @param param 创建参数
     */
    createComment(text: string, param: IDisplay) {
        return new CommentField(text, param);
    }

    /**
     * 使用指定参数创建新的图型对象。
     * 
     * @param param 创建参数
     */
    createShape(param: IDisplay) {
        return new Shape(param);
    }

    /**
     * 使用指定参数创建新的容器。
     * 
     * @param param 创建参数
     */
    createCanvas(param: IDisplay) {
        return new CommentCanvas(param);
    }

    /**
     * 使用指定参数创建新的按钮。
     * 
     * @param param 创建参数
     */
    createButton(param: ICommentButton) {
        return new CommentButton(param);
    }

    /**
     * 用指定参数初始化新的 GlowFilter 实例。
     * 
     * @param color 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000
     * @param alpha 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
     * @param blurX 水平模糊量。有效值为 0 到 255（浮点）。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其他值更快。
     * @param blurY 垂直模糊量。有效值为 0 到 255（浮点）。2 的乘方值（如 2、4、8、16 和 32）经过优化，呈示速度比其他值更快。
     * @param strength 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。
     * @param quality 应用滤镜的次数。使用 BitmapFilterQuality 常量：low、middle、high
     * @param inner 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。
     * @param knockout 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。
     */
    createGlowFilter(
        color = 0,
        alpha = 1,
        blurX = 6,
        blurY = 6,
        strength = 2,
        quality = 1,
        inner = false,
        knockout = false,
    ) {
        return new GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
    }

    /**
     * 用指定参数初始化滤镜。默认值会创建一个柔化的、未聚焦的图像。
     * 
     * @param blurX 水平模糊量。有效值为 0 到 255.0（浮点值）。
     * @param blurY 垂直模糊量。有效值为 0 到 255.0（浮点值）。
     * @param quality 应用滤镜的次数。使用 BitmapFilterQuality 常量：low、middle、high
     */
    createBlurFilter(
        blurX = 4,
        blurY = 4,
        quality = 1,
    ) {
        return new BlurFilter(blurX, blurY, quality);
    }

    /**
     * 用指定参数初始化滤镜。默认值会创建一个柔化的、未聚焦的图像。
     * @link [[高级弹幕]Rolling Girl](https://www.bilibili.com/video/av379138)
     */
    createBlurFilters(
        blurX = 4,
        blurY = 4,
        quality = 1,
    ) {
        return this.createBlurFilter(blurX, blurY, quality);
    }

    /** 转换为vector.<int> */
    toIntVector(a: number[]) {
        Object.defineProperty(a, 'as3Type', { value: 'Vector<int>' });
        return a;
    }

    /** 转换为vector.<UInt> */
    toUIntVector(a: number[]) {
        Object.defineProperty(a, 'as3Type', { value: 'Vector<UInt>' });
        return a;
    }

    /** 转换为vector.<Number> */
    toNumberVector(a: number[]) {
        Object.defineProperty(a, 'as3Type', { value: 'Vector<Number>' });
        return a;
    }

    /**
     * 创建 Vector3D 对象的实例。如果未指定构造函数的参数，则将使用元素 (0,0,0,0) 创建 Vector3D 对象。
     * 
     * @param x 第一个元素，例如 x 坐标。
     * @param y 第二个元素，例如 y 坐标。
     * @param z 第三个元素，例如 z 坐标。
     * @param w 表示额外数据的可选元素，例如旋转角度。
     */
    createVector3D(
        x = 0,
        y = 0,
        z = 0,
        w = 0,
    ) {
        return new Vector3D(x, y, z, w);
    }

    createTextField() {
        return new CommentField("", <any>undefined);
    }

    createBevelFilter(
        distance?: number,
        angle?: number,
        highlightColor?: number,
        highlightAlpha?: number,
        shadowColor?: number,
        shadowAlpha?: number,
        blurX?: number,
        blurY?: number,
        strength?: number,
        quality?: number,
        type?: BitmapFilterType,
        knockout?: boolean,
    ) {
        return new BevelFilter(distance, angle, highlightColor, highlightAlpha, shadowColor, shadowAlpha, blurX, blurY, strength, quality, type, knockout);
    }

    createColorMatrixFilter(matrix?: number[]) {
        return new ColorMatrixFilter(matrix);
    }

    createConvolutionFilter(
        matrixX?: number,
        matrixY?: number,
        _matrix?: number[],
        divisor?: number,
        bias?: number,
        preserveAlpha?: boolean,
        clamp?: boolean,
        color?: number,
        alpha?: number,
    ) {
        return new ConvolutionFilter(matrixX, matrixY, _matrix, divisor, bias, preserveAlpha, clamp, color, alpha);
    }

    createDisplacementMapFilter(
        mapBitmap?: BitmapData,
        mapPoint?: Point,
        componentX?: number,
        componentY?: number,
        scaleX?: number,
        scaleY?: number,
        mode?: DisplacementMapFilterMode,
        color?: number,
        alpha?: number,
    ) {
        return new DisplacementMapFilter(mapBitmap, mapPoint, componentX, componentY, scaleX, scaleY, mode, color, alpha);
    }

    createDropShadowFilter(
        distance = 4,
        angle = 45,
        color = 0,
        alpha = 1,
        blurX = 4,
        blurY = 4,
        strength = 1,
        quality = 1,
        inner = false,
        knockout = false,
        hideObject = false
    ) {
        return new DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality, inner, knockout, hideObject);
    }

    createGradientBevelFilter(
        distance = 4,
        angle = 45,
        colors: number[] = [],
        alphas: number[] = [],
        ratios: number[] = [],
        blurX = 4.0,
        blurY = 4.0,
        strength = 1,
        quality = 1,
        type = BitmapFilterType.INNER,
        knockout = false,
    ) {
        return new GradientBevelFilter(distance, angle, colors, alphas, ratios, blurX, blurY, strength, quality, type, knockout);
    }

    createGradientGlowFilter(
        distance = 4.0,
        angle = 45,
        colors: number[] = [],
        alphas: number[] = [],
        ratios: number[] = [],
        blurX = 4.0,
        blurY = 4.0,
        strength = 1,
        quality = 1,
        type = BitmapFilterType.INNER,
        knockout = false
    ) {
        return new GradientGlowFilter(distance, angle, colors, alphas, ratios, blurX, blurY, strength, quality, type, knockout);
    }

    /** @deprecated */
    pointTowards(
        percent: Number,
        mat: Matrix3D,
        pos: Vector3D,
        at?: Vector3D,
        up?: Vector3D
    ) { }

    projectVector(matrix: Matrix3D, vector: Vector3D) {
        return matrix.transformVector(vector);
    }

    projectVectors(
        matrix: Matrix3D,
        verts: number[],
        projectedVerts: number[],
        uvts: number[],
    ) {

        /** Clear projected Verts **/
        while (projectedVerts.length > 0) {
            projectedVerts.pop();
        }
        const transformed: number[] = [];
        matrix.transformVectors(verts, transformed);
        for (let i = 0; i < transformed.length / 3; i++) {
            const x = transformed[i * 3], y = transformed[i * 3 + 1];
            projectedVerts.push(x, y);
        }
    }

    /**
     * 创建 Matrix3D 对象。  
     * 如果未定义任何参数，则构造函数会生成一个恒等或单位 Matrix3D 对象。
     * 在矩阵表示法中，恒等矩阵中的主对角线位置上的所有元素的值均为一，而所有其他元素的值均为零。
     * 恒等矩阵的 rawData 属性的值为 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1。
     * 恒等矩阵的位置或平移值为 Vector3D(0,0,0)，旋转设置为 Vector3D(0,0,0)，缩放值为 Vector3D(1,1,1)。
     * 
     * @param a 用于初始化的Array或者Vector.<Number>。一个由 16 个数字组成的矢量，其中，每四个元素可以是 4x4 矩阵的一列。
     */
    createMatrix3D(a?: number[]) {
        return new Matrix3D(a);
    }

    /**
     * 用指定的颜色通道值和 Alpha 值为显示对象创建 ColorTransform 对象。
     * 
     * @param redMultiplier 红色乘数的值，在 0 到 1 范围内。
     * @param greenMultiplier 绿色乘数的值，在 0 到 1 范围内。
     * @param blueMultiplier 蓝色乘数的值，在 0 到 1 范围内。
     * @param alphaMultiplier Alpha 透明度乘数的值，在 0 到 1 范围内。
     * @param redOffset 红色通道值的偏移量，在 -255 到 255 范围内。
     * @param greenOffset 绿色通道值的偏移量，在 -255 到 255 范围内。
     * @param blueOffset 蓝色通道值的偏移量，在 -255 到 255 范围内。
     * @param alphaOffset Alpha 透明度通道值的偏移量，在 -255 到 255 范围内。
     */
    createColorTransform(
        redMultiplier = 1,
        greenMultiplier = 1,
        blueMultiplier = 1,
        alphaMultiplier = 1,
        redOffset = 0,
        greenOffset = 0,
        blueOffset = 0,
        alphaOffset = 0,
    ) {
        return new ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset);
    }

    /**
     * 创建一个具有指定属性的 TextFormat 对象。然后可更改 TextFormat 对象的属性以更改文本字段的格式设置。
     * 
     * @param font 文本字体名称
     * @param size 大小
     * @param color 使用此文本格式的文本的颜色。包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
     * @param bold 文本是否为粗体字
     * @param italic 文本是否为斜体
     * @param underline 文本是否带有下划线
     * @param url 此文本格式的文本超链接到的 URL。如果 url 为空字符串，则表示文本没有超链接。
     * @param target 显示超链接的目标窗口。如果目标窗口为空字符串，则文本显示在默认目标窗口 _self 中。如果 url 参数设置为空字符串或值 null，虽然您可以获取或设置此属性，但该属性不起作用。
     * @param align 段落的对齐方式，作为 TextFormatAlign 值。
     * @param leftMargin 段落的左边距，以像素为单位。
     * @param rightMargin 段落的右边距，以像素为单位。
     * @param indent 从左边距到段落中第一个字符的缩进。
     * @param leading 行与行之间的前导垂直间距量。
     * @returns 
     */
    createTextFormat(
        font?: string,
        size?: number,
        color?: number,
        bold?: boolean,
        italic?: boolean,
        underline?: boolean,
        url?: string,
        target?: string,
        align?: string,
        leftMargin?: number,
        rightMargin?: number,
        indent?: number,
        leading?: number,
    ) {
        return new TextFormat(font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading);
    }
}

/** 通用创建参数 */
export interface IDisplay {
    /** 新创建元件的X轴座标 */
    x: number;
    /** 新创建元件的Y轴座标 */
    y: number;
    /** 元件的生存时间：秒 */
    lifeTime: number;
    /** 元件的透明度 */
    alpha: number;
    /** 文字类元件的色彩 */
    color: number;
    /** 文字类元件的大小 */
    fontsize: number;
    /** 元件的父元件 可选 (进阶应用) */
    parent?: DisplayObject<HTMLDivElement>;
    /** 元件移动策略 可选 */
    motion?: IMotion;
    /** 元件移动策略组 可选 此选项填写后motion将失效 此属性为motion数组 */
    motionGroup?: IMotion[];
}

/** 元件移动策略 */
export interface IMotion {
    /** X轴座标 */
    x?: IMotionValue;
    /** Y轴座标 */
    y?: IMotionValue;
    /** 透明度 */
    alpha?: IMotionValue;
    /** Z轴旋转角度 */
    rotationZ?: IMotionValue;
    /** Y轴旋转角度 */
    rotationY?: IMotionValue;
}

export interface IMotionValue {
    /** 起始移动属性值 */
    fromValue: number;
    /** 结束移动属性值 如留空则不移动 */
    toValue?: number;
    /** 以秒为单位的移动生存时间 如留空则与整体生存时间一致 */
    lifeTime?: number;
    /** 以毫秒为单位的起始移动延时时间 */
    startDelay?: number;
    /** 补间效果 */
    easing?: 'None' | 'Back' | 'Bounce' | 'Circular' | 'Cubic' | 'Elastic' | 'Exponential' | 'Sine' | 'Quintic' | 'Linear';
    /** 效果重复次数 */
    repeat?: number;
}

export interface IButton extends IDisplay {
    /** 按钮标题 */
    text: string;
    /** 点击处理函数 */
    onclick: Function;
}