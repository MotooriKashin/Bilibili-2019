import { ApplicationDomain } from "../System/ApplicationDomain";
import { ActionScriptVersion } from "./ActionScriptVersion";
import { DisplayObject } from "./DisplayObject";

/**
 * LoaderInfo 类可提供有关已加载的 SWF 文件或图像文件（JPEG、GIF 或 PNG）的信息。
 * LoaderInfo 对象可用于任何显示对象。
 * 提供的信息包括加载进度、加载程序的 URL 和加载内容、媒体的字节总数以及媒体的标示的高度和宽度。
 * 您可以通过以下两种方法访问 LoaderInfo 对象：
 *    - flash.display.Loader 对象的 contentLoaderInfo 属性 -- contentLoaderInfo 属性始终可用于任何 Loader 对象。对于尚未调用 load() 或 loadBytes() 方法，或者尚未充分加载的 Loader 对象，在尝试访问 contentLoaderInfo 属性的多个属性时，将引发错误。
 *    - 显示对象的 loaderInfo 属性。
 * 
 * Loader 对象的 contentLoaderInfo 属性提供有关 Loader 对象正在加载的内容的信息，而 DisplayObject 的 loaderInfo 属性提供有关该显示对象的根 SWF 文件的信息。
 * 当使用 Loader 对象加载显示对象（如 SWF 文件或位图）时，显示对象的 loaderInfo 属性与 Loader 对象 (DisplayObject.loaderInfo = Loader.contentLoaderInfo) 的 contentLoaderInfo 属性相同。
 * 由于 SWF 文件的主类的实例没有 Loader 对象，因此 loaderInfo 属性是访问 SWF 文件主类实例的 LoaderInfo 的唯一方法。  
 * **注意：**LoaderInfo 对象的所有属性都是只读的。
 * EventDispatcher.dispatchEvent() 方法不适用于 LoaderInfo 对象。
 * 如果在 LoaderInfo 对象上调用 dispatchEvent()，将引发 IllegalOperationError 异常。
 */
export class LoaderInfo {

    /**
     * 被加载的 SWF 文件的 ActionScript 版本。
     * 通过使用 ActionScriptVersion 类中的枚举（如 ActionScriptVersion.ACTIONSCRIPT2 和 ActionScriptVersion.ACTIONSCRIPT3）来指定语言版本。
     */
    readonly actionScriptVersion = ActionScriptVersion.ACTIONSCRIPT3;

    #applicationDomain = new ApplicationDomain();

    /**
     * 加载外部 SWF 文件后，包含在已加载类中的所有 ActionScript 3.0 定义将存储在 applicationDomain 属性中。  
     * SWF 文件中的所有代码被定义为存在于应用程序域中。
     * 主应用程序就在当前的应用程序域中运行。
     * 系统域包含所有应用程序域，包括当前域和由 Flash Player 或 Adobe AIR 使用的所有类。  
     * 所有应用程序域（系统域除外）都有关联的父域。
     * 主应用程序的 applicationDomain 的父域为系统域。
     * 已加载的类仅在其父级中没有相关定义时才进行定义。
     * 不能用较新的定义覆盖已加载的类定义。
     */
    get applicationDomain() {
        return this.#applicationDomain;
    }

    /** 与 LoaderInfo 对象相关联的字节数。 */
    get bytes() {
        return 0;
    }

    /**
     * 媒体已加载的字节数。
     * 如果此数字与 bytesTotal 的值相等，则会加载所有字节。
     */
    get bytesLoaded() {
        return 0;
    }

    /**
     * 整个媒体文件中压缩的字节数。  
     * 在此 LoaderInfo 对象相应的 Loader 对象调度第一个 progress 事件之前，bytesTotal 为 0。
     * 在该 Loader 对象调度第一个 progress 事件之后，bytesTotal 反映的是要下载的实际字节数。
     */
    get bytesTotal() {
        return 0;
    }

    /**
     * 表示内容（子级）对加载者（父级）的信任关系。
     * 如果子项允许父项访问，则为 true；否则为 false。
     * 如果子对象已调用 allowDomain() 方法向父域授予权限，或者在子域中加载了向父域授予权限的 URL 策略，则将此属性设置为 true。
     * 如果子级和父级在同一域中，则此属性设置为 true。
     */
    get childAllowsParent() {
        return false;
    }

    /**
     * 一个对象，它可以通过所加载内容的代码进行设置以公开可以由 Loader 对象的沙箱中的代码访问的属性和方法。
     * 此*沙箱桥*使来自非应用程序域的内容对应用程序沙箱中的脚本具有受控访问权限，反之亦然。
     * 沙箱桥充当沙箱之间的通道，在应用程序安全沙箱和非应用程序安全沙箱之间提供显式交互。
     */
    childSandboxBridge = {};

    /** 与此 LoaderInfo 对象关联的已加载对象。 */
    get content() {
        throw new ReferenceError('无权访问！');
    }

    /**
     * 被加载文件的 MIME 类型。
     * 如果所加载的文件内容不足以确定类型，则该值为 null。
     * 
     */
    get contentType() {
        return 'application/x-shockwave-flash';
    }

    /**
     * 被加载的 SWF 文件的标示的帧速率，以每秒帧数为单位。
     * 此数字通常是整数，但并不需要是整数。  
     * 此值可能与使用时的实际帧速率不同。
     * Flash Player 或 Adobe AIR 在任何时候为所有加载的 SWF 文件只使用单个帧速率，此帧速率由主 SWF 文件的标称帧速率确定。
     * 此外，根据硬件、声音同步和其他因素，可能无法达到主帧速率。
     */
    get frameRate() {
        return 60;
    }

    /**
     * 加载文件的标示的高度。
     * 此值可能与所显示内容的实际高度不同，因为被加载的内容或其父显示对象可能被缩放。
     */
    get height() {
        return 0;
    }

    /**
     * 表示 LoaderInfo.url 属性是否已截断。
     * 当 isURLInaccessible 值为 true 时，LoaderInfo.url 值只是从中加载内容的最终 URL 的域。
     * 例如，如果从 http://www.adobe.com/assets/hello.swf 加载内容，并且 LoaderInfo.url 属性的值为 http://www.adobe.com，则此属性会被截断。
     * 仅当下列所有值也全部为 true 时，isURLInaccessible 值才为 true：
     *    - 当加载此内容时，发生 HTTP 重定向。
     *    - 调用 Loader.load() 的 SWF 文件所在域与此内容的最终 URL 所在域不同。
     *    - 调用 Loader.load() 的 SWF 文件不具有访问此内容的权限。授予访问此内容的权限的方式与为 BitmapData.draw() 授予权限的方式相同：调用 Security.allowDomain() 以访问 SWF 文件（或对于非 SWF 文件内容，建立一个策略文件并使用 LoaderContext.checkPolicyFile 属性）。
     * 
     */
    get isURLInaccessible() {
        return false;
    }

    /**
     * 与此 LoaderInfo 对象关联的 Loader 对象。
     * 如果此 LoaderInfo 对象是 SWF 文件的主类实例的 loaderInfo 属性，则没有关联的 Loader 对象。
     */
    get loader() {
        throw new ReferenceError('无权访问！');
    }

    /**
     * SWF 文件的 URL，该 SWF 文件启动对此 LoaderInfo 对象所描述的媒体的加载。
     * 对于 SWF 文件的主类的实例，此 URL 与 SWF 文件自己的 URL 相同。
     */
    get loaderURL() {
        return '//static.hdslb.com/play.swf';
    }

    /**
     * 包含名称-值对的对象，表示为被加载的 SWF 文件提供的参数。  
     * 可以使用 for-in 循环来提取 parameters 对象中的所有名称和值。  
     * 参数的两个源为：主 SWF 文件的 URL 中的查询字符串和 FlashVars HTML 参数（这只影响主 SWF 文件）的值。  
     * parameters 属性替换了 ActionScript 1.0 和 2.0 提供 SWF 文件参数作为主时间轴的技术。  
     * Loader 对象（该对象包含使用 ActionScript 1.0 或 2.0 的 SWF 文件）的 parameters 属性的值为 null。
     * 只有对于包含使用 ActionScript 3.0 的 SWF 文件的 Loader 对象，该值才非 null。
     */
    get parameters() {
        return;
    }

    /**
     * 表示加载者（父级）对内容（子级）的信任关系。
     * 如果父项允许子项访问，则为 true；否则为 false。
     * 果父对象调用了 allowDomain() 方法向子域授予权限，或者在父域中加载了向子域授予权限的 URL 策略文件，则将此属性设置为 true。
     * 如果子级和父级在同一域中，则此属性设置为 true。
     */
    get parentAllowsChild() {
        return false;
    }

    /**
     * 一个对象，它可以在 Loader 对象的沙箱中通过代码进行设置以公开可以由所加载内容的代码访问的属性和方法。
     * 此*沙箱桥*使来自非应用程序域的内容对应用程序沙箱中的脚本具有受控访问权限，反之亦然。
     * 沙箱桥充当沙箱之间的通道，在应用程序安全沙箱和非应用程序安全沙箱之间提供显式交互。
     */
    parentSandboxBridge = {};

    /** 表示加载者和内容之间的域关系：如果它们具有相同的原始域，则为 true；否则为 false。 */
    get sameDomain() {
        return true;
    }

    /**
     * EventDispatcher 实例，可用于跨安全边界交换事件。
     * 即使 Loader 对象和加载的内容源于彼此不信任的安全域，两者仍然可以访问 sharedEvents 并通过此对象发送和接收事件。
     */
    get sharedEvents() {
        return;
    }

    /** 已加载的 SWF 文件的文件格式版本。 */
    get swfVersion() {
        return 10;
    }

    /**
     * 一个在此 LoaderInfo 对象的 SWF 文件中的代码中发生无法处理的错误时调度 uncaughtError 事件的对象。
     * 当任何 try..catch 块引发错误时，或调度的 ErrorEvent 对象没有注册的侦听器时，会发生未被捕获的错误。  
     * 当与此 LoaderInfo 关联的 SWF 完成加载时，会创建此属性。
     * 在此之前，uncaughtErrorEvents 属性保持为 null。
     * 在只包含 ActionScript 的项目中，可以在 SWF 文件主类的构造函数执行期间或执行后访问此属性。
     * 对于 Flex 项目，uncaughtErrorEvents 属性在调度 applicationComplete 事件之后可用。
     */
    get uncaughtErrorEvents() {
        return;
    }

    /**
     * 所加载媒体的 URL。  
     * 在此 LoaderInfo 对象的对应 Loader 对象调度第一个 progress 事件之前，url 属性的值可能只反映在对 Loader 对象的 load() 方法的调用中指定的初始 URL。
     * 在第一个 progress 事件之后，url 属性将在解析了任何重定向和相对 URL 后反映媒体的最终 URL。  
     * 在某些情况下，url 属性的值会被截断；有关详细信息，请参阅 isURLInaccessible 属性。
     */
    get url() {
        return this.loaderURL;
    }

    /**
     * 被加载内容的标示的宽度。  
     * 此值可能与所显示内容的实际宽度不同，因为被加载的内容或其父显示对象可能被缩放。
     */
    get width() {
        return 0;
    }

    /**
     * 返回与定义为对象的 SWF 文件相关联的 LoaderInfo 对象。
     * 
     * @param object 要为其获取关联 LoaderInfo 对象的对象。
     * @returns 关联的 LoaderInfo 对象。
     */
    static getLoaderInfoByDefinition(object: DisplayObject<HTMLElement>) {
        return object.loaderInfo;
    }
}