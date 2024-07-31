import { DisplayObject } from "../Display/DisplayObject";

/** 动画实例 */
export class Animate implements ITween {

    stopOnComplete = true;

    /** 动画效果实例 */
    $animation?: Animation;

    /** 当前时间 */
    $currentTime = 0;

    /**
     * 初始化动画
     * 
     * @param $object 要移动的物件
     * @param $keyframes 动画帧数据
     * @param $keyframeAnimationOptions 帧设定数据
     */
    constructor(
        public $object: DisplayObject<HTMLElement>,
        public $keyframes: Keyframe[],
        public $keyframeAnimationOptions: KeyframeAnimationOptions,
    ) { }

    clone() {
        return new Animate(this.$object, Array.from(this.$keyframes), { ...this.$keyframeAnimationOptions });
    }

    slice(from: number, to: number) {
        if (this.$animation) {
            this.$animation.cancel();
            delete this.$animation;
        }
        from *= 1000, to *= 1000;
        const len = to - from;
        if (this.$keyframeAnimationOptions.delay! <= from) {
            from -= (this.$keyframeAnimationOptions.delay || 0);
        } else {
            this.$keyframeAnimationOptions.delay! -= from;
        }
        (<any>this).$keyframeAnimationOptions.rangeStart = from / (<number>this.$keyframeAnimationOptions.duration || 1000);
        (<any>this).$keyframeAnimationOptions.rangeEnd = len / (<number>this.$keyframeAnimationOptions.duration || 1000);
    }

    repeat(times: number) {
        if (this.$animation) {
            this.$animation.cancel();
            delete this.$animation;
        }
        this.$keyframeAnimationOptions.iterations = times;
    }

    reverse() {
        if (this.$animation) {
            this.$animation.cancel();
            delete this.$animation;
        }
        this.$keyframeAnimationOptions.direction = this.$keyframeAnimationOptions.direction === 'reverse' ? 'normal' : 'reverse';
    }

    delay(delay: number) {
        if (this.$animation) {
            this.$animation.cancel();
            delete this.$animation;
        }
        this.$keyframeAnimationOptions.delay = + delay * 1000;
    }

    scale(scale = 1) {
        if (this.$animation) {
            this.$animation.cancel();
            delete this.$animation;
        }
        this.$keyframeAnimationOptions.duration = (<number>this.$keyframeAnimationOptions.duration || 1) * scale;
        if (this.$keyframeAnimationOptions.delay) {
            this.$keyframeAnimationOptions.delay *= scale;
        }
    }

    play() {
        if (this.$animation) {
            this.$animation.currentTime = this.$currentTime;
            this.$animation.play();
        } else {
            this.$animation = this.$object.$host.animate(this.$keyframes, this.$keyframeAnimationOptions);
            this.$animation.currentTime = this.$currentTime;
            this.$animation.addEventListener('finish', () => {
                this.finished();
            });
        }

    }

    gotoAndPlay(time: number) {
        this.$currentTime = time * 1000;
        this.play();
    }

    stop() {
        this.$animation?.finish();
    }

    gotoAndStop(time: number) {
        this.$currentTime = time * 1000;
        this.$animation?.pause();
    }

    togglePause() {
        if (this.$animation) {
            this.$animation.playState === 'running' ? this.$animation.pause() : this.$animation.play();
        } else {
            this.play();
        }
    }

    finished = () => { }
}

/** 并行容器 */
export class Parallel implements ITween {

    stopOnComplete = true;

    constructor(public srcs: ITween[]) { }

    play() {
        let i = this.srcs.length;
        this.srcs.forEach(d => {
            d.finished = () => {
                i--;
                i || this.finished();
            }
            d.play();
        });
    }

    gotoAndPlay(time: number) {
        this.srcs.forEach(d => { d.gotoAndPlay(time) });
    }

    stop() {
        this.srcs.forEach(d => { d.stop() });
    }

    gotoAndStop(time: number) {
        this.srcs.forEach(d => { d.gotoAndStop(time) });
    }

    togglePause() {
        this.srcs.forEach(d => { d.togglePause() });
    }

    scale(scale = 1) {
        this.srcs.forEach(d => { d.scale(scale) });
    }

    delay(delay: number) {
        this.srcs.forEach(d => { d.delay(delay) });
    }

    reverse() {
        this.srcs.forEach(d => { d.reverse() });
    }

    repeat(times: number) {
        this.srcs.forEach(d => { d.repeat(times) });
    }

    slice(from: number, to: number) {
        this.srcs.forEach(d => { d.slice(from, to) });
    }

    clone() {
        return new Parallel(this.srcs.map(d => d.clone()));
    }

    finished = () => { }
}

/** 串行容器 */
export class Serial implements ITween {

    stopOnComplete = true;

    /** 延迟秒数 */
    $delay = 0;

    /** 循环次数 */
    $times = 1;

    constructor(public srcs: ITween[]) {
        this.init();
    }

    protected init() {
        if (this.srcs.length) {
            for (let i = 0, j = 1, len = this.srcs.length; i < len; i++, j++) {
                if (this.srcs[i] && this.srcs[j]) {
                    this.srcs[i].finished = () => {
                        this.srcs[j].play();
                    }
                }
            }
            this.srcs.at(-1)!.finished = this.finished;
        }
    }

    protected _play() {
        this.srcs[0]?.play();
    }

    play() {
        if (this.$times > 1) {
            if (this.srcs.length) {
                let i = this.$times;
                this.srcs.at(-1)!.finished = () => {
                    i--;
                    if (i >= 1) {
                        this._play();
                    }
                }
            }
        }
        if (this.$delay) {
            setTimeout(() => { this._play() }, this.$delay * 1000);
        } else {
            this._play();
        }
    }

    /** @deprecated */
    gotoAndPlay(time: number) {
        throw new Error("Method not implemented.");
    }

    stop() {
        this.srcs.forEach(d => { d.stop() });
        if (this.$times && this.srcs.length) {
            this.srcs.at(-1)!.finished = this.finished;
        }
    }

    /** @deprecated */
    gotoAndStop(time: number) {
        throw new Error("Method not implemented.");
    }

    /** @deprecated */
    togglePause() {
        throw new Error("Method not implemented.");
    }

    scale(scale = 1) {
        this.$delay *= scale;
    }

    delay(delay: number) {
        this.$delay = delay;
    }

    reverse() {
        this.srcs.reverse();
        this.srcs.forEach(d => { d.reverse() });
        this.init();
    }

    repeat(times: number) {
        this.$times = times;
    }

    /** @deprecated */
    slice(from: number, to: number) {
        throw new Error("Method not implemented.");
    }

    clone() {
        return new Serial(this.srcs.map(d => d.clone()));
    }

    finished = () => { }
}

export interface ITween {

    /** 设置是否重复播放效果 (true则不重复播放) */
    stopOnComplete: Boolean;

    /** 开始播放效果 */
    play(): void;

    /**
     * 跳跃至指定时间并开始播放效果
     * 
     * @param time 以秒为单位的时间
     */
    gotoAndPlay(time: number): void;

    /** 终止播放效果 */
    stop(): void;

    /**
     * 跳跃至指定时间并停止播放效果
     * 
     * @param time 以秒为单位的时间
     */
    gotoAndStop(time: number): void;

    /** 切换播放/暂停 */
    togglePause(): void;

    /**
     * 按时间拉伸
     * 
     * @param scale 时间轴缩放比例
     */
    scale(scale?: number): void;

    /**
     * 延迟执行
     * 
     * @param delay 以秒为单位的延迟时间
     */
    delay(delay: number): void;

    /** 反向 */
    reverse(): void;

    /**
     * 重复
     * 
     * @param times 效果执行次数
     */
    repeat(times: number): void;

    /**
     * 取出指定效果时间
     * 
     * @param from 起始时间(秒)
     * @param to 结束时间(秒)
     */
    slice(from: number, to: number): void;

    /** 克隆效果副本 */
    clone(): ITween;

    /** 动画结束后的回调 */
    finished(): void;
}