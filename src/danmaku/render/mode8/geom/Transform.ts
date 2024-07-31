import { DisplayObject } from "../Display/DisplayObject";
import { ColorTransform } from "./ColorTransform";
import { Matrix } from "./Matrix";
import { Matrix3D } from "./Matrix3D";
import { PerspectiveProjection } from "./PerspectiveProjection";
import { Rectangle } from "./Rectangle";
import { Vector3D } from "./Vector3D";

/**
 * 利用 Transform 类，可以访问可应用于显示对象的颜色调整属性和二维或三维转换对象。
 * 在转换过程中，会将显示对象的颜色或方向和位置从当前值或坐标调整（偏移）到新值或坐标。
 * Transform 类还收集有关应用于显示对象及其所有父对象的颜色和二维矩阵转换的数据。
 * 可以通过 concatenatedColorTransform 和 concatenatedMatrix 属性访问这些组合转换。  
 * 要应用颜色转换，请执行下列操作：创建一个 ColorTransform 对象，并使用该对象的方法和属性设置颜色调整，然后将显示对象的 transform 属性的 colorTransformation 属性分配给新的 ColorTransformation 对象。  
 * 要应用二维转换，请执行下列操作：创建一个 Matrix 对象，并设置该矩阵的二维转换，然后将显示对象的 transform.matrix 属性分配给新的 Matrix 对象。  
 * 要应用三维转换，应首先创建一个三维显示对象。
 * 三维显示对象具有一个非零的 z 属性值。
 * 您无需创建 Matrix3D 对象。
 * 对于所有三维对象，当您为显示对象分配 z 值时，将自动创建 Matrix3D 对象。
 * 可以通过显示对象的 transform 属性访问显示对象的 Matrix3D 对象。
 * 使用 Matrix3D 类的方法，可以添加或修改现有转换设置。
 * 还可以创建自定义 Matrix3D 对象，并设置该对象的转换元素，然后使用 transform.matrix 属性将新的 Matrix3D 对象分配给显示对象。  
 * 要修改舞台或 root 对象的透视投影，请执行下列操作：使用 root 显示对象的 transform.matrix 属性以访问 PerspectiveProjection 对象。
 * 或者，通过设置显示对象的父级的透视投影属性，对显示对象应用不同的透视投影属性。
 * 子显示对象会继承新属性。
 * 具体而言，创建一个 PerspectiveProjection 对象并设置其属性，然后将此 PerspectiveProjection 对象分配给父显示对象的 transform 属性的 perspectiveProjection 属性。
 * 然后，指定的投影转换将应用于显示对象的所有三维子级。  
 * 由于 PerspectiveProjection 对象和 Matrix3D 对象都会执行透视转换，因此不要将二者同时分配给显示对象。
 * 将 PerspectiveProjection 对象用于焦距和投影中心更改。
 * 要获取对透视转换的更多控制，请创建透视投影 Matrix3D 对象。
 */
export class Transform {

    private _matrix = new Matrix();

    private _matrix3d = new Matrix3D();

    private _colorTransform = new ColorTransform();

    private _concatenatedColorTransform = new ColorTransform();

    private colorDirty = true;

    private dirty = true;

    private _concatenatedMatrix = new Matrix();

    private invDirty = true;

    private _invMatrix = new Matrix();

    private _perspectiveProjection?: PerspectiveProjection;

    constructor(public displayObject: DisplayObject<HTMLElement>) { }

    /** 一个 ColorTransform 对象，其中包含整体调整显示对象颜色的值。 */
    get colorTransform() {
        return this._colorTransform;
    }
    set colorTransform(value) {
        this._colorTransform = value;
        this.updateColorTransforms();
    }

    /**
     * 一个 ColorTransform 对象，表示应用于此显示对象及其所有父级对象的组合颜色转换，回到根级别。
     * 如果在不同级别上应用了不同的颜色转换，则将其中所有转换连接成此属性的一个 ColorTransform 对象。
     */
    get concatenatedColorTransform() {
        if (this.colorDirty) {
            this._concatenatedColorTransform.alphaOffset = this._colorTransform.alphaOffset;
            this._concatenatedColorTransform.alphaMultiplier = this._colorTransform.alphaMultiplier;
            this._concatenatedColorTransform.redOffset = this._colorTransform.redOffset;
            this._concatenatedColorTransform.redMultiplier = this._colorTransform.redMultiplier;
            this._concatenatedColorTransform.greenOffset = this._colorTransform.greenOffset;
            this._concatenatedColorTransform.greenMultiplier = this._colorTransform.greenMultiplier;
            this._concatenatedColorTransform.blueOffset = this._colorTransform.blueOffset;
            this._concatenatedColorTransform.blueMultiplier = this._colorTransform.blueMultiplier;
            if (this.displayObject.parent) {
                this._concatenatedColorTransform.concat(this.displayObject.parent.transform.concatenatedColorTransform);
            }
            this.colorDirty = false;
        }
        return this._concatenatedColorTransform;
    }

    /**
     * 一个 Matrix 对象，表示此显示对象及其所有父级对象的组合转换矩阵，回到根级别。
     * 如果在不同级别上应用了不同的转换矩阵，则将其中所有矩阵连接成此属性的一个矩阵。
     * 此外，对于浏览器中运行的可调整大小的 SWF 内容，此属性将因调整窗口大小而造成的舞台坐标与窗口坐标之差视为重要因素。
     * 因此，该属性将局部坐标转换为窗口坐标，后者可能与舞台的坐标空间不同。
     */
    get concatenatedMatrix() {
        if (this.dirty) {
            this._concatenatedMatrix.copyFrom(this.matrix);
            if (this.displayObject.parent) {
                this._concatenatedMatrix.concat(this.displayObject.parent.transform.concatenatedMatrix);
            }
            this.dirty = false;
        }
        return this._concatenatedMatrix;
    }

    get invMatrix() {
        if (this.invDirty) {
            this._invMatrix.copyFrom(this.concatenatedMatrix);
            this._invMatrix.invert();
            this.invDirty = false;
        }
        return this._invMatrix;
    }

    /** 是否3D变换 */
    $3d = false;

    /**
     * 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值。  
     * 如果将 matrix 属性设置为某个值（非 null），则 matrix3D 属性为 null。
     * 如果将 matrix3D 属性设置为某个值（非 null），则 matrix 属性为 null。
     */
    get matrix() {
        return this._matrix;
    }
    set matrix(value) {
        if (value) {
            this._matrix = value;
            this.$3d = false;
        }
        this.updateTransforms();
    }

    /**
     * 提供对三维显示对象的 Matrix3D 对象的访问。
     * Matrix3D 对象表示一个转换矩阵，它确定显示对象的位置和方向。
     * Matrix3D 对象还可以执行透视投影。  
     * 如果将 matrix 属性设置为某个值（非 null），则 matrix3D 属性为 null。
     * 如果将 matrix3D 属性设置为某个值（非 null），则 matrix 属性为 null。
     */
    get matrix3D() {
        return this._matrix3d;
    }
    set matrix3D(value) {
        if (value) {
            this._matrix3d = value;
            this.$3d = true;
        }
        this.updateTransforms();
    }

    /**
     * 提供对三维显示对象的 PerspectiveProjection 对象的访问。
     * 可以使用 PerspectiveProjection 对象修改舞台的透视转换，也可以将透视转换分配给显示对象的所有三维子级。  
     * 基于视野和舞台的高宽比（尺寸），将默认的 PerspectiveProjection 对象分配给 root 对象。
     * @deprecated 暂未实现
     */
    get perspectiveProjection() {
        return this._perspectiveProjection || (this._perspectiveProjection = new PerspectiveProjection(this.displayObject))
    }
    set perspectiveProjection(value) {
        this.perspectiveProjection = value;
    }

    /** @deprecated 暂未实现 一个 Rectangle 对象，它定义舞台上的显示对象的边界矩形。 */
    get pixelBounds(): Rectangle | undefined {
        return
    }

    /**
     * 应用3D变换
     * 
     * @param sX 用于沿 x 轴缩放对象的乘数。
     * @param sY 用于沿 y 轴缩放对象的乘数。
     * @param sZ 用于沿 z 轴缩放对象的乘数。
     * @param rotX 沿 x 轴旋转的角度。
     * @param rotY 沿 y 轴旋转的角度。
     * @param rotZ 沿 z 轴旋转的角度。
     * @param tX 沿 x 轴的增量平移。
     * @param tY 沿 y 轴的增量平移。
     * @param tZ 沿 z 轴的增量平移。
     */
    box3d(
        sX = 1,
        sY = 1,
        sZ = 1,
        rotX = 0,
        rotY = 0,
        rotZ = 0,
        tX = 0,
        tY = 0,
        tZ = 0,
    ) {
        this.$3d = true;
        this._matrix3d.identity();
        this._matrix3d.appendRotation(rotX, Vector3D.X_AXIS);
        this._matrix3d.appendRotation(rotY, Vector3D.Y_AXIS);
        this._matrix3d.appendRotation(rotZ, Vector3D.Z_AXIS);
        this._matrix3d.appendScale(sX, sY, sZ);
        this._matrix3d.appendTranslation(tX, tY, tZ);
    }

    /**
     * 应用2D变换
     * 
     * @param sX 用于沿 x 轴缩放对象的乘数。
     * @param sY 用于沿 y 轴缩放对象的乘数。
     * @param rot 旋转的角度。
     * @param tX 沿 x 轴的增量平移。
     * @param tY 沿 y 轴的增量平移。
     */
    box(
        sX = 1,
        sY = 1,
        rot = 0,
        tX = 0,
        tY = 0,
    ) {
        this.$3d = false;
        this._matrix.createBox(sX, sY, rot, tX, tY);
    }

    /**
     * 返回一个 Matrix3D 对象，该对象可以相对于当前显示对象的空间转换指定显示对象的空间。
     * 可以使用 getRelativeMatrix3D() 方法，将一个三维显示对象相对于另一个三维显示对象移动。
     * 
     * @deprecated 暂未实现
     * @param relativeTo 相对于其发生转换的显示对象。要获取相对于舞台的 Matrix3D 对象，请将该参数设置为 root 或 stage 对象。要获取显示对象的相对于现实世界的矩阵，请将该参数设置为一个已应用透视转换的显示对象。
     */
    getRelativeMatrix3D(relativeTo: DisplayObject<HTMLElement>): Matrix3D | undefined {
        return
    }

    updateColorTransforms() {
        this.colorDirty = true;
    }

    updateTransforms() {
        this.dirty = true;
        this.invDirty = true;
        this.displayObject && (this.displayObject.transform = this);
    }
}