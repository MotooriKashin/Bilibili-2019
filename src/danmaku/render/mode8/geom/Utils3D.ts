import { Matrix3D } from "./Matrix3D";
import { Vector3D } from "./Vector3D";

/**
 * Utils3D 类包含一些静态方法，可用于简化某些三维矩阵操作的实现过程。
 */
export class Utils3D {

    /**
     * 朝着某个位置插补对象的方向。
     * pointTowards() 方法结合了 Matrix3D.pointAt() 和 Matrix3D.interpolateTo() 方法的功能。  
     * pointTowards() 方法允许对方向进行就地修改。
     * 此方法将对显示对象的 Matrix3D 进行分解，并将旋转元素替换为可使对象朝着目标位置进行不同的百分比转变的元素。
     * 此对象可以在仍按自己的方向移动的同时，逐步向目标转变。
     * 对 pointTowards() 的连续调用（后跟一个转换方法）可生成对象追逐或紧随移动的目标运动的动画。
     * 首先将对象指向一个朝向目标的百分比点，然后沿某个轴逐步移动对象。
     * 
     * @deprecated 暂未实现
     * @param percent 一个介于 0 和 1 之间的数字，它使对象逐步朝着目标转变。
     * @param mat 转换的对象的 Matrix3D 属性。
     * @param pos 目标对象的相对于现实世界的位置。相对于现实世界定义了相对于所有对象所在的现实世界空间和坐标的对象转换。
     * @param at 用于定义显示对象所指向的位置的相对于对象的矢量。相对于对象定义了相对于对象空间（即对象自己的参照帧和坐标系统）的对象转换。默认值为 (0,0,-1)。
     * @param up 用于为显示对象定义“向上”方向的相对于对象的矢量。如果从上至下绘制对象，则 +z 轴为该对象的“up”矢量。相对于对象定义了相对于对象空间（即对象自己的参照帧和坐标系统）的对象转换。默认值为 (0,-1,0)。
     */
    static pointTowards(
        percent: number,
        mat: Matrix3D,
        pos: Vector3D,
        at?: Vector3D,
        up?: Vector3D,
    ): Matrix3D | undefined {
        return
    }

    /**
     * 利用投影 Matrix3D 对象，将 Vector3D 对象从一个空间坐标投影到另一个空间坐标。
     * projectVector() 方法与 Matrix3D.transformVector() 方法类似，只不过 projectVector() 方法将按照投影深度值来划分原始 Vector3D 对象的 x、y 和 z 元素。
     * 深度值是指视图或视角空间中从视点到 Vector3D 对象的距离。
     * 此距离的默认值为 z 元素的值。
     * 
     * @param m 一个用于实现投影转换的投影 Matrix3D 对象。如果某个显示对象中包含 PerspectiveProjection 对象，则可以使用 perspectiveProjection.toMatrix() 方法生成适用于该显示对象的子级的投影 Matrix3D 对象。对于更高级的投影，请使用 matrix3D.rawData 属性创建自定义投影矩阵。不存在用于创建投影 Matrix3D 对象的内置的 Matrix3D 方法。
     * @param v 投影到新的空间坐标的 Vector3D 对象。
     */
    static projectVector(m: Matrix3D, v: Vector3D) {
        const ret = m.transformVector(v);
        ret.scaleBy(1 / ret.z);
        return ret;
    }

    /**
     * 利用投影 Matrix3D 对象，将一个三维空间坐标矢量 (verts) 投影到一个二维空间坐标矢量 (projectedVerts)。
     * 在将投影的 Vector 对象用作参数之前，应预先分配该对象。  
     * projectVectors() 方法还会设置 uvt 数据的 t 值。
     * 应预先分配一个矢量，并且该矢量应可以容纳每个投影的坐标集矢量的 uvts 数据。
     * 还应指定 uvt 数据的 u 和 v 值。
     * uvt 数据是一个用于纹理映射的标准化坐标矢量。
     * 对于 UV 坐标，(0,0) 是位图的左上角，(1,1) 是位图的右下角。  
     * 可将此方法与 Graphics.drawTriangles() 方法和 GraphicsTrianglePath 类配合使用。
     * 
     * @deprecated 暂未实现
     * @param m 一个用于实现投影转换的投影 Matrix3D 对象。可以使用 Matrix3D.rawData 属性生成投影 Matrix3D 对象。
     * @param verts 一个由数字构成的矢量，其中的每三个数字表示一个三维空间的 x、y 和 z 坐标，如 Vector3D(x,y,z)。
     * @param projectedVerts  一个由数字构成的矢量，其中的每两个数字表示一个投影的二维坐标，如 Point(x,y)。应预先分配相应的矢量。projectVectors() 方法将为每个投影的点填充值。
     * @param uvts 一个由数字构成的矢量，其中的每三个数字表示 uvt 数据的 u、v 和 t 元素。u 和 v 是每个投影的点的纹理坐标。t 值为投影深度值，即视图或视角空间中从视点到 Vector3D 对象的距离。应预先分配相应的矢量并指定 u 和 v 值。projectVectors 方法将为每个投影的点填充 t 值。
     */
    static projectVectors(
        m: Matrix3D,
        verts: number[],
        projectedVerts: number[],
        uvts: number[],
    ) { }
}