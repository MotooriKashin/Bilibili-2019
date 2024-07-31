import { IMotionValue } from "../Display/Display";
import { DisplayObject } from "../Display/DisplayObject";
import { ITween, Parallel, Animate, Serial } from "./ITween";
import { bezierLerp } from "./bezier-lerp";

/** 弹幕移动工具 */
export class Tween {

    /**
     * 使用指定方法对物件进行移动
     *
     * @param object 要移动的物件
     * @param dest 移动目标数值
     * @param src 移动来源数值
     * @param duration 移动时间：秒
     * @param easing 移动函数
     */
    static tween(
        object: DisplayObject<HTMLElement>,
        dest: Point,
        src?: Point,
        duration = 0,
        easing?: IMotionValue['easing'],
    ) {
        const keyframes: Keyframe[] = [];
        const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards', duration: duration * 1000 };
        if (src) {
            const keyframe = <Keyframe>{};
            'x' in src && (keyframe.left = src.x + 'px');
            'y' in src && (keyframe.top = src.y + 'px');
            keyframes.push(keyframe);
        }
        const keyframe = <Keyframe>{};
        'x' in dest && (keyframe.left = dest.x + 'px');
        'y' in dest && (keyframe.top = dest.y + 'px');
        keyframes.push(keyframe);
        return new Animate(object, keyframes, keyframeAnimationOptions);
    }

    /**
     * 使用指定方法对物件进行移动
     *
     * @param object 要移动的物件
     * @param dest 移动目标数值
     * @param duration 移动时间
     * @param easing 移动函数
     */
    static to(
        object: DisplayObject<HTMLElement>,
        dest: Point,
        duration: number,
        easing: IMotionValue['easing'],
    ) {
        return this.tween(object, dest, undefined, duration, easing);
    }

    /**
     * 以贝赛尔曲线对物件进行移动
     *
     * @param object 要移动的物件
     * @param dest 移动目标数值
     * @param src 移动起始数值
     * @param control 贝赛尔曲线控制点
     * @param duration 移动时间
     * @param easing 移动函数
     */
    static bezier(
        object: DisplayObject<HTMLElement>,
        dest: Point,
        src: Point | undefined,
        control: IMotionControl,
        duration = 1,
        easing: Function,
    ) {
        const keyframes: Keyframe[] = [];
        const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards', duration: duration * 1000 };
        const points: Point[] = [src || { x: 0, y: 0 }];
        control.x.forEach((d, i) => {
            points.push({
                x: d,
                y: control.y[i]
            });
        });
        points.push(dest);
        const res = bezierLerp(points);
        res.push(dest);
        src && res.unshift(src);
        res.forEach(d => {
            const keyframe = <Keyframe>{};
            'x' in d && (keyframe.left = d.x + 'px');
            'y' in d && (keyframe.top = d.y + 'px');
            keyframes.push(keyframe);
        });
        return new Animate(object, keyframes, keyframeAnimationOptions);
    }

    /**
     * 串行执行效果
     *
     * @param srcs 串行来源效果
     */
    static serial(...srcs: ITween[]) {
        return new Serial(srcs);
    }

    /**
     * 并行执行效果
     *
     * @param srcs 并行来源效果
     */
    static parallel(...srcs: ITween[]) {
        return new Parallel(srcs);
    }

    /**
     * 复制指定效果并按时间拉伸
     *
     * @param src 复制来源效果
     * @param scale 时间轴缩放比例
     */
    static scale(
        src: ITween,
        scale = 1,
    ) {
        const res = src.clone();
        res.scale(scale);
        return res;
    }

    /**
     * 复制指定效果并延迟执行
     *
     * @param src 复制来源效果
     * @param delay 以秒为单位的延迟时间
     */
    static delay(src: ITween, delay: number) {
        const res = src.clone();
        res.delay(delay || 0);
        return res;
    }

    /**
     * 将指定效果反向
     *
     * @param src 复制来源效果
     */
    static reverse(src: ITween) {
        const res = src.clone();
        res.reverse();
        return res;
    }

    /**
     * 重复指定效果
     *
     * @param src 复制来源效果
     * @param times 效果执行次数
     */
    static repeat(src: ITween, times: number) {
        const res = src.clone();
        res.repeat(times);
        return res;
    }

    /**
     * 取出指定效果时间
     *
     * @param src 复制来源效果
     * @param from 起始时间(秒)
     * @param to 结束时间(秒)
     */
    static slice(src: ITween, from: number, to: number) {
        const res = src.clone();
        res.slice(from, to);
        return res;
    }
}

interface Point {
    x: number;
    y: number;
}

/** 贝赛尔曲线控制点数据 */
interface IMotionControl {
    /** X轴座标 */
    x: number[];
    /** Y轴座标 */
    y: number[];
}