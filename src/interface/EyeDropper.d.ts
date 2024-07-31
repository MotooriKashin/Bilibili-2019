/** @see https://developer.mozilla.org/docs/Web/API/EyeDropper_API */
declare class EyeDropper {

    /** 启动拾色器模式，返回一个 Promise，在用户选择颜色而退出拾色器模式后兑现。 */
    open(options?: IEyeDropperOptions): Promise<IEyeDropperResult>
}

interface IEyeDropperOptions {
    /** 当调用 AbortSignal 的 abort() 方法时，拾色器模式将被中止。 */
    signal: AbortSignal;
}

interface IEyeDropperResult {
    /** 代表所选颜色的字符串，采用十六进制 sRGB 格式（#aabbcc）。 */
    sRGBHex: string;
}