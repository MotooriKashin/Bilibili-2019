import { Point } from "./Point";

/**
 * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。  
 * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
 * 但是，right 和 bottom 属性与这四个属性是整体相关的。
 * 例如，如果更改 right 属性的值，则 width 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。  
 * 以下方法和属性使用 Rectangle 对象：
 *    - applyFilter()、colorTransform()、copyChannel()、copyPixels()、draw()、fillRect()、generateFilterRect()、getColorBoundsRect()、getPixels()、merge()、paletteMap()、pixelDisolve()、setPixels() 和 threshold() 方法，以及 BitmapData 类的 rect 属性
 *    - getBounds() 和 getRect() 方法，以及 DisplayObject 类的 scrollRect 和 scale9Grid 属性
 *    - TextField 类的 getCharBoundaries() 方法
 *    - Transform 类的 pixelBounds 属性
 *    - Sprite 类的 startDrag() 方法的 bounds 参数
 *    - PrintJob 类的 addPage() 方法的 printArea 参数
 * 
 * 您可以使用 new Rectangle() 构造函数创建 Rectangle 对象。  
 * **注意：**Rectangle 类不定义矩形 Shape 显示对象。
 * 要在屏幕上绘制矩形 Shape 对象，请使用 Graphics 类的 drawRect() 方法。
 */
export class Rectangle {

    /**
     * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
     * 如果调用此函数时不使用任何参数，将创建一个 x、y、width 和 height 属性均设置为 0 的矩形。
     * 
     * @param x 矩形左上角的 x 坐标。
     * @param y 矩形左上角的 y 坐标。
     * @param width 矩形的宽度（以像素为单位）。
     * @param height 矩形的高度（以像素为单位）。
     */
    constructor(
        public x = 0,
        public y = 0,
        public width = 0,
        public height = 0,
    ) { }

    /** y 和 height 属性的和。 */
    get bottom() {
        return this.y + this.height;
    }
    set bottom(value) {
        this.height = value - this.y;
    }

    /** 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。 */
    get bottomRight() {
        return new Point(this.right, this.bottom);
    }
    set bottomRight(value: Point) {
        this.width = value.x - this.x;
        this.height = value.y - this.y;
    }

    /**
     * 矩形左上角的 x 坐标。  
     * 更改 Rectangle 对象的 left 属性对 y 和 height 属性没有影响。
     * 但是，它会影响 width 属性，而更改 x 值不会影响 width 属性。  
     * left 属性的值等于 x 属性的值。
     */
    get left() {
        return this.x;
    }
    set left(value) {
        this.width = this.width + (this.x - value);
        this.x = value;
    }

    /** x 和 width 属性的和。 */
    get right() {
        return this.x + this.width;
    }
    set right(value) {
        this.width = value - this.x;
    }

    /** Rectangle 对象的大小，该对象表示为具有 width 和 height 属性的值的 Point 对象。 */
    get size() {
        return new Point(this.width, this.height);
    }
    set size(value: Point) {
        this.width = value.x;
        this.height = value.y;
    }

    /**
     * 矩形左上角的 y 坐标。  
     * 更改 Rectangle 对象的 top 属性对 x 和 width 属性没有影响。
     * 但是，它会影响 height 属性，而更改 y 值不会影响 height 属性。  
     * top 属性的值等于 y 属性的值。
     */
    get top() {
        return this.y;
    }
    set top(value) {
        this.height = this.height + (this.y - value);
        this.y = value;
    }

    /** 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。 */
    get topLeft() {
        return new Point(this.x, this.y);
    }
    set topLeft(value: Point) {
        this.width = this.width + (this.x - value.x);
        this.height = this.height + (this.y - value.y);
        this.x = value.x;
        this.y = value.y;
    }

    /** 返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。 */
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /** 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。 */
    contains(x: number, y: number) {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
    }

    /**
     * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
     * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
     * 
     * @param point 用其 x 和 y 坐标表示的点。
     */
    containsPoint(point: Point) {
        return point.x >= this.x && point.x < this.x + this.width && point.y >= this.y && point.y < this.y + this.height;
    }

    /**
     * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
     * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
     * 
     * @param rect 所检查的 Rectangle 对象。
     */
    containsRect(rect: Rectangle) {
        const r1 = rect.x + rect.width;
        const b1 = rect.y + rect.height;
        const r2 = this.x + this.width;
        const b2 = this.y + this.height;
        return rect.x >= this.x && rect.x < r2 && rect.y >= this.y && rect.y < b2 && r1 > this.x && r1 <= r2 && b1 > this.y && b1 <= b2;
    }

    /**
     * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中。
     * 
     * @param sourceRect 要从中复制数据的 Rectangle 对象。
     */
    copyFrom(sourceRect: Rectangle) {
        this.x = sourceRect.x;
        this.y = sourceRect.y;
        this.width = sourceRect.width;
        this.height = sourceRect.height;
    }
    /**
     * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
     * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
     * 
     * @param toCompare 要与此 Rectangle 对象进行比较的矩形。
     * @returns 
     */
    equals(toCompare: Rectangle) {
        return toCompare.x === this.x && toCompare.y === this.y && toCompare.width === this.width && toCompare.height === this.height;
    }

    /**
     * 按指定量增加 Rectangle 对象的大小（以像素为单位）。
     * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
     * 
     * @param dx Rectangle 对象横向增加的值。
     * @param dy Rectangle 纵向增加的值。
     */
    inflate(dx: number, dy: number) {
        this.x = this.x - dx;
        this.width = this.width + 2 * dx;
        this.y = this.y - dy;
        this.height = this.height + 2 * dy;
    }

    /**
     * 增加 Rectangle 对象的大小。
     * 此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
     * 
     * @param point 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
     */
    inflatePoint(point: Point) {
        this.x = this.x - point.x;
        this.width = this.width + 2 * point.x;
        this.y = this.y - point.y;
        this.height = this.height + 2 * point.y;
    }

    /**
     * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。
     * 如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
     * 
     * @param toIntersect 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
     */
    intersection(toIntersect: Rectangle) {
        const result = new Rectangle();
        if (this.isEmpty() || toIntersect.isEmpty()) {
            result.setEmpty();
            return result;
        }
        result.x = Math.max(this.x, toIntersect.x);
        result.y = Math.max(this.y, toIntersect.y);
        result.width = Math.min(this.x + this.width, toIntersect.x + toIntersect.width) - result.x;
        result.height = Math.min(this.y + this.height, toIntersect.y + toIntersect.height) - result.y;
        if (result.width <= 0 || result.height <= 0) {
            result.setEmpty();
        }
        return result;
    }

    /**
     * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。
     * 此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
     * 
     * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
     */
    intersects(toIntersect: Rectangle) {
        if (this.isEmpty() || toIntersect.isEmpty()) {
            return false;
        }
        const resultx = Math.max(this.x, toIntersect.x);
        const resulty = Math.max(this.y, toIntersect.y);
        const resultwidth = Math.min(this.x + this.width, toIntersect.x + toIntersect.width) - resultx;
        const resultheight = Math.min(this.y + this.height, toIntersect.y + toIntersect.height) - resulty;
        if (resultwidth <= 0 || resultheight <= 0) {
            return false;
        }
        return true;
    }

    /** 确定此 Rectangle 对象是否为空。 */
    isEmpty() {
        return this.width <= 0 || this.height <= 0;
    }

    /**
     * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
     * 
     * @param dx 将 Rectangle 对象的 x 值移动此数量。
     * @param dy 将 Rectangle 对象的 y 值移动此数量。
     */
    offset(dx: number, dy: number) {
        this.x = this.x + dx;
        this.y = this.y + dy;
    }

    /**
     * 将 Point 对象用作参数来调整 Rectangle 对象的位置。
     * 此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
     * 
     * @param point 要用于偏移此 Rectangle 对象的 Point 对象。
     */
    offsetPoint(point: Point) {
        this.x = this.x + point.x;
        this.y = this.y + point.y;
    }

    /**
     * 将 Rectangle 对象的所有属性设置为 0。
     * 如果 Rectangle 对象的宽度或高度小于或等于 0，则该对象为空。  
     * 此方法将 x、y、width 和 height 属性设置为 0。
     */
    setEmpty() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    /**
     * 将 Rectangle 的成员设置为指定值
     * 
     * @param xa 要将 x 设置为的值。
     * @param ya 要将 y 设置为的值。
     * @param widtha 要将 width 设置为的值。
     * @param heighta 要将 height 设置为的值。
     */
    setTo(xa: number, ya: number, widtha: number, heighta: number) {
        this.x = xa;
        this.y = ya;
        this.width = widtha;
        this.height = heighta;
    }

    /** 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。 */
    toString() {
        return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
    }

    /**
     * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
     * **注意：**union() 方法忽略高度或宽度值为 0 的矩形，如：const rect2 = new Rectangle(300,300,50,0);
     * 
     * @param toUnion 要添加到此 Rectangle 对象的 Rectangle 对象。
     */
    union(toUnion: Rectangle) {
        let r: Rectangle;
        if (this.isEmpty()) {
            return toUnion.clone();
        }
        if (toUnion.isEmpty()) {
            return this.clone();
        }
        r = new Rectangle();
        r.x = Math.min(this.x, toUnion.x);
        r.y = Math.min(this.y, toUnion.y);
        r.width = Math.max(this.x + this.width, toUnion.x + toUnion.width) - r.x;
        r.height = Math.max(this.y + this.height, toUnion.y + toUnion.height) - r.y;
        return r;
    }
}