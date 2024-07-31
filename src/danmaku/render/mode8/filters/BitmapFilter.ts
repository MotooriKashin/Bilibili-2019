/**
 * BitmapFilter 类是所有图像滤镜效果的基类。  
 * BevelFilter、BlurFilter、ColorMatrixFilter、ConvolutionFilter、DisplacementMapFilter、DropShadowFilter、GlowFilter、GradientBevelFilter 和 GradientGlowFilter 类都扩展了 BitmapFilter 类。
 * 您可以将这些滤镜效果应用于任何显示对象。  
 * 不可以直接实例化或扩展 BitmapFilter。
 */
export abstract class BitmapFilter {

    /** 返回 BitmapFilter 对象，它是与原始 BitmapFilter 对象完全相同的副本。 */
    abstract clone(): BitmapFilter;
}