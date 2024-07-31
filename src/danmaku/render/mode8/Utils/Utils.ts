export class Utils {

    static timers: number[] = [];

    /**
     * 将0-360的值映射到色相环上,例如
     *    - 0 -> 0x0000ff
     *    - 120 -> 0xff0000
     *    - 240 -> 0x00ff00
     * 
     * @param hue 一个整数
     * @returns 一个色彩代码
     */
    hue(hue: number, saturation = 1, brightness = 1) {
        let r = 1, g = 1, b = 1;
        if (saturation) {
            const h = (hue % 360) / 60;
            const i = h | 0;
            const f = h - i;
            const p = 1 - saturation;
            const q = 1 - saturation * f;
            const t = 1 - saturation * (1 - f);
            switch (i) {
                case 0: r = 1; g = t; b = p; break;
                case 1: r = q; g = 1; b = p; break;
                case 2: r = p; g = 1; b = t; break;
                case 3: r = p; g = q; b = 1; break;
                case 4: r = t; g = p; b = 1; break;
                case 5: r = 1; g = p; b = q; break;
            }
        }
        r *= 255 * brightness;
        g *= 255 * brightness;
        b *= 255 * brightness;
        return r << 16 | g << 8 | b;
    }

    /**
     * 将RGB值映射到色彩值上
     * 
     * @param r 一个整数 RED
     * @param g 一个整数 GREEN
     * @param b 一个整数 BLUE
     * @returns 一个色彩代码
     */
    rgb(r: number, g: number, b: number) {
        return r << 16 | g << 8 | b;
    }

    /**
     * 格式化播放时间
     * 
     * @param time 以秒为单位的播放时间
     * @returns 格式化后的播放时间
     */
    formatTimes(time: number) {
        return Math.floor(time / 60) + ":" + (time % 60 > 9 ? "" : "0") + time % 60;
    }

    /**
     * 延迟执行函数
     * **注意：**此函数不会因播放器暂停而终止执行
     * 
     * @param f 要延迟执行的函数
     * @param time 以毫秒为单位的延迟时间
     */
    delay = (f: Function, time = 1000) => {
        const timer = setTimeout(f, time);
        return {
            stop: () => {
                clearInterval(timer);
            }
        }
    }

    /**
     * 定时执行函数
     * 
     * @param f 要定时执行的函数
     * @param time 以毫秒为单位的定时时间
     * @param times 以次为单位的执行次数 0为无限次
     */
    interval = (f: Function, time = 1000, times = 1) => {
        let timer: number;
        if (times) {
            timer = setInterval(() => {
                times--;
                times || clearInterval(timer);
                f();
            }, time);
            Utils.timers.push(timer);
        } else {
            Utils.timers.push(timer = setInterval(f, time));
        }
        return {
            /** @link [哔哩哔哩2012拜年祭](https://www.bilibili.com/video/av203614?p=4) */
            stop: () => {
                clearInterval(timer);
            }
        }
    }

    /**
     * 计算座标距离
     * 
     * @param x1 计算起始座标X轴
     * @param y1 计算起始座标Y轴
     * @param x2 计算结束座标X轴
     * @param y2 计算结束座标Y轴
     * @returns 以像素为单位的座标距离
     */
    distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    }

    /**
     * 返回一个伪随机数 n，其中 min <= n < max。
     * 因为该计算不可避免地包含某些非随机的成分，所以返回的数字以保密方式计算且为“伪随机数”。
     * 
     * @param min 伪随机数最小值
     * @param max 伪随机数最大值
     * @returns 伪随机数 n，其中 min <= n < max
     */
    rand(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min));
    }
}