import { Rectangle } from "../geom/Rectangle";
import { IDisplay } from "./Display";
import { DisplayObject } from "./DisplayObject";
import { Graphics } from "./Graphics";

export class Sprite extends DisplayObject<HTMLDivElement> {

    #buttonMode = false;

    /**
     * 指定此 sprite 的按钮模式。
     * 如果为 true，此 sprite 的行为方式就像按钮，这表示它可在指针经过 sprite 时触发显示手形光标，并可在 sprite 具有焦点时按下 Enter 键或空格键来接收 click 事件。
     * 通过将 useHandCursor 属性设置为 false 可以禁止显示手形光标，在此情况下将显示指针。  
     * 虽然使用 SimpleButton 类创建按钮是一种比较好的方法，但是可以使用 buttonMode 属性为 Sprite 提供某种类似按钮的功能。
     * 要在 Tab 键顺序中包括 Sprite，请将 tabEnabled 属性（继承自 InteractiveObject 类，默认情况下为 false）设置为 true。
     * 此外，考虑是否希望 sprite 的子级支持用户输入。
     * 大多数按钮不启用其子对象的用户输入交互性，因为这样会混淆事件流。
     * 要对所有子对象禁用用户输入交互性，则必须将 mouseChildren 属性（继承自 DisplayObjectContainer 类）设置为 false。  
     * 如果将 buttonMode 属性与 MovieClip 类（该类是 Sprite 类的子类）一起使用，则按钮可能会具有一些增加的功能。
     * 如果包括具有 _up、_over 和 _down 标签的帧，则 Flash Player 将提供自动状态更改功能（类似于 ActionScript 的以前版本中为用作按钮的影片剪辑提供的功能）。
     * 没有时间轴的 Sprite 不可以使用这些自动状态更改，因此没有要加标签的帧。
     */
    get buttonMode() {
        return this.#buttonMode;
    }

    set buttonMode(value) {
        this.#buttonMode = value;
        this.$host.style.cursor = value && this.#useHandCursor ? 'pointer' : '';
    }

    /** 指定拖动 sprite 时经过的显示对象，或放置 sprite 的显示对象。 */
    get dropTarget() {
        return this;
    }

    #graphics = new Graphics();

    /** 指定属于此 sprite 的 Graphics 对象，在此 sprite 中可执行矢量绘图命令。 */
    get graphics() {
        return this.#graphics;
    }

    #hitArea = this;

    /**
     * 指定一个 sprite 用作另一个 sprite 的点击区域。
     * 如果 hitArea 属性不存在或者其值为 null 或 undefined，则 Sprite 本身将用作点击区域。
     * hitArea 属性的值可以是对 Sprite 对象的引用。  
     * 可以随时更改 hitArea 属性；修改后的 Sprite 会立即使用新的点击区域行为。
     * 指定为点击区域的 Sprite 不必是可见的；虽然不可见，但其图形形状仍会作为点击区域被检测。  
     * **注意：**必须将指定为点击区域的 Sprite 的 mouseEnabled 属性设置为 false。
     * 否则，sprite 按钮可能会不起作用，因为被指定为点击区域的 sprite 会接收用户输入事件而不是您的 sprite 按钮。
     */
    get hitArea() {
        return this.#hitArea;
    }

    set hitArea(value) {
        this.#hitArea = value;
    }

    /**
     * 控制此 sprite 中的声音。  
     * **注意：**此属性不影响 HTMLControl 对象（位于 Adobe AIR 中）中的 HTML 内容。
     * @deprecated 暂未实现
     */
    soundTransform: unknown;

    #useHandCursor = true;

    /**
     * 布尔值，表示当指针滑过 buttonMode 属性设置为 true 的 sprite 时是否显示指针手形（手形光标）。
     * useHandCursor 属性的默认值是 true。
     * 如果 useHandCursor 设置为 true，则当指针滑过按钮 sprite 时将显示用于按钮的指针手形。
     * 如果 useHandCursor 为 false，则将改用箭头指针。  
     * 可以随时更改 useHandCursor 属性；修改后的 Sprite 会立即具有新的光标外观。  
     * **注意：**在 Flex 或 Flash Builder 中，如果您的 Sprite 拥有子 Sprite，您可能要将 mouseChildren 属性设置为 false。     */
    get useHandCursor() {
        return this.#useHandCursor;
    }

    set useHandCursor(value) {
        this.#useHandCursor = value;
        this.buttonMode = this.#buttonMode;
    }

    constructor(param: IDisplay) {
        super(param);
        this.$host.style.cssText = `position: absolute; inline-size: 100cqi; block-size: 100cqb; overflow: visible; transform-origin: 0 0 0`;
    }

    /**
     * 允许用户拖动指定的 Sprite。
     * Sprite 将一直保持可拖动，直到通过调用 Sprite.stopDrag() 方法来明确停止，或直到将另一个 Sprite 变为可拖动为止。
     * 在同一时间只有一个 Sprite 是可拖动的。  
     * 三维显示对象跟随指针，Sprite.startDrag() 将在由显示对象定义的三维平面中移动对象
     * 或者，如果显示对象为二维对象和三维对象的子对象，则二维对象将在由三维父对象定义的三维平面中移动。
     * 
     * @param lockCenter 指定将可拖动的 sprite 锁定到指针位置中心 (true)，还是锁定到用户第一次单击该 sprite 的位置 (false)。
     * @param bounds 相对于 Sprite 父级的坐标的值，用于指定 Sprite 约束矩形。
     * @deprecated 暂未实现
     */
    startDrag(lockCenter = false, bounds?: Rectangle) { }

    /**
     * 使用户可以在启用触摸的设备上拖动指定的 Sprite。
     * Sprite 将一直保持可拖动，直到通过调用 Sprite.stopTouchDrag() 方法来明确停止，或直到将另一个 Sprite 变为可拖动为止。
     * 在同一时间只有一个 Sprite 是可拖动的。  
     * 三维显示对象跟随指针，Sprite.startTouchDrag() 在由显示对象定义的三维平面中移动对象。
     * 或者，如果显示对象为二维对象和三维对象的子对象，则二维对象将在由三维父对象定义的三维平面中移动。
     * 
     * @param touchPointID 分配给触摸点的整数。
     * @param lockCenter 指定将可拖动的 sprite 锁定到指针位置中心 (true)，还是锁定到用户第一次单击该 sprite 的位置 (false)。
     * @param bounds 相对于 Sprite 父级的坐标的值，用于指定 Sprite 约束矩形。
     * @deprecated 暂未实现
     */
    startTouchDrag(touchPointID: number, lockCenter = false, bounds?: Rectangle) { }

    /**
     * 结束 startDrag() 方法。
     * 通过 startDrag() 方法变为可拖动的 Sprite 将一直保持可拖动状态，直到添加 stopDrag() 方法或另一个 Sprite 变为可拖动状态为止。
     * 在同一时间只有一个 Sprite 是可拖动的。
     * @deprecated 暂未实现
     */
    stopDrag() { }

    /**
     * 结束 startTouchDrag() 方法，用于启用触摸的设备。
     * 通过 startTouchDrag() 方法变为可拖动的 Sprite 将一直保持可拖动状态，直到添加 stopTouchDrag() 方法或另一个 Sprite 变为可拖动为止。
     * 在同一时间只有一个 Sprite 是可拖动的。
     * 
     * @param touchPointID 分配给 startTouchDrag 方法中的触摸点的整数。
     * @deprecated 暂未实现
     */
    stopTouchDrag(touchPointID: number) { }
}