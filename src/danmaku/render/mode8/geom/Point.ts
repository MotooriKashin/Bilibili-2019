/** Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。 */
export class Point {

    /**
     * 创建一个新点。
     * 如果不向此方法传递任何参数，则在 (0,0) 处创建一个点。
     * 
     * @param x 水平坐标。
     * @param y 垂直坐标。
     */
    constructor(public x = 0, public y = 0) { }

    /** 从 (0,0) 到此点的线段长度。 */
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 将另一个点的坐标添加到此点的坐标以创建一个新点。
     * 
     * @param v 要添加的点。
     */
    add(v: Point) {
        return new Point(this.x + v.x, this.y + v.y);
    }

    /** 创建此 Point 对象的副本。 */
    clone() {
        return new Point(this.x, this.y);
    }

    /**
     * 将源 Point 对象中的所有点数据复制到调用方 Point 对象中。
     * 
     * @param sourcePoint 要从中复制数据的 Point 对象。
     */
    copyFrom(sourcePoint: Point) {
        this.x = sourcePoint.x;
        this.y = sourcePoint.y;
    }

    /**
     * 返回 pt1 和 pt2 之间的距离。
     * 
     * @param pt1 第一个点。
     * @param pt2 第二个点。
     */
    static distance(pt1: Point, pt2: Point) {
        return pt1.subtract(pt2).length;
    }

    /**
     * 确定两个点是否相同。
     * 如果两个点具有相同的 x 和 y 值，则它们是相同的点。
     * 
     * @param toCompare 要比较的点。
     */
    equals(toCompare: Point) {
        return toCompare.x === this.x && toCompare.y === this.y;
    }

    /**
     * 确定两个指定点之间的点。
     * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。
     * 参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。
     * 参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
     * 
     * @param pt1 第一个点。
     * @param pt2 第二个点。
     * @param f 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
     */
    static interpolate(pt1: Point, pt2: Point, f: number) {
        return new Point(pt2.x + f * (pt1.x - pt2.x), pt2.y + f * (pt1.y - pt2.y));
    }

    /**
     * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
     * 
     * @param thickness 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
     */
    normalize(thickness: number) {
        let invD = this.length;
        if (invD > 0) {
            invD = thickness / invD;
            this.x = this.x * invD;
            this.y = this.y * invD;
        }
    }

    /**
     * 按指定量偏移 Point 对象。
     * dx 的值将添加到 x 的原始值中以创建新的 x 值。
     * dy 的值将添加到 y 的原始值中以创建新的 y 值。
     * 
     * @param dx 水平坐标 x 的偏移量。
     * @param dy 垂直坐标 y 的偏移量。
     */
    offset(dx: number, dy: number) {
        this.x = this.x + dx;
        this.y = this.y + dy;
    }

    /**
     * 将一对极坐标转换为笛卡尔点坐标。
     * 
     * @param len 极坐标对的长度。
     * @param angle 极坐标对的角度（以弧度表示）。
     */
    static polar(len: number, angle: number) {
        return new Point(len * Math.cos(angle), len * Math.sin(angle));
    }

    /**
     * 将 Point 的成员设置为指定值
     * 
     * @param xa 要将 x 设置为的值。
     * @param ya 要将 y 设置为的值。
     */
    setTo(xa: number, ya: number) {
        this.x = xa;
        this.y = ya;
    }

    /**
     * 从此点的坐标中减去另一个点的坐标以创建一个新点。
     * 
     * @param v 要减去的点。
     */
    subtract(v: Point) {
        return new Point(this.x - v.x, this.y - v.y);
    }

    /**
     * 返回包含 x 和 y 坐标的值的字符串。
     * 该字符串的格式为 "(x=x, y=y)"，因此为点 23,17 调用 toString() 方法将返回 "(x=23, y=17)"。
     */
    toString() {
        return "(x=" + this.x + ", y=" + this.y + ")";
    }
}