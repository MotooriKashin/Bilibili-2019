import { Danmaku } from "../../..";
import { DisplayObject } from "../Display/DisplayObject";
import { Player } from "../Player/Player";
import { Utils } from "./Utils";

/** 脚本资源管理器 */
export class ScriptManager {

    constructor(private danmaku: Danmaku) { }

    /** 终止正在运行的所有定时器 */
    clearTimer() {
        Utils.timers.forEach(d => { clearInterval(d) });
        Utils.timers.length = 0;
    }

    /** 清除所有由高级弹幕创建的元件 */
    clearEl() {
        this.danmaku.querySelectorAll('.as3-danmaku-item').forEach(d => d.remove());
    }

    /** 清除所有由高级弹幕创建的触发器 */
    clearTrigger() {
        Player.triggers.forEach(d => { d() });
        Player.triggers.length = 0;
    }

    pushEl(el: DisplayObject<HTMLElement>) {
        el.visible = true;
    }

    popEl(el: DisplayObject<HTMLElement>) {
        el.visible = false;
    }

    pushTimer() { }

    popTimer() { }
}