/**
 * 生成贝塞尔曲线拟合采样点序列
 * 
 * @param points 起始点和控制点组成的序列
 * @param total 采样精度，即返回的拟合点数目，默认为 9 个
 * @returns 返回贝塞尔曲线拟合采样点序列
 */
export function bezierLerp(points: Point[], total = 9) {
    const res: Point[] = [];
    for (let i = total; i > 0; i--) {
        res.push(getCurvePoint(i / (total + 1), points))
    }
    return res;
}

function getCurvePoint(t: number, points: Point[]) {
    if (points.length === 1) return points[0];
    const newpoints = [];
    for (let i = 0, j = 1; j < points.length; i++, j++) {
        newpoints[i] = lerp2d(t, points[i], points[j]);
    }
    return getCurvePoint(t, newpoints);
}

function lerp(ratio: number, start: number, end: number) {
    return ratio * start + (1 - ratio) * end;
}

function lerp2d(ratio: number, start: Point, end: Point) {
    return {
        x: lerp(ratio, start.x, end.x),
        y: lerp(ratio, start.y, end.y)
    };
}

interface Point {
    x: number;
    y: number;
}