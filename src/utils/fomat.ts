import { AV } from "./av";

/** 格式化工具 */
export namespace Format {

    /** 颜色数字转16进制*/
    export function hexColor(colorValue = 0) {
        const hex = '00000000' + colorValue.toString(16);
        const rgb = hex.slice(-6);
        const alpha = hex.slice(-8, -6);
        return Number('0x' + alpha) ? '#' + rgb + alpha : '#' + rgb;
    }

    /** HTML 转义 */
    export function htmlEncode(str: string) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2f;')
            .replace(/\n/g, '<br>');
    }

    /** 颜色数值 -> rgba */
    export function rgba(color: number, opacity: number) {
        const rgb = ('00000' + color.toString(16)).slice(-6);
        return `rgba(${parseInt(rgb.slice(0, 2), 16)},${parseInt(rgb.slice(2, 4), 16)},${parseInt(
            rgb.slice(4, 6),
            16,
        )},${opacity})`;
    }

    /** 秒数 -> 00:00 */
    export function fmSeconds(sec: number) {
        if (sec == null) {
            sec = 0;
        }
        let ret: string;
        sec = Math.floor(sec) >> 0;
        ret = ('0' + (sec % 60)).slice(-2);
        ret = Math.floor(sec / 60) + ':' + ret;
        if (ret.length < 5) {
            ret = '0' + ret;
        }
        return ret;
    }

    /** 00:00 -> 秒数 */
    export function fmSecondsReverse(format: string) {
        if (format == null) {
            return 0;
        }
        const secArr = format.toString().split(':').reverse();
        if (!secArr.length) {
            return 0;
        } else {
            return (
                (parseInt(secArr[0], 10) || 0) +
                (parseInt(secArr[1], 10) || 0) * 60 +
                (parseInt(secArr[2], 10) || 0) * 3600
            );
        }
    }

    /**
     * 取三个值的中间数
     * @param num 当前值
     * @param min 最小值（闭）
     * @param max 最大值（闭）
     * @returns 中间值
     */
    export function fmRange(num: number, min: number, max: number) {
        return Math.min(Math.max(num, min), max);
    }

    /**
     * 格式化字节
     * @param size 字节/B
     * @returns 字节大小
     * @example 
     * sizeFormat(0) // N/A
     * sizeFormat(1024) // 1.00K
     */
    export function fileSize(size: number = 0) {
        let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
        while (dex > 1) {
            if (size >= vor) {
                size = Number((size / dex).toFixed(2));
                break;
            }
            dex = dex / 1024;
            vor = vor / 1000;
            i--;
        }
        return size ? size + unit[i] : "N/A";
    }

    /**
     * 保留几位小数的number版（前提是小数为不全为零）
     * 
     * @param num 原始小数
     * @param fix 保留小数位数
     */
    export function toFixed(num: number, fix = 2) {
        return Math.floor(num * (10 ** fix)) / (10 ** fix)
    }

    /**
     * 格式化时间戳
     * 
     * @param seconds 秒数，支持小数点
     * @returns mm:ss.ttt | hh:mm:ss.ttt
     */
    export function mmssttt(seconds: number) {
        seconds > 0 || (seconds = 0);
        /** 秒数及毫秒部分 */
        const ssttt = toFixed(seconds % 60, 3);
        /** 秒数以上的部分 */
        const hhmm = Math.floor(seconds / 60);
        /** 分数 */
        const mm = hhmm % 60;
        /** 时数 */
        const hh = Math.floor(hhmm / 60);
        return `${hh ? hh > 9 ? `${hh}:` : `0${hh}:` : ''}${mm > 9 ? mm : `0${mm}`}:${ssttt < 10 ? `0${ssttt.toFixed(3)}` : ssttt.toFixed(3)}`;
    }

    /** 格式化比特率 */
    export function bps(num: number) {
        if (num < 1024) {
            return `${num} bps`;
        } else {
            num = Math.round(num / 1024);
            if (num < 1024) {
                return `${num} Kbps`;
            } else {
                num = Math.round(num / 1024);
                if (num < 1024) {
                    return `${num} Mbps`;
                } else {
                    num = Math.round(num / 1024);
                    return `${num} Gbps`;
                }
            }
        }
    }

    /** 格式化网速 */
    export function bit(num: number) {
        if (num < 1024) {
            return `${num} B`;
        } else {
            num = Math.round(num / 1024);
            if (num < 1024) {
                return `${num} KB`;
            } else {
                num = Math.round(num / 1024);
                if (num < 1024) {
                    return `${num} MB`;
                } else {
                    num = Math.round(num / 1024);
                    return `${num} GB`;
                }
            }
        }
    }

    /** 格式化进位 */
    export function carry(num: number) {
        if (num < 10000) {
            return toFixed(num, 1);
        } else {
            num = num / 10000;
            if (num < 10000) {
                return toFixed(num, 1) + '万';
            } else {
                num = num / 10000;
                return toFixed(num, 1) + '亿';
            }
        }
    }

    /**
     * 格式化整数
     * @param num 原始整数
     * @param byte 格式化位数
     * @returns 格式化结果
     * @example 
     * integerFormat(2, 3) // 结果：002
     * integerFormat(20, 1) // 结果：20（不变）
     */
    export function integer(num: number, byte: number = 2) {
        return num < 10 ** byte ? (Array(byte).join('0') + num).slice(-1 * byte) : num;
    }

    /**
     * 提取随机子数组
     * @param res 原始数组
     * @param num 子数组大小
     * @returns 子数组，长度为1时直接返回该值。
     * @example
     * subArray([1, 2, 3], 2) // [1, 2]（结果之一）
     * subArray([1, 2, 3]) // 1（结果之一）
     */
    export function subArray<T>(res: T[]): T;
    export function subArray<T>(res: T[], num: number): T[];
    export function subArray<T>(res: T[], num = 1): T[] | T {
        const arr = [...res];
        const out = [];
        num = num || 1;
        num = num < arr.length ? num : arr.length;
        while (out.length < num) {
            var temp = (Math.random() * arr.length) >> 0;
            out.push(arr.splice(temp, 1)[0]);
        }
        return num === 1 ? out[0] : out;
    }

    /**
     * 格式化时间
     * 
     * @param t 时间戳，不包含毫秒
     */
    export function eTime(t: number) {
        if (!+t) {
            return t;
        }

        const now = Math.floor(Date.now() / 1000);
        const td_start = new Date();
        td_start.setHours(0);
        td_start.setMinutes(0);
        td_start.setSeconds(0);
        const td = Math.floor(td_start.getTime() / 1000);

        if (t > td && now - t >= 0) {
            if (now - t <= 50) {
                const _t = Math.floor((now - t) % 60 / 10) * 10;

                return (t > 10 ? _t : 10) + "秒前";
            } else if (now - t < 3600) {
                return Math.floor((now - t) / 60) + "分钟前";
            } else {
                return Math.floor((now - t) / 3600) + "小时前";
            }
        } else {
            const n_d = new Date();
            n_d.setTime(t * 1000);
            let m = n_d.getMonth() + 1;
            let d = n_d.getDate();
            let H = n_d.getHours();
            let M = n_d.getMinutes();
            let S = n_d.getSeconds();
            if (m < 10) m = <any>"0" + m;
            if (d < 10) d = <any>"0" + d;
            if (H < 10) H = <any>"0" + H;
            if (M < 10) M = <any>"0" + M;
            if (S < 10) S = <any>"0" + S;
            return n_d.getFullYear() + "-" + m + "-" + d + " " + H + ":" + M + ":" + S;
        }
    }

    /**
     * 处理文本中的超链接
     * 
     * @param str 原始文本
     */
    export function superLink(str: string) {
        return AV.fromStr(str)
            .replace(/av([0-9]+)/gi, '<a target="_blank" href="//www.bilibili.com/video/av$1">av$1</a>')
            .replace(/cv([0-9]+)/gi, '<a target="_blank" href="//www.bilibili.com/read/cv$1">av$1</a>')
            .replace(/sm([0-9]+)/gi, '<a target="_blank" href="//www.nicovideo.jp/watch/sm$1">sm$1</a>')
    }
}