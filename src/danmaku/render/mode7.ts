import { Danmaku, IDanmaku } from "..";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { Format } from "../../utils/fomat";

/** 高级弹幕 */
@customElement('div')
export class Mode7 extends HTMLDivElement {

    /** 初始透明度 */
    protected $sOpacity = 1;

    /** 最终透明度 */
    protected $eOpacity = 1;

    /** 初始横坐标 */
    protected $startX = 0;

    /** 初始纵坐标 */
    protected $startY = 0;

    /** 生存时间 */
    protected $duration = 4500;

    /** 显示文本 */
    protected $text = '';

    /** z轴旋转角 */
    protected $zRotate = 0;

    /** y轴旋转角 */
    protected $yRotate = 0;

    /** 最终横坐标 */
    protected $endX = 0;

    /** 最终纵坐标 */
    protected $endY = 0;

    /** 运动时间 */
    protected $aTime = 0;

    /** 初始位置暂停时间 */
    protected $aDelay = 0;

    /** 描边 */
    protected $stroked = 1;

    /** 字体 */
    protected $family = '黑体';

    /** 线性加速 */
    protected $linearSpeedUp = 0;

    /**
     * 路径追踪
     * 参考svg path算法
     * 
     * @example
     * 'M107,82L108,83L109,84L111,88'
     */
    protected $path = '';

    /** 已解析路径 */
    protected $paths: [number, number][] = [];

    protected $root = this.attachShadow({ mode: 'closed' });

    protected $div = this.$root.appendChild(document.createElement('div'));

    protected $style = this.$root.appendChild(document.createElement('style'));

    protected $pre = Element.add('pre', undefined, this.$div);

    constructor(
        /** 弹幕管理组件 */
        protected $container: Danmaku,
        /** 弹幕数据 */
        public $dm: IDanmaku,
    ) {
        super();

        this.$decode();
        this.$initStyle();
    }

    private $decode() {
        try {
            typeof this.$dm.content === 'string' && (this.$dm.content = JSON.parse(this.$dm.content));
            const [
                startX,
                startY,
                opacity,
                duration,
                text,
                zRotate,
                yRotate,
                endX,
                endY,
                aTime,
                aDelay,
                stroked,
                family,
                linearSpeedUp,
                path,
            ] = <any>this.$dm.content;
            startX && (this.$startX = +startX);
            startY && (this.$startY = +startY);
            opacity.split('-').forEach((d: number, i: number) => {
                if (i) {
                    d >= 0 && (this.$eOpacity = +d);
                } else {
                    d >= 0 && (this.$sOpacity = +d);
                }
            });
            duration >= 0 && (this.$duration = duration * 1000);
            text && (this.$text = text.replace(/(\/n|\\n|\n|\r\n)/g, '\n'));
            zRotate && (this.$zRotate = +zRotate);
            yRotate && (this.$yRotate = +yRotate);
            this.$endX = endX ?? this.$startX;
            this.$endY = endY ?? this.$startY;
            aTime && (this.$aTime = +aTime);
            aDelay && (this.$aDelay = +aDelay);
            stroked && stroked !== 'false' && (this.$stroked = 1);
            family && (this.$family = family);
            linearSpeedUp && linearSpeedUp !== '0' && (this.$linearSpeedUp = 1);
            if (path) {
                this.$path = path;
                this.$paths = <any>this.$path.slice(1).split('L').map(d => d.split(','));
            }
        } catch { }
    }

    private $initStyle() {
        this.classList.add('mode7');
        this.$div.style.cssText = `display: inline-block; position: absolute; inset-block-start: 0px; inset-inline-start: 0px; inline-size: 100%; block-size: 100%; perspective: calc(100cqi / 2 / tan((${Math.PI} / 180) * (55 / 2))); opacity: 1;`;
        // 一般样式
        this.$pre.style.display = 'inline-block';
        this.$pre.style.lineHeight = '1';
        this.$pre.style.transformOrigin = '0% 0% 0px';
        this.$pre.style.setProperty('content-visibility', 'auto');
        this.$pre.style.fontFamily = 'bold';
        this.$pre.style.margin = '0';
        // 字体大小
        this.$pre.style.fontSize = `${this.$dm.fontsize}px`;
        // 字体颜色
        this.$pre.style.color = Format.hexColor(this.$dm.color || 0);
        // 描边
        const shadowColor = this.$dm.color !== 0 ? '#000' : '#fff';
        this.$stroked && (this.$pre.style.textShadow = `1px 0 1px ${shadowColor},0 1px 1px ${shadowColor},0 -1px 1px ${shadowColor},-1px 0 1px ${shadowColor}`);
        // 字体
        this.$family && (this.$pre.style.fontFamily = `${this.$family}, Arial, Helvetica, sans-serif`);
        // 文本
        this.$pre.innerText = this.$text;
    }

    private initPath() {
        const pre = `matrix3d(calc(cos(${this.$yRotate}deg) * cos(${this.$zRotate}deg)),calc(cos(${this.$yRotate}deg) * sin(${this.$zRotate}deg)),calc(sin(${this.$yRotate}deg)),0,calc(0 - sin(${this.$zRotate}deg)),calc(cos(${this.$zRotate}deg)),0,0,calc(0 - sin(${this.$yRotate}deg) * cos(${this.$zRotate}deg)),calc(0 - sin(${this.$yRotate}deg) * sin(${this.$zRotate}deg)),calc(cos(${this.$yRotate}deg)),0,`;
        if (!this.$aTime) {
            return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
    }
    to {
        opacity: ${this.$eOpacity};
    }
}`;
        } else if (this.$paths.length) {
            // 使用路径跟随
            if (this.$paths.length === 1) {
                // 路径点只有一个，那就等于没动
                return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
    }
    to {
        opacity: ${this.$eOpacity};
    }
}`;
            } else {
                if (this.$aDelay) {
                    // 有运动延时
                    const aD = Math.min(this.$aDelay, this.$duration);
                    if (aD < this.$duration) {
                        // 运动延时小于存活时间
                        const aT = Math.min(aD + this.$aTime, this.$duration);
                        if (aT < this.$duration) {
                            // 运动时间小于存活时间
                            const s0 = aD / this.$duration;
                            const dd = (this.$aTime / (this.$paths.length - 1)) / this.$duration;
                            const arr = [`from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(this.$paths.at(0)![0]) || 0},${this.getPx(this.$paths.at(0)![1], true) || 0},0,1);
}`];
                            for (let i = 0; i < this.$paths.length; i++) {
                                const [x, y] = this.$paths[i];
                                arr.push(`${(s0 + dd * i) * 100}% {
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                            }
                            arr.push(`to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(this.$paths.at(-1)![0]) || 0},${this.getPx(this.$paths.at(-1)![1], true) || 0},0,1);
}`);
                            return `@keyframes dmMode7 {
${arr.join('\n\t')}
}`;
                        } else {
                            // 运动时间不小于存活时间
                            const s0 = aD / this.$duration;
                            const dd = (this.$aTime / (this.$paths.length - 1)) / this.$duration;
                            const arr = [`from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(this.$paths.at(0)![0]) || 0},${this.getPx(this.$paths.at(0)![1], true) || 0},0,1);
}`];
                            for (let i = 0; i < this.$paths.length; i++) {
                                const [x, y] = this.$paths[i];
                                switch (i) {
                                    case this.$paths.length - 1: {
                                        arr.push(`to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                                        break;
                                    }
                                    default: {
                                        arr.push(`${(s0 + dd * i) * 100}% {
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                                        break;
                                    }
                                }
                            }
                            return `@keyframes dmMode7 {
${arr.join('\n\t')}
}`;
                        }
                    } else {
                        // 运动延时不小于存活时间
                        return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
    }
    to {
        opacity: ${this.$eOpacity};
    }
}`;
                    }
                } else {
                    // 无运动延时
                    const aT = Math.min(this.$aTime, this.$duration);
                    if (aT < this.$duration) {
                        // 运动时间小于存活时间
                        const dd = (this.$aTime / (this.$paths.length - 1)) / this.$duration;
                        const arr: string[] = [];
                        for (let i = 0; i < this.$paths.length; i++) {
                            const [x, y] = this.$paths[i];
                            switch (i) {
                                case 0: {
                                    arr.push(`from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                                    break;
                                }
                                default: {
                                    arr.push(`${dd * i * 100}% {
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                                    break;
                                }
                            }
                        }
                        arr.push(`to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(this.$paths.at(-1)![0]) || 0},${this.getPx(this.$paths.at(-1)![1], true) || 0},0,1);
}`);
                        return `@keyframes dmMode7 {
${arr.join('\n\t')}
}`;
                    } else {
                        // 运动时间不小于存活时间
                        const dd = (this.$duration / (this.$paths.length - 1)) / this.$duration;
                        const arr: string[] = [];
                        for (let i = 0; i < this.$paths.length; i++) {
                            const [x, y] = this.$paths[i];
                            switch (i) {
                                case 0: {
                                    arr.push(`from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                                    break;
                                }
                                case this.$paths.length - 1: {
                                    arr.push(`to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                                    break;
                                }
                                default: {
                                    arr.push(`${dd * i * 100}% {
        transform: ${pre}${this.getPx(x) || 0},${this.getPx(y, true) || 0},0,1);
}`);
                                    break
                                }
                            }
                        }
                        return `@keyframes dmMode7 {
${arr.join('\n\t')}
}`;
                    }
                }
            }
        } else {
            // 使用起始路径
            if (this.$aDelay) {
                // 有运动延时
                const aD = Math.min(this.$aDelay, this.$duration);
                if (aD < this.$duration) {
                    // 运动延时小于存活时间
                    const aT = Math.min(aD + this.$aTime, this.$duration);
                    if (aT < this.$duration) {
                        // 运动时间小于存活时间
                        const s0 = aD / this.$duration;
                        const se = aT / this.$duration;
                        return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
    ${s0 * 100}% {
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
    ${se * 100}% {
        transform: ${pre}${this.getPx(this.$endX) || 0},${this.getPx(this.$endY, true) || 0},0,1);
    }
    to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(this.$endX) || 0},${this.getPx(this.$endY, true) || 0},0,1);
    }
}`;
                    } else {
                        // 运动时间不小于存活时间
                        const s0 = aD / this.$duration;
                        return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
    ${s0 * 100}% {
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
    to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
}`;
                    }
                } else {
                    // 运动延时不小于存活时间
                    return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
    to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(this.$endX) || 0},${this.getPx(this.$endY, true) || 0},0,1);
    }
}`;
                }
            } else {
                // 无运动延时
                const aT = Math.min(this.$aTime, this.$duration);
                if (aT < this.$duration) {
                    // 运动时间小于存活时间
                    const se = aT / this.$duration;
                    return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
    ${se * 100}% {
        transform: ${pre}${this.getPx(this.$endX) || 0},${this.getPx(this.$endY, true) || 0},0,1);
    }
    to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(this.$endX) || 0},${this.getPx(this.$endY, true) || 0},0,1);
    }
}`;
                } else {
                    // 运动时间不小于存活时间
                    return `@keyframes dmMode7 {
    from {
        opacity: ${this.$sOpacity};
        transform: ${pre}${this.getPx(this.$startX) || 0},${this.getPx(this.$startY, true) || 0},0,1);
    }
    to {
        opacity: ${this.$eOpacity};
        transform: ${pre}${this.getPx(this.$endX) || 0},${this.getPx(this.$endY, true) || 0},0,1);
    }
}`;
                }
            }
        }
    }

    /**
     * 获取实际坐标值
     * 原始值可能是一个百分比
     * 
     * @param v 原始值
     * @param x 改为基于纵坐标，默认基于横坐标
     */
    private getPx(v: number, x = true) {
        if (v > 0 && v < 1) {
            return x ? this.$container.$height * v : this.$container.$width * v;
        }
        return v;
    }

    /** 运动结束处理 */
    private $animationend = (ev: AnimationEvent) => {
        this.remove();
        this.style.animation = '';
    }

    async execute(delay = 0) {
        this.$style.textContent = this.initPath();
        this.$pre.addEventListener('animationend', this.$animationend, { once: true });
        this.$pre.style.animation = `${this.$duration}ms ${this.$linearSpeedUp ? 'ease-in' : 'linear'} ${delay}ms both dmMode7`;
        this.$pre.style.setProperty('animation-play-state', 'var(--animation-play-state)');
        this.$container.appendChild(this);
    }
}