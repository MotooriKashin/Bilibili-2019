/**
 * 可使用 ColorTransform 类调整显示对象的颜色值。
 * 可以将颜色调整或颜色转换应用于所有四种通道：红色、绿色、蓝色和 Alpha 透明度。  
 * 当 ColorTransform 对象应用于显示对象时，将按如下方法为每个颜色通道计算新值：
 *    - 新红色值 = (旧红色值 * redMultiplier) + redOffset
 *    - 新绿色值 = (旧绿色值 * greenMultiplier) + greenOffset
 *    - 新蓝色值 = (旧蓝色值 * blueMultiplier) + blueOffset
 *    - 新 Alpha 值 = (旧 Alpha 值 * alphaMultiplier) + alphaOffset
 * 
 * 如果计算后任何一个颜色通道值大于 255，则该值将被设置为 255。
 * 如果该值小于 0，它将被设置为 0。  
 * 可以通过下列方式使用 ColorTransform 对象：
 *    - 在 BitmapData 类的 colorTransform() 方法的 colorTransform 参数中
 *    - 作为 Transform 对象（此对象可以用作显示对象的 transform 属性）的 colorTransform 属性
 * 
 * 必须使用 new ColorTransform() 构造函数创建 ColorTransform 对象后，才能调用 ColorTransform 对象的方法。  
 * 颜色转换不会应用于影片剪辑（如加载的 SWF 对象）的背景色，它们仅应用于附加到影片剪辑的图形和元件。
 */
export class ColorTransform {

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
    constructor(
        public redMultiplier = 1,
        public greenMultiplier = 1,
        public blueMultiplier = 1,
        public alphaMultiplier = 1,
        public redOffset = 0,
        public greenOffset = 0,
        public blueOffset = 0,
        public alphaOffset = 0,
    ) { }

    /**
     * ColorTransform 对象的 RGB 颜色值。  
     * 设置此属性时，会相应地更改三种颜色的偏移量值（redOffset、greenOffset 和 blueOffset），并将这三个颜色乘数值（redMultiplier、greenMultiplier 和 blueMultiplier）设置为 0。
     * Alpha 透明度乘数和偏移量值不变。  
     * 在传递此属性的值时，请使用格式 0xRRGGBB。RR、GG 和 BB 均包含两个十六进制数字，这些数字指定每个颜色成分的偏移量。
     */
    get color() {
        return this.redOffset << 16 | this.greenOffset << 8 | this.blueOffset;
    }
    set color(newColor: number) {
        this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 0;
        this.redOffset = newColor >> 16 & 255;
        this.greenOffset = newColor >> 8 & 255;
        this.blueOffset = newColor & 255;
    }

    /**
     * 将 second 参数指定的 ColorTranform 对象与当前 ColorTransform 对象连接，并将当前对象设置为结果，即两个颜色转换的相加组合。
     * 在应用级联的 ColorTransform 对象时，其效果与在原始 颜色转换后应用 second 颜色转换的效果相同。
     * 
     * @param second 要与当前 ColorTransform 对象合并的 ColorTransform 对象。
     */
    concat(second: ColorTransform) {
        this.alphaOffset = this.alphaOffset + this.alphaMultiplier * second.alphaOffset;
        this.alphaMultiplier = this.alphaMultiplier * second.alphaMultiplier;
        this.redOffset = this.redOffset + this.redMultiplier * second.redOffset;
        this.redMultiplier = this.redMultiplier * second.redMultiplier;
        this.greenOffset = this.greenOffset + this.greenMultiplier * second.greenOffset;
        this.greenMultiplier = this.greenMultiplier * second.greenMultiplier;
        this.blueOffset = this.blueOffset + this.blueMultiplier * second.blueOffset;
        this.blueMultiplier = this.blueMultiplier * second.blueMultiplier;
    }

    /** 设置字符串格式并将其返回，该字符串描述 ColorTransform 对象的所有属性。 */
    toString() {
        return "(redMultiplier=" + this.redMultiplier + ", greenMultiplier=" + this.greenMultiplier + ", blueMultiplier=" + this.blueMultiplier + ", alphaMultiplier=" + this.alphaMultiplier + ", redOffset=" + this.redOffset + ", greenOffset=" + this.greenOffset + ", blueOffset=" + this.blueOffset + ", alphaOffset=" + this.alphaOffset + ")";
    }
}