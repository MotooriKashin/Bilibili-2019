/**
 * 定义这些值以用于指定路径绘制命令。  
 * 此类中的这些值由 Graphics.drawPath() 方法使用，或存储在 GraphicsPath 对象的 commands 矢量中。
 */
export enum GraphicsPathCommand {
    /** 指定一个绘图命令，该命令使用两个控制点绘制一条从当前绘图位置开始，到数据矢量中指定的 x 和 y 坐标结束的曲线。 */
    CUBIC_CURVE_TO = 6,
    /**
     * 指定一个绘图命令，该命令使用控制点绘制一条从当前绘图位置开始，到数据矢量中指定的 x 和 y 坐标结束的曲线。
     * 此命令将产生与 Graphics.lineTo() 方法相同的效果，并使用数据矢量控制和锚记中的两个点：(cx, cy, ax, ay)。
     */
    CURVE_TO = 3,
    /**
     * 指定一个绘图命令，该命令绘制一条从当前绘图位置开始，到数据矢量中指定的 x 和 y 坐标结束的直线。
     * 此命令将产生与 Graphics.lineTo() 方法相同的效果，并使用数据矢量中的一个点：(x,y)。
     */
    LINE_TO = 2,
    /**
     * 指定一个绘图命令，该命令会将当前绘图位置移动到数据矢量中指定的 x 和 y 坐标。
     * 此命令将产生与 Graphics.moveTo() 方法相同的效果，并使用数据矢量中的一个点：(x,y)。
     */
    MOVE_TO = 1,
    /** 表示默认的“不执行任何操作”命令。 */
    NO_OP = 0,
    /**
     * 指定一个“直线至”绘图命令，但使用两组坐标（四个值），而不是一组坐标。
     * 使用此命令可在“直线至”和“曲线至”命令之间切换，而无需更改每个命令使用的数据值的个数。
     * 此命令使用数据矢量中的两组坐标：一个虚拟位置和一个 (x,y) 位置。  
     * WIDE_LINE_TO 和 WIDE_MOVE_TO 命令变体与 CURVE_TO 命令假定使用相同数目的参数。
     */
    WIDE_LINE_TO = 5,
    /**
     * 指定一个“移至”绘图命令，但使用两组坐标（四个值），而不是一组坐标。
     * 使用此命令可在“移至”和“曲线至”命令之间切换，而无需更改每个命令使用的数据值的个数。
     * 此命令使用数据矢量中的两组坐标：一个虚拟位置和一个 (x,y) 位置。  
     * WIDE_LINE_TO 和 WIDE_MOVE_TO 命令变体与 CURVE_TO 命令假定使用相同数目的参数。
     */
    WIDE_MOVE_TO = 4,
}