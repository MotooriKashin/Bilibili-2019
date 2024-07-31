import { Danmaku } from "../../..";
import { Bitmap } from "../Display/Bitmap";
import { Display } from "../Display/Display";
import { DisplayObject } from "../Display/DisplayObject";
import { Player } from "../Player/Player";
import { Tween } from "../Tween/Tween";
import { TweenEasing } from "../Tween/TweenEasing";
import { Global } from "../Utils/Global";
import { ScriptManager } from "../Utils/ScriptManager";
import { Utils } from "../Utils/Utils";

export class Script {

    private static Display: Display;
    private static Global: Global;
    private static Player: Player;
    private static ScriptManager: ScriptManager;
    private static Utils: Utils;

    $: Display;

    $G: Global;

    Display: Display;

    Global: Global;

    Player: Player;

    ScriptManager: ScriptManager;

    Utils: Utils;

    constructor(danmaku: Danmaku) {
        this.Player = Script.Player || (Script.Player = new Player(danmaku));
        this.Utils = Script.Utils || (Script.Utils = new Utils());
        this.$ = this.Display = Script.Display || (Script.Display = new Display(danmaku));
        this.$G = this.Global = Script.Global || (Script.Global = new Global());
        this.ScriptManager = Script.ScriptManager || (Script.ScriptManager = new ScriptManager(danmaku));

        Reflect.set(this, 'interval', this.Utils.interval);
        Reflect.set(this, 'timer', this.Utils.delay);

        Object.entries(TweenEasing).forEach(d => {
            if (Object.hasOwn(TweenEasing, d[0])) {
                Reflect.set(this, ...d);
            }
        });
    }

    Bitmap = Bitmap;

    Circ = TweenEasing.Circular;

    Expo = TweenEasing.Exponential

    Math = Math;

    Quad = TweenEasing.Quadratic;

    Quart = TweenEasing.Quartic;

    Quint = TweenEasing.Quintic;

    SIne = TweenEasing.SIne;

    String = String;

    Tween = Tween;

    TweenEasing = TweenEasing;

    /** 清空日志内容 */
    clear = () => {
        console.clear();
    }

    /**
     * 复制指定Object
     * **注意：**此功能无法复制函数
     * 
     * @param object 被复制的Object
     */
    clone = (object: object) => {
        return Object.assign(object);
    }

    /**
     * 遍历指定Object
     * 
     * @param loop 被遍历的Object
     * @param f 遍历回调函数
     */
    foreach = (loop: object, f: (key: String, value: any) => void) => {
        if (null === loop || "object" !== typeof loop) {
            return;
        }
        // DisplayObjects 不可例举
        if (loop instanceof DisplayObject) {
            return;
        }
        Object.entries(loop).forEach(d => {
            if (Object.hasOwn(loop, d[0])) {
                f(...d);
            }
        })
    }

    /** 播放时间（毫秒） */
    getTimer = () => {
        return this.Player.time;
    }

    /**
     * 加载外部库
     * 
     * @param library 库名称
     * @param onComplete 加载完成时执行的回调函数
     */
    load = (library: String, onComplete: Function) => {
        typeof onComplete === 'function' && setTimeout(onComplete);
    }

    parseFloat = parseFloat;

    parseInt = parseInt;

    /**
     * 添加指定内容至日志中
     * 
     * @param s 要添加的内容
     */
    tracex = (s: string) => {
        console.log(s);
    }

    trace = this.tracex;

    /** @deprecated */
    stopExecution = () => { }
}