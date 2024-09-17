import { IDanmaku } from "../../..";
import { Format } from "../../../../utils/fomat";
import { BitmapFilter } from "../filters/BitmapFilter";
import { BlurFilter } from "../filters/BlurFilter";
import { DropShadowFilter } from "../filters/DropShadowFilter";
import { GlowFilter } from "../filters/GlowFilter";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Rectangle } from "../geom/Rectangle";
import { Transform } from "../geom/Transform";
import { Vector3D } from "../geom/Vector3D";
import { addElement } from "../Utils/element";
import { AccessibilityProperties } from "./AccessibilityProperties";
import { BitmapData } from "./Bitmap";
import { BlendMode } from "./BlendMode";
import { IDisplay, IMotion } from "./Display";
import { Event as DisplayObjectEvent } from "./Event";
import { LoaderInfo } from "./LoaderInfo";

/**
 * DisplayObject 类是可放在显示列表中的所有对象的基类。
 * 该显示列表管理 Flash 运行时中显示的所有对象。
 * 使用 DisplayObjectContainer 类排列显示列表中的显示对象。  
 * DisplayObjectContainer 对象可以有子显示对象，而其他显示对象（如 Shape 和 TextField 对象）是“叶”节点，只有父级和同级，没有子级。  
 * DisplayObject 类支持基本功能（如对象的 x 和 y 位置），也支持更高级的对象属性（如它的转换矩阵）。  
 * DisplayObject 是一种抽象基类；因此，不能直接调用 DisplayObject。
 * 调用 new DisplayObject() 会引发 ArgumentError 异常。  
 * 所有显示对象都继承自 DisplayObject 类。  
 * DisplayObject 类本身不包含任何用于在屏幕上呈现内容的 API。
 * 因此，如果要创建 DisplayObject 类的自定义子类，您将需要扩展其中一个具有在屏幕上呈现内容的 API 的子类，如 Shape、Sprite、Bitmap、SimpleButton、TextField 或 MovieClip 类。  
 * DisplayObject 类包含若干广播事件。
 * 通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。
 * 例如，added 事件的目标是已添加到显示列表的特定 DisplayObject 实例。
 * 若只有一个目标，则会将事件侦听器限制为只能放置到该目标上
 * （在某些情况下，可放置到显示列表中该目标的祖代上）。
 * 但是，对于广播事件，目标不是特定的 DisplayObject 实例，而是所有 DisplayObject 实例
 * （包括那些不在显示列表中的实例）。
 * 这意味着您可以向任何 DisplayObject 实例添加侦听器来侦听广播事件。
 * 除了 DisplayObject 类的 Events 表中列出的广播事件，DisplayObject 类还从 EventDispatcher 类继承如下两个广播事件：activate 和 deactivate。  
 * 
 */
export abstract class DisplayObject<T extends HTMLElement> {

    /**
     * 此显示对象的当前辅助功能选项。
     * 如果您修改 accessibilityProperties 属性或 accessibilityProperties 内部的任何字段，则必须调用 Accessibility.updateProperties() 方法以使您的更改生效。  
     * **请注意：**对于在 Flash 创作环境中创建的对象，将使用您在“辅助功能”面板中为该对象输入的所有信息来填充 accessibilityProperties 的值。
     */
    accessibilityProperties = new AccessibilityProperties();

    protected $alpha = 1;

    /**
     * 表示指定对象的 Alpha 透明度值。
     * 有效值为 0（完全透明）到 1（完全不透明）。
     * 默认值为 1。
     * alpha 设置为 0 的显示对象是活动的，即使它们不可见。
     */
    get alpha() {
        return this.$alpha;
    }

    set alpha(value) {
        this.$alpha = value;
        this.$host.style.opacity = String(value);
    }

    protected $blendMode = BlendMode.NORMAL;

    /**
     * BlendMode 类中的一个值，用于指定要使用的混合模式。
     * 内部绘制位图的方法有两种。
     * 如果启用了混合模式或外部剪辑遮罩，则将通过向矢量渲染器添加有位图填充的正方形来绘制位图。 
     * 如果尝试将此属性设置为无效值，则 Flash 运行时会将此值设置为 BlendMode.NORMAL。  
     * blendMode 属性影响显示对象的每个像素。
     * 每个像素都由三种原色（红色、绿色和蓝色）组成，每种原色的值介于 0x00 和 0xFF 之间。
     * Flash Player 或 Adobe AIR 将影片剪辑中一个像素的每种原色与背景中像素的对应颜色进行比较。
     * 例如，如果 blendMode 设置为 BlendMode.LIGHTEN，则 Flash Player 或 Adobe AIR 会将显示对象的红色值与背景的红色值进行比较，然后使用两者中较亮的一种颜色作为显示颜色的红色成分的值。
     */
    get blendMode() {
        return this.$blendMode;
    }

    set blendMode(value) {
        this.$blendMode = value;
        this.$host.style.backgroundBlendMode = value;
        this.$host.style.mixBlendMode = value;
    }

    /**
     * 设置用于混合前景和背景的着色器。
     * 当 blendMode 属性设置为 BlendMode.SHADER 时，将使用指定的着色器为显示对象创建混合模式输出。  
     * 如果将显示对象的 blendShader 属性设置为 Shader 实例，则会将显示对象的 blendMode 属性自动设置为 BlendMode.SHADER。
     * 如果设置了 blendShader 属性
     * （这会将 blendMode 属性设置为 BlendMode.SHADER）
     * 则 blendMode 属性的值会发生变化，只需将 blendMode 属性设置为 BlendMode.SHADER 即可将混合模式重置为使用混合着色器。
     * 除非要更改用于混合模式的着色器，否则无需再次设置 blendShader 属性。  
     * 赋予 blendShader 属性的 Shader 至少必须指定两个 image4 输入。
     * **无需**使用关联 ShaderInput 对象的 input 属性在代码中指定输入。
     * 会自动使用背景显示对象作为第一个输入（index 为 0 的输入）。
     * 使用前景显示对象作为第二个输入（index 为 1 的输入）。
     * 用作混合着色器的着色器可以指定超过两个输入。
     * 在这种情况下，必须通过设置其 ShaderInput 实例的 input 属性来指定任何附加输入。  
     * 将 Shader 实例赋予此属性时，会在内部复制着色器。
     * 混合操作将使用该内部副本，而不是对原始着色器的引用。
     * 对着色器进行的任何更改（比如更改参数值、输入或字节代码）不会应用于所复制的用于混合模式的着色器。
     */
    set blendShader(value: unknown) {
        this.blendMode = BlendMode.SHADER;
    }

    protected $cacheAsBitmap = false;

    /**
     * 如果设置为 true，则 Flash 运行时将缓存显示对象的内部位图表示形式。
     * 此缓存可以提高包含复杂矢量内容的显示对象的性能。  
     * 具有已缓存位图的显示对象的所有矢量数据都将被绘制到位图而不是主显示。
     * 如果 cacheAsBitmapMatrix 为空或不受支持，位图将作为与最近的像素边界对齐的未拉伸且未旋转的像素复制到主显示。
     * 像素按一对一与父对象进行映射。
     * 如果位图的边界发生更改，则将重新创建位图而不会拉伸它。  
     * 如果支持 cacheAsBitmapMatrix，并且它为非空，则对象将使用该矩阵绘制到屏幕范围外的位图，并且使用该呈现的拉伸和/或旋转结果将对象绘制到主显示。  
     * 除非将 cacheAsBitmap 属性设置为 true，否则不会创建内部位图。  
     * 将 cacheAsBitmap 属性设置为 true 后，呈现并不更改，但是，显示对象将自动执行像素贴紧。
     * 动画速度可能会大大加快，具体取决于矢量内容的复杂性。  
     * 只要对显示对象（当其 filter 数组不为空时）应用滤镜，cacheAsBitmap 属性就自动设置为 true，而且如果对显示对象应用了滤镜，即使将该属性设置为 false，也会将该显示对象的 cacheAsBitmap 报告为 true。
     * 如果清除显示对象的所有滤镜，则 cacheAsBitmap 设置将更改为它上次的设置。  
     * 在下面的情况下，即使将 cacheAsBitmap 属性设置为 true，显示对象也不使用位图，而是从矢量数据呈现：
     *    - 位图过大。在 AIR 1.5 和 Flash Player 10 中，位图图像的最大宽度或高度为 8,191 像素，并且像素总数不能超过 16,777,215 像素。（因此，如果位图图像的宽度为 8,191 像素，则其高度只能为 2,048 像素。）在 Flash Player 9 及早期版本中，高度最大为 2880 像素，宽度最大为 2,880 像素。
     *    - 位图无法分配（内存不足错误）。
     * 
     * 最好将 cacheAsBitmap 属性与主要具有静态内容且不频繁缩放和旋转的影片剪辑一起使用。
     * 对于这样的影片剪辑，在转换影片剪辑时（更改其 x 和 y 位置时），cacheAsBitmap 可以提高性能。
     */
    get cacheAsBitmap() {
        return this.$cacheAsBitmap;
    }

    set cacheAsBitmap(value) {
        this.$cacheAsBitmap = value;
    }

    /**
     * 如果为非 null，则 Matrix 对象会定义显示对象在 cacheAsBitmap 设置为 true 时的呈现方式。
     * 应用程序使用此矩阵作为呈现显示对象的位图版本时应用的转换矩阵。  
     * 使用 cacheAsBitmapMatrix 设置，应用程序将保留经过各种 2D 变形的缓存位图图像，包括平移、旋转和缩放。
     * 如果应用程序使用硬件加速，则对象将作为纹理存储在视频内存中。
     * 这样可允许 GPU 对对象应用受支持的变形。
     * GPU 执行这些转换的速度比 CPU 快。  
     * 要使用硬件加速功能，请在 Flash Professional CS5 中的“iPhone 设置”对话框的“常规”选项卡上将“呈现”设置为 GPU。
     * 或在应用程序描述符文件中将 renderMode 属性设置为 gpu。
     * 请注意，AIR for TV 设备将自动使用硬件加速（如果可用）。  
     * **注意：**cacheAsBitmapMatrix 属性适用于 2D 变形。
     * 如果需要在 3D 中应用变形，您可能需要通过设置对象的 3D 属性，并且处理它的 transform.matrix3D 属性来应用变形。
     * 如果使用 GPU 模式打包应用程序，则允许 GPU 对对象应用 3D 变形。
     * 3D 对象将忽略 cacheAsBitmapMatrix。
     * @deprecated 暂未实现
     */
    cacheAsBitmapMatrix?: Matrix;

    /** 动画累计延时 */
    protected $delay = 0;

    /** 事件及其次数 */
    protected $events: Record<DisplayObjectEvent, number> = <any>{};

    protected $filters: BitmapFilter[] = [];

    /**
     * 包含当前与显示对象关联的每个滤镜对象的索引数组。
     * flash.filters 包中的多个类定义了可使用的特定滤镜。  
     * 设计时或在运行时，可通过使用 ActionScript 代码在 Flash Professional 中应用筛选器。
     * 要通过使用 ActionScript 应用滤镜，您必须制作整个 filters 数组的临时副本，修改临时数组，然后将临时数组的值分配回 filters 数组。
     * 无法直接将新滤镜对象添加到 filters 数组。  
     * 要通过使用 ActionScript 添加滤镜，请执行以下步骤（假定目标显示对象名为 myDisplayObject）：
     *    1. 使用所选滤镜类的构造函数方法创建一个新的滤镜对象。
     *    2. 将 myDisplayObject.filters 数组的值分配给临时数组，例如一个名为 myFilters 的数组。
     *    3. 将新的滤镜对象添加到临时数组 myFilters。
     *    4. 将临时数组的值分配给 myDisplayObject.filters 数组。
     * 
     * 如果 filters 数组未定义，则无需使用临时数组。
     * 相反，您可以直接赋值包含一个或多个已创建的滤镜对象的一个数组文本值。  
     * 要修改现有的滤镜对象，必须使用修改 filters 数组的副本的技术：
     *    1. 将 filters 数组的值分配给临时数组，例如一个名为 myFilters 的数组。
     *    2. 使用临时数组 myFilters 修改属性。例如，如果要设置数组中第一个滤镜的品质属性，可以使用以下代码：myFilters[0].quality = 1;
     *    3. 将临时数组的值分配给 filters 数组。
     * 
     * 在加载时，如果显示对象具有关联的滤镜，则将它标记为像透明位图那样缓存自身。
     * 从此时起，只要显示对象具有有效的滤镜列表，播放器就会将显示对象缓存为位图。
     * 此源位图用作滤镜效果的源图像。
     * 每个显示对象通常有两个位图：一个包含原始未过滤的源显示对象，另一个是过滤后的最终图像。
     * 呈现时使用最终图像。
     * 只要显示对象不发生更改，最终图像就不需要更新。
     */
    get filters() {
        return this.$filters;
    }

    set filters(value) {
        this.$filters = value;
        if (value) {
            const filter: string[] = [];
            const shadows: string[] = [];
            for (const d of value) {
                if (d instanceof BlurFilter) {
                    shadows.push([0, 0, Math.max(d.blurX, d.blurY) + "px"].join(" "));
                    // filter.push(`blur(${Math.max(d.blurX, d.blurY)}px)`);
                } else if (d instanceof DropShadowFilter) {
                    filter.push(`drop-shadow(0 0 ${Math.max(d.blurX, d.blurY)}px ${d.distance}px ${Format.rgba(d.color, d.alpha)})`);
                } else if (d instanceof GlowFilter) {
                    for (let i = 0; i < Math.min(2, d.strength); i++) {
                        shadows.push([0, 0, Math.max(d.blurX, d.blurY) + "px", Format.rgba(d.color, d.alpha)].join(" "));
                    }
                }
            }
            this.$host.style.filter = filter.join(' ');
            this.$host.style.textShadow = shadows.join(',');
        } else {
            this.$host.style.filter = '';
            this.$host.style.textShadow = '';
        }
    }

    /**
     * 表示显示对象的高度，以像素为单位。
     * 高度是根据显示对象内容的范围来计算的。
     * 如果您设置了 height 属性，则 scaleY 属性会相应调整。  
     * 除 TextField 和 Video 对象以外，没有内容的显示对象（如一个空的 Sprite）的高度为 0，即使您尝试将 height 设置为其他值，也是这样。
     */
    get height() {
        return this.$host.getBoundingClientRect().height;
    }

    set height(value) {
        this.$host.style.blockSize = value + 'px';
    }

    protected $loaderInfo = new LoaderInfo();

    /**
     * 返回一个 LoaderInfo 对象，其中包含加载此显示对象所属的文件的相关信息。
     * loaderInfo 属性仅为 SWF 文件的根显示对象或已加载的位图（而不是使用 ActionScript 绘制的位图）定义。
     * 要查找与包含名为 myDisplayObject 的显示对象的 SWF 文件相关的 loaderInfo 对象，请使用 myDisplayObject.root.loaderInfo。  
     * 大的 SWF 文件可以通过调用 this.root.loaderInfo.addEventListener(Event.COMPLETE, func) 来监控其下载。
     */
    get loaderInfo() {
        return this.$loaderInfo;
    }

    protected $mask?: DisplayObject<T>;

    /**
     * 调用显示对象被指定的 mask 对象遮罩。
     * 要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。
     * 但不绘制 mask 对象本身。
     * 将 mask 设置为 null 可删除蒙版。  
     * 要能够缩放遮罩对象，它必须在显示列表中。
     * 要能够拖动蒙版 Sprite 对象（通过调用其 startDrag() 方法），它必须在显示列表中。
     * 要为基于 sprite 正在调度的 mouseDown 事件调用 startDrag() 方法，请将 sprite 的 buttonMode 属性设置为 true。  
     * 通过将 cacheAsBitmap 属性设置为 true，将 cacheAsBitmapMatrix 属性设置为 Matrix 对象来缓存显示对象时，遮罩对象和被遮罩的显示对象必须是同一缓存位图的一部分。
     * 因此，如果缓存显示对象，则遮罩必须是显示对象的子级。
     * 如果缓存显示列表上的显示对象的祖代，则遮罩必须是该祖代的子级或其后代之一。
     * 如果缓存遮罩对象的多个祖代，则遮罩必须是显示列表中离遮罩对象最近的缓存容器的后代。  
     * **注意：**单个 mask 对象不能用于遮罩多个执行调用的显示对象。
     * 在将 mask 分配给第二个显示对象时，会撤消其作为第一个对象的遮罩，该对象的 mask 属性将变为 null。
     */
    get mask() {
        return this.$mask;
    }

    set mask(value) {
        this.$mask = value;
    }

    /** 如果元数据是通过 PlaceObject4 标记与此 DisplayObject 的实例一起存储在 SWF 文件中的，则获取 DisplayObject 实例的元数据对象。 */
    metaData = {};

    /**
     * 表示此鼠标或用户输入设备位置的 x 坐标，以像素为单位。  
     * **注意：**对于已旋转的 DisplayObject，返回的 x 坐标将反映未旋转的对象。
     */
    get mouseX() {
        return 0;
    }

    /**
     * 表示此鼠标或用户输入设备位置的 y 坐标，以像素为单位。  
     * **注意：**对于已旋转的 DisplayObject，返回的 y 坐标将反映未旋转的对象。
     */
    get mouseY() {
        return 0;
    }

    /**
     * 表示 DisplayObject 的实例名称。
     * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
     */
    get name() {
        return this.$host.getAttribute('name')
    };

    set name(value) {
        value && this.$host.setAttribute('name', value);
    }

    /**
     * 指定显示对象是否由于具有某种背景颜色而不透明。
     * 透明的位图包含 Alpha 通道数据，并以透明的方式进行绘制。
     * 不透明位图没有 Alpha 通道（呈现速度比透明位图快）。
     * 如果位图是不透明的，则您可以指定要使用的其自己的背景颜色。  
     * 如果设置为某个数值，则表面是不透明的，并且带有该数值指定的 RGB 背景颜色。
     * 如果设置为 null（默认值），则显示对象将有透明背景。  
     * opaqueBackground 属性主要与 cacheAsBitmap 属性一起使用，以优化呈现。
     * 对于 cacheAsBitmap 属性设置为 true 的显示对象，设置 opaqueBackground 可以提高呈现性能。  
     * 如果在 shapeFlag 参数设置为 true 时调用 hitTestPoint() 方法，则不透明的背景区域不 匹配。  
     * 不透明背景区域不响应鼠标事件。
     * @deprecated 暂未实现
     */
    opaqueBackground?: object;

    /**
     * 表示包含此显示对象的 DisplayObjectContainer 对象。
     * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
     */
    get parent(): DisplayObject<T> | undefined {
        const p = this.$host.parentElement;
        if (p) {
            return Reflect.get(p, 'displayObject') || this.stage;
        }
        return <DisplayObject<T>><unknown>this.stage;
    }

    /**
     * 对于加载的 SWF 文件中的显示对象，root 属性是此 SWF 文件所表示的显示列表树结构部分中的顶级显示对象。
     * 对于代表已加载图像文件的位图对象，root 属性就是位图对象本身。
     * 对于第一个加载的 SWF 文件的主类的实例，root 属性就是显示对象本身。
     * Stage 对象的 root 属性是 Stage 对象本身。
     * 对于任何未添加到显示列表的显示对象，root 属性设置为 null，除非它已添加到符合以下条件的显示对象容器：不在显示列表中，但属于已加载 SWF 文件中顶级显示对象的子级。
     */
    get root() {
        return <DisplayObject<HTMLElement>>rootSprite;
    }

    protected $rotation = 0;

    /**
     * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
     * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。
     * 对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。
     */
    get rotation() {
        return this.$rotation;
    }

    set rotation(value) {
        this.$rotation = value;
        this._updateBox();
    }

    protected $rotationX = 0;

    /**
     * 表示 DisplayObject 实例相对于 3D 父容器距离其原始方向的 x 轴旋转（以度为单位）。
     * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。
     * 对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。
     */
    get rotationX() {
        return this.$rotationX;
    }

    set rotationX(value) {
        this.$rotationX = value;
        this._updateBox(true);
    }

    protected $rotationY = 0;

    /**
     * 表示 DisplayObject 实例相对于 3D 父容器距离其原始方向的 y 轴旋转（以度为单位）。
     * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。
     * 对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。
     */
    get rotationY() {
        return this.$rotationY;
    }

    set rotationY(value) {
        this.$rotationY = value;
        this._updateBox(true);
    }

    /**
     * 表示 DisplayObject 实例相对于 3D 父容器距离其原始方向的 z 轴旋转（以度为单位）。
     * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。
     * 对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。
     */
    get rotationZ() {
        return this.$rotation;
    }

    set rotationZ(value) {
        this.rotation = value;
        this._updateBox();
    }

    /**
     * 当前有效的缩放网格。
     * 如果设置为 null，则在应用任何缩放转换时，将正常缩放整个显示对象。  
     * 当定义 scale9Grid 属性时，该显示对象被分割到以 scale9Grid 矩形为基础的具有九个区域的网格中，该矩形定义网格的中心区域。  
     * 可以认为中心区域（由矩形定义）之外的八个区域类似于在缩放时已应用特殊规则的图片帧。  
     * 在设置 scale9Grid 属性并缩放显示对象后，会正常缩放所有文本和渐变；但是，对于其他类型的对象，将应用以下规则：
     *    - 正常缩放中心区域中的内容。
     *    - 不缩放转角中的内容。
     *    - 仅水平缩放顶部和底部区域中的内容。仅垂直缩放左侧和右侧区域中的内容。
     *    - 拉伸所有填充（包括位图、视频和渐变）以适应其形状。
     * 
     * 如果旋转显示对象，则所有后续缩放都是正常的（并会忽略 scale9Grid 属性）。  
     * 设置 scale9Grid 的常见用法是设置用作组件的显示对象，当缩放该组件时，其中的边缘区域保持相同的宽度。
     * @deprecated 暂未实现
     */
    scale9Grid?: Rectangle;

    protected $scaleX = 1;

    /**
     * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
     * 默认注册点为 (0,0)。
     * 1.0 等于 100% 缩放。  
     * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
     */
    get scaleX() {
        return this.$scaleX;
    }

    set scaleX(value) {
        this.$scaleX = value;
        this._updateBox();
    }

    protected $scaleY = 1;

    /**
     * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
     * 默认注册点为 (0,0)。
     * 1.0 是 100% 缩放。  
     * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
     */
    get scaleY() {
        return this.$scaleY;
    }

    set scaleY(value) {
        this.$scaleY = value;
        this._updateBox();
    }

    protected $scaleZ = 1;

    /**
     * 表示从对象的注册点开始应用的对象的深度缩放比例（百分比）。
     * 默认注册点为 (0,0)。
     * 1.0 是 100% 缩放。  
     * 缩放本地坐标系统将更改 x、y 和 z 属性值，这些属性值是以整像素定义的。
     */
    get scaleZ() {
        return this.$scaleZ;
    }

    set scaleZ(value) {
        this.$scaleZ = value;
        this._updateBox(true);
    }

    /**
     * 显示对象的滚动矩形范围。
     * 显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。  
     * scrollRect Rectangle 对象的属性使用显示对象的坐标空间，并缩放到像整个显示对象一样。滚动显示对象上已裁切窗口的转角范围是显示对象的原点 (0,0) 和矩形的宽度和高度定义的点。
     * 它们不按原点居中，而是使用原点定义区域的左上角。
     * 滚动的显示对象始终以整像素为增量进行滚动。  
     * 您可以通过设置 scrollRect Rectangle 对象的 x 属性来左右滚动对象， 还可以通过设置 scrollRect 对象的 y 属性来上下滚动对象。
     * 如果显示对象旋转了 90 度，并且您左右滚动它，则实际上显示对象会上下滚动。  
     * 请注意，仅会在渲染对象时处理 scrollRect 属性的更改。
     * 因此，如果在修改 scrollRect 方法后立即调用类似 localToGlobal 这样的方法，则该方法可能不会产生预期的结果。
     * @deprecated 暂未实现
     */
    scrollRect?: Rectangle;

    /**
     * 显示对象的舞台。
     * Flash 运行时应用程序仅包含一个 Stage 对象。
     * 例如，您可以创建多个显示对象并加载到显示列表中，每个显示对象的 stage 属性是指相同的 Stage 对象（即使显示对象属于已加载的 SWF 文件）。  
     * 如果显示对象未添加到显示列表，则其 stage 属性会设置为 null。
     */
    get stage() {
        return this.root;
    }

    protected $transform = new Transform(this);

    /**
     * 一个对象，具有与显示对象的矩阵、颜色转换和像素范围有关的属性。
     * 在 Transform 类的条目中对特定属性 matrix、colorTransform 和三个只读属性（concatenatedMatrix、concatenatedColorTransform 和 pixelBounds）进行了说明。  
     * transform 对象的每个属性本身都是一个对象。
     * 此概念很重要，因为设置 matrix 或 colorTransform 对象的新值的唯一方法是，创建新对象并将该对象复制到 transform.matrix 或 transform.colorTransform 属性。  
     * 例如，要增加显示对象矩阵的 tx 值，您必须制作整个矩阵对象的副本，然后将新对象复制到 transform 对象的 matrix 属性中。
     * 不能直接设置 tx 属性。  
     * 您也可以复制整个 transform 对象并为其赋予另一个显示对象的 transform 属性。
     */
    get transform() {
        return this.$transform;
    }

    set transform(value) {
        this.$transform = value;
        this.$transform.displayObject = this;
        if (this.$transform.$3d) {
            // 因为在Tween工具中移动x,y很难表示使用transform同时表示，往往只知道x,y中的一个。
            // 此时独立使用left,top是更方便的选择。
            // 故此将matrix3D（下同）中的x,y值剔除。
            const arr = Array.from(this.$transform.matrix3D.rawData);
            arr[12] && (this.x = arr[12], arr[12] = 0);
            arr[13] && (this.y = arr[13], arr[13] = 0);
            this.$host.style.transform = `matrix3d(${arr.join(',')})`;
        } else {
            this.$transform.matrix.tx && (this.x = this.$transform.matrix.tx);
            this.$transform.matrix.ty && (this.y = this.$transform.matrix.ty);
            const rm = [
                this.$transform.matrix.a,
                this.$transform.matrix.b,
                this.$transform.matrix.c,
                this.$transform.matrix.d,
                0,//this.$transform.matrix.tx,
                0,//this.$transform.matrix.ty,
            ]
            this.$host.style.transform = `matrix(${rm.join(',')})`;
        }
    }

    protected $visible = true;

    /**
     * 显示对象是否可见。
     * 不可见的显示对象已被禁用。
     * 例如，如果 InteractiveObject 实例的 visible=false，则无法单击该对象。
     */
    get visible() {
        return this.$visible;
    }

    set visible(value) {
        this.$visible = value;
        this.$host.style.visibility = value ? 'visible' : 'hidden';
    }

    /**
     * 表示显示对象的宽度，以像素为单位。
     * 宽度是根据显示对象内容的范围来计算的。
     * 如果您设置了 width 属性，则 scaleX 属性会相应调整。  
     * 除 TextField 和 Video 对象以外，没有内容的显示对象（如一个空的 Sprite）的宽度为 0，即使您尝试将 width 设置为其他值，也是这样。
     */
    get width() {
        return this.$host.getBoundingClientRect().width;
    }

    set width(value) {
        this.$host.style.inlineSize = value + 'px';
    }

    private $x = 0;

    /**
     * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
     * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
     * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
     * 对象的坐标指的是注册点的位置。
     */
    get x() {
        return this.$x;
    }

    set x(value) {
        this.$x = value;
        this.$host.style.insetInlineStart = value + 'px';
    }

    protected $y = 0;

    /**
     * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
     * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
     * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
     * 对象的坐标指的是注册点的位置。
     */
    get y() {
        return this.$y;
    }

    set y(value) {
        this.$y = value;
        this.$host.style.insetBlockStart = value + 'px';
    }

    protected $z = 0;

    /**
     * 表示 DisplayObject 实例相对于 3D 父容器沿 z 轴的 z 坐标位置。
     * z 属性用于 3D 坐标，而不是屏幕坐标或像素坐标。  
     * 当您将显示对象的 z 属性设置为默认值 0 之外的其他值时，将自动创建一个相对应的 Matrix3D 对象，以便调整显示对象在三维中的位置和方向。
     * 在使用 z 轴时，x 和 y 属性的现有行为将从屏幕坐标或像素坐标更改为相对于 3D 父容器的位置。  
     * 例如，位于 x = 100、y = 100、z = 200 位置的 _root 的子级不在像素位置 (100,100) 处进行绘制。
     * 将在 3D 投影计算将其所置之处绘制该子级。
     * 计算方法为：
     * ```
     * (x*cameraFocalLength/cameraRelativeZPosition, y*cameraFocalLength/cameraRelativeZPosition)
     * ```
     * 
     */
    get z() {
        return this.$z;
    }

    set z(value) {
        this.$z = value;
        this._updateBox(true);
    }

    constructor(private $param = <IDisplay>{}, private $append = true, public $host = <T><unknown>addElement('div', { class: 'as3-danmaku-item' })) { }

    protected init() {
        'alpha' in this.$param && (this.alpha = this.$param.alpha);
        'x' in this.$param && (this.x = this.$param.x);
        'y' in this.$param && (this.y = this.$param.y);
        if (this.$param.motionGroup?.length) {
            const p = this.$param.motionGroup[0];
            'alpha' in p && (this.alpha = p.alpha?.fromValue!);
            'x' in p && (this.x = p.x?.fromValue!);
            'y' in p && (this.y = p.y?.fromValue!);
            this.initMotion(this.$param.motionGroup, this.$param.lifeTime);
        } else if (this.$param.motion) {
            const p = this.$param.motion;
            'alpha' in p && (this.alpha = p.alpha?.fromValue!);
            'x' in p && (this.x = p.x?.fromValue!);
            'y' in p && (this.y = p.y?.fromValue!);
            this.initMotion(this.$param.motion, this.$param.lifeTime);
        }
        // 应该在子类初始化后才执行，否则$host是未定义的
        if (this.$param.parent && this.$append) {
            if (this.$param.parent.addChild) {
                this.$param.parent.addChild(<any>this);
            } else {
                // parent 可能被设为了无效值
                // @link [【东方】『Lunatic Heavens』星夜万華鏡PV 完整曲](https://www.bilibili.com/video/av464038)
                delete this.$param.parent;
                this.stage.addChild(<any>this);
            }
        } else {
            this.$append && this.stage.addChild(<any>this);
        }
        this.$param.lifeTime && setTimeout(() => { this.remove() }, this.$param.lifeTime * 1000);
        this.$host.style.perspective = `calc(100cqi / 2 / tan((${Math.PI} / 180) * (55 / 2)))`;
    }

    /** 初始化动画 */
    private initMotion(motionGroup: IMotion[] | IMotion, lifeTime = 0) {
        Array.isArray(motionGroup) || (motionGroup = [motionGroup]);
        this.$delay = 0; // 当前延时
        motionGroup.forEach(d => {
            let delay1 = 0; // 下一延时
            if (d.alpha) {
                const keyframes: Keyframe[] = [];
                const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards' };
                const delay2 = (d.alpha.lifeTime || 0) * 1000 + (d.alpha.startDelay || 0); // 临时延时
                'fromValue' in d.alpha && keyframes.push({ opacity: d.alpha.fromValue });
                'toValue' in d.alpha && keyframes.push({ opacity: d.alpha.toValue });
                keyframeAnimationOptions.duration = (d.alpha.lifeTime || lifeTime) * 1000;
                d.alpha.repeat && (keyframeAnimationOptions.iterations = d.alpha.repeat);
                (this.$delay || d.alpha.startDelay) && (keyframeAnimationOptions.delay = this.$delay + (d.alpha.startDelay || 0));
                keyframes.length && this.$host.animate(keyframes, keyframeAnimationOptions);
                delay2 > delay1 && (delay1 = delay2); // 取大不取小
            }
            if (d.x) {
                const keyframes: Keyframe[] = [];
                const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards' };
                const delay2 = (d.x.lifeTime || 0) * 1000 + (d.x.startDelay || 0);
                'fromValue' in d.x && keyframes.push({ left: d.x.fromValue + 'px' });
                'toValue' in d.x && keyframes.push({ left: d.x.toValue + 'px' });
                keyframeAnimationOptions.duration = (d.x.lifeTime || lifeTime) * 1000;
                d.x.repeat && (keyframeAnimationOptions.iterations = d.x.repeat);
                (this.$delay || d.x.startDelay) && (keyframeAnimationOptions.delay = this.$delay + (d.x.startDelay || 0));
                keyframes.length && this.$host.animate(keyframes, keyframeAnimationOptions);
                delay2 > delay1 && (delay1 = delay2);
            }
            if (d.y) {
                const keyframes: Keyframe[] = [];
                const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards' };
                const delay2 = (d.y.lifeTime || 0) * 1000 + (d.y.startDelay || 0);
                'fromValue' in d.y && keyframes.push({ top: d.y.fromValue + 'px' });
                'toValue' in d.y && keyframes.push({ top: d.y.toValue + 'px' });
                keyframeAnimationOptions.duration = (d.y.lifeTime || lifeTime) * 1000;
                d.y.repeat && (keyframeAnimationOptions.iterations = d.y.repeat);
                (this.$delay || d.y.startDelay) && (keyframeAnimationOptions.delay = this.$delay + (d.y.startDelay || 0));
                keyframes.length && this.$host.animate(keyframes, keyframeAnimationOptions);
                delay2 > delay1 && (delay1 = delay2);
            }
            if (d.rotationY || d.rotationZ) {
                const keyframes: Keyframe[] = [];
                const keyframeAnimationOptions: KeyframeAnimationOptions = { fill: 'forwards' };
                const delay2 = (d.rotationY?.lifeTime || d.rotationZ?.lifeTime || 0) * 1000 + (d.rotationY?.startDelay || d.rotationZ?.startDelay || 0);
                let rotationY = d.rotationY?.fromValue || 0, rotationZ = d.rotationZ?.fromValue || 0;
                keyframes.push({ transform: `matrix3d(calc(cos(${rotationY}deg) * cos(${rotationZ}deg)),calc(cos(${rotationY}deg) * sin(${rotationZ}deg)),calc(sin(${rotationY}deg)),0,calc(0 - sin(${rotationZ}deg)),calc(cos(${rotationZ}deg)),0,0,calc(0 - sin(${rotationY}deg) * cos(${rotationZ}deg)),calc(0 - sin(${rotationY}deg) * sin(${rotationZ}deg)),calc(cos(${rotationY}deg)),0,0,0,0,1)` });
                d.rotationY && 'toValue' in d.rotationY && (rotationY = d.rotationY.toValue!);
                d.rotationZ && 'toValue' in d.rotationZ && (rotationZ = d.rotationZ.toValue!);
                keyframes.push({ transform: `matrix3d(calc(cos(${rotationY}deg) * cos(${rotationZ}deg)),calc(cos(${rotationY}deg) * sin(${rotationZ}deg)),calc(sin(${rotationY}deg)),0,calc(0 - sin(${rotationZ}deg)),calc(cos(${rotationZ}deg)),0,0,calc(0 - sin(${rotationY}deg) * cos(${rotationZ}deg)),calc(0 - sin(${rotationY}deg) * sin(${rotationZ}deg)),calc(cos(${rotationY}deg)),0,0,0,0,1)` });
                keyframeAnimationOptions.duration = (d.rotationY?.lifeTime || d.rotationZ?.lifeTime || lifeTime) * 1000;
                (d.rotationY?.repeat || d.rotationZ?.repeat) && (keyframeAnimationOptions.iterations = d.rotationY?.repeat || d.rotationZ?.repeat);
                (this.$delay || d.rotationY?.startDelay || d.rotationZ?.startDelay) && (keyframeAnimationOptions.delay = this.$delay + ((d.rotationY?.startDelay || d.rotationZ?.startDelay) || 0));
                keyframes.length && this.$host.animate(keyframes, keyframeAnimationOptions);
                delay2 > delay1 && (delay1 = delay2);
            }
            this.$delay += delay1;
        });
    }

    /**
     * 应用变换
     * @param td 是否3d变换
     */
    protected _updateBox(td = false) {
        if (td || this.$transform.$3d) {
            this.$transform.box3d(this.$scaleX, this.$scaleY, this.$scaleZ, this.$rotationX, this.$rotationY, this.$rotation, 0, 0, this.$z);
        } else {
            this.$transform.box(this.$scaleX, this.$scaleY, this.$rotation * Math.PI / 180);
        }
        this.transform = this.$transform;
    }

    /**
     * 返回一个矩形，该矩形定义相对于 targetCoordinateSpace 对象坐标系的显示对象区域。  
     * **请注意：**使用 localToGlobal() 和 globalToLocal() 方法可以分别将显示对象的本地坐标转换为显示坐标，或将显示坐标转换为本地坐标。  
     * getBounds() 方法与 getRect() 方法类似；但是 getBounds() 方法返回的矩形包括形状的所有笔触，然而 getRect() 方法返回的矩形则不包括。
     * 
     * @param targetCoordinateSpace 定义要使用的坐标系的显示对象。
     */
    getBounds(targetCoordinateSpace = this) {
        return this.getRect(targetCoordinateSpace);
    }

    /**
     * 返回一个矩形，该矩形根据 targetCoordinateSpace 参数定义的坐标系定义显示对象的边界，但不包括形状上的任何笔触。
     * getRect() 方法返回的值等于或小于由 getBounds() 方法返回的值。  
     * **请注意：**使用 localToGlobal() 和 globalToLocal() 方法可以分别将显示对象的本地坐标转换为舞台坐标，或将舞台坐标转换为本地坐标。
     * 
     * @param targetCoordinateSpace 定义要使用的坐标系的显示对象。
     * @returns 定义与 targetCoordinateSpace 对象坐标系统相关的显示对象面积的矩形。
     */
    getRect(targetCoordinateSpace = this) {
        return new Rectangle(targetCoordinateSpace.x, targetCoordinateSpace.y, targetCoordinateSpace.width, targetCoordinateSpace.height);
    }

    /**
     * 将 point 对象从舞台（全局）坐标转换为显示对象的（本地）坐标。  
     * 要使用此方法，请先创建 Point 类的一个实例。
     * 您分配的 x 和 y 值表示全局坐标，因为它们是相对于主显示区域的原点 (0,0) 的。
     * 然后将 Point 实例作为参数传递给 globalToLocal() 方法。
     * 该方法会返回一个新的 Point 对象，该对象具有相对于显示对象原点（而不是舞台原点）的 x 和 y 值。
     * 
     * @param point 用 Point 类创建的对象。 该 Point 对象指定 x 和 y 坐标作为属性。
     * @returns 具有相对于显示对象的坐标的 Point 对象。
     */
    globalToLocal(point: Point) {
        return this.$transform.invMatrix.transformPoint(point);
    }

    /**
     * 将二维点从舞台（全局）坐标转换为三维显示对象的（本地）坐标。  
     * 要使用此方法，请先创建 Point 类的一个实例。
     * 分配给 Point 对象的 x 和 y 值表示全局坐标，原因是这些坐标相对于主显示区域的原点 (0,0)。
     * 然后，将 Point 对象作为 point 参数传递给 globalToLocal3D() 方法。
     * 该方法会以一个 Vector3D 对象的形式返回三维坐标，该对象包含相对于三维显示对象的原点的 x、y 和 z 值。
     * 
     * @param point 表示全局 x 坐标和 y 坐标的二维 Point 对象。
     * @deprecated 暂未实现
     */
    globalToLocal3D(point: Point) { }

    /**
     * 计算显示对象的边框，以确定它是否与 obj 显示对象的边框重叠或相交。
     * 
     * @param obj 要测试的显示对象。
     * @returns 如果显示对象的边框相交，则为 true；否则为 false。
     */
    hitTestObject(obj: DisplayObject<T>) {
        return this.getRect().intersects(obj.getRect());
    }

    /**
     * 计算显示对象，以确定它是否与 x 和 y 参数指定的点重叠或相交。
     * x 和 y 参数指定舞台的坐标空间中的点，而不是包含显示对象的显示对象容器中的点（除非显示对象容器是舞台）。
     * 
     * @param x 要测试的此对象的 x 坐标。
     * @param y 要测试的此对象的 y 坐标。
     * @param shapeFlag 是检查对象 (true) 的实际像素，还是检查边框 (false) 的实际像素。
     * @returns 如果显示对象与指定的点重叠或相交，则为 true；否则为 false。
     */
    hitTestPoint(x: number, y: number, shapeFlag = false) {
        return this.getRect().containsPoint(this.globalToLocal(new Point(x, y)));
    }

    /**
     * 将三维显示对象的（本地）坐标的三维点转换为舞台（全局）坐标中的二维点。  
     * 例如，您只能使用二维坐标 (x,y) 来通过 display.Graphics 方法进行绘制。
     * 要绘制三维对象，您需要将显示对象的三维坐标映射到二维坐标。
     * 首先，创建一个保存三维显示对象的 x、y 和 z 坐标的 Vector3D 类的实例。
     * 然后，将 Vector3D 对象作为 point3d 参数传递给 local3DToGlobal() 方法。
     * 该方法会返回一个二维的 Point 对象，可将该对象与图形 API 一起使用来绘制三维对象。
     * 
     * @param point3d 一个包含三维点或三维显示对象的坐标的 Vector3D 对象。
     * @deprecated 暂未实现
     */
    local3DToGlobal(point3d: Vector3D) { }

    /**
     * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。  
     * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。  
     * 要使用此方法，请先创建 Point 类的一个实例。
     * 您分配的 x 和 y 的值表示本地坐标，因为它们是相对于显示对象原点的值。  
     * 然后，您可以将创建的 Point 实例作为参数传递给 localToGlobal() 方法。
     * 该方法会返回一个新的 Point 对象，该对象具有相对于舞台原点（而不是显示对象原点）的 x 和 y 值。
     * 
     * @param point 使用 Point 类创建的点的名称或标识符，指定 x 和 y 坐标作为属性。
     * @returns 具有相对于舞台的坐标的 Point 对象。
     */
    localToGlobal(point: Point) {
        return this.$transform.concatenatedMatrix.transformPoint(point);
    }

    // EventDispatcher
    /**
     * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。
     * 可以为特定类型的事件、阶段和优先级在显示列表中的所有节点上注册事件侦听器。  
     * 成功注册一个事件侦听器后，无法通过额外调用 addEventListener() 来更改其优先级。
     * 要更改侦听器的优先级，必须首先调用 removeListener()。
     * 然后，可以使用新的优先级再次注册该侦听器。  
     * 请记住，注册该侦听器后，如果继续调用具有不同 type 或 useCapture 值的 addEventListener()，则会创建单独的侦听器注册。
     * 例如，如果首先注册 useCapture 设置为 true 的侦听器，则该侦听器只在捕获阶段进行侦听。
     * 如果使用同一个侦听器对象再次调用 addEventListener()，并将 useCapture 设置为 false，那么便会拥有两个单独的侦听器：一个在捕获阶段进行侦听，另一个在目标和冒泡阶段进行侦听。  
     * 不能只为目标阶段或冒泡阶段注册事件侦听器。
     * 这些阶段在注册期间是成对出现的，因为冒泡阶段只适用于目标节点的祖代。  
     * 如果不再需要某个事件侦听器，可调用 removeEventListener() 删除它，否则会产生内存问题。
     * 事件侦听器不会自动从内存中删除，因为只要调度对象存在，垃圾回收器就不会删除侦听器（除非 useWeakReference 参数设置为 true）。  
     * 复制 EventDispatcher 实例时并不复制其中附加的事件侦听器。
     * （如果新近创建的节点需要一个事件侦听器，必须在创建该节点后附加该侦听器。）
     * 但是，如果移动 EventDispatcher 实例，则其中附加的事件侦听器也会随之移动。  
     * 如果在正在处理事件的节点上注册事件侦听器，则不会在当前阶段触发事件侦听器，但会在事件流的稍后阶段触发，如冒泡阶段。  
     * 如果从正在处理事件的节点中删除事件侦听器，则该事件侦听器仍由当前操作触发。
     * 删除事件侦听器后，决不会再次调用该事件侦听器（除非再次注册以备将来处理）。
     * 
     * @param type 事件的类型。
     * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果。函数可以有任何名称。
     * @param useCapture 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
     * @param priority 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
     * @param useWeakReference 确定对侦听器的引用是强引用，还是弱引用。强引用（默认值）可防止您的侦听器被当作垃圾回收。弱引用则没有此作用。类级别成员函数不属于垃圾回收的对象，因此可以对类级别成员函数将 useWeakReference 设置为 true 而不会使它们受垃圾回收的影响。如果对作为嵌套内部函数的侦听器将 useWeakReference 设置为 true，则该函数将作为垃圾回收并且不再是永久函数。如果创建对该内部函数的引用（将该函数保存到另一个变量中），则该函数将不作为垃圾回收并仍将保持永久。
     */
    addEventListener(type: DisplayObjectEvent, listener: () => void, useCapture = false, priority = 0, useWeakReference = false) {
        if (this.$events[type]) {
            this.$events[type]++;
        } else {
            this.$events[type] = 1;
        }
        return this.$host.addEventListener(type, listener, useCapture);
    }

    /**
     * 将事件调度到事件流中。
     * 事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
     * 
     * @param event 调度到事件流中的 Event 对象。如果正在重新调度事件，则会自动创建此事件的一个克隆。在调度了事件后，其 target 属性将无法更改，因此您必须创建此事件的一个新副本以能够重新调度。
     * @returns 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
     */
    dispatchEvent(event: DisplayObjectEvent) {
        return this.$host.dispatchEvent(new Event(event));
    }

    /**
     * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
     * 这样，您就可以确定 EventDispatcher 对象在事件流层次结构中的哪个位置改变了对事件类型的处理。
     * 要确定特定事件类型是否确实触发了事件侦听器，请使用 willTrigger()。  
     * hasEventListener() 与 willTrigger() 的区别是：hasEventListener() 只检查它所属的对象，而 willTrigger() 检查整个事件流以查找由 type 参数指定的事件。  
     * 当从 LoaderInfo 对象调用 hasEventListener() 时，只考虑调用方可以访问的侦听器。
     * 
     * @param type 事件的类型。
     * @returns 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
     */
    hasEventListener(type: DisplayObjectEvent) {
        return Boolean(this.$events[type]);
    }

    /**
     * 从 EventDispatcher 对象中删除侦听器。
     * 如果没有向 EventDispatcher 对象注册任何匹配的侦听器，则对此方法的调用没有任何效果。
     * 
     * @param type 事件的类型。
     * @param listener 要删除的侦听器对象。
     * @param useCapture 指出是为捕获阶段还是为目标和冒泡阶段注册了侦听器。如果为捕获阶段以及目标和冒泡阶段注册了侦听器，则需要对 removeEventListener() 进行两次调用才能将这两个侦听器删除，一次调用将 useCapture() 设置为 true，另一次调用将 useCapture() 设置为 false。
     */
    removeEventListener(type: DisplayObjectEvent, listener: () => void, useCapture = false) {
        if (this.$events[type]) {
            this.$events[type]--;
        }
        this.$host.removeEventListener(type, listener, useCapture);
    }

    /**
     * 检查是否用此 EventDispatcher 对象或其任何祖代为指定事件类型注册了事件侦听器。
     * 将指定类型的事件调度给此 EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。  
     * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。  
     * 当从 LoaderInfo 对象调用 willTrigger() 时，只考虑调用方可以访问的侦听器。
     * 
     * @param type 事件的类型。
     * @deprecated 暂未实现
     */
    willTrigger(type: DisplayObjectEvent) { }

    // DisplayObjectContainer
    /**
     * 确定对象的子级是否支持鼠标或用户输入设备。
     * 如果对象支持鼠标或用户输入设备，用户可以通过使用鼠标或用户输入设备与之交互。
     * 默认值为 true。  
     * 当您使用 Sprite 类的实例（而不是使用 SimpleButton 类）来创建按钮时，此属性很有用。
     * 当您使用 Sprite 实例来创建按钮时，可以选择使用 addChild() 方法添加其他 Sprite 实例来修饰该按钮。
     * 此过程可能导致鼠标事件出现意外行为，因为当您期望父实例成为鼠标事件的目标对象时，作为子项添加的 Sprite 实例却可能成为目标对象。
     * 要确保父实例用作鼠标事件的目标对象，您可以将父实例的 mouseChildren 属性设置为 false。  
     * 设置此属性不会调度任何事件。
     * 您必须使用 addEventListener() 方法才能创建交互式功能。
     */
    mouseChildren = true;

    /** 返回此对象的子项数目。 */
    get numChildren() {
        return this.$host.children.length;
    }

    /**
     * 确定对象的子项是否支持 Tab 键。
     * 为对象的子项启用或禁用 Tab 切换。默认值为 true。  
     * **注意：**不要将 tabChildren 属性用于 Flex。
     * 而应使用 mx.core.UIComponent.hasFocusableChildren 属性。
     */
    tabChildren = true;

    /**
     * 返回此 DisplayObjectContainer 实例的 TextSnapshot 对象。
     * @deprecated 暂未实现
     */
    textSnapshot: unknown;

    /**
     * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。
     * 子项将被添加到该 DisplayObjectContainer 实例中其他所有子项的前（上）面。
     * （要将某子项添加到特定索引位置，请使用 addChildAt() 方法。）
     * 如果添加一个已将其它显示对象容器作为父项的子对象，则会从其它显示对象容器的子列表中删除该对象。  
     * **注意：**stage.addChild() 命令可导致与发布的 SWF 文件有关的问题，包括安全性问题和与其他加载的 SWF 文件的冲突。
     * 无论将多少 SWF 文件加载到运行时中，Flash 运行时实例中都只有一个 Stage。
     * 因此，通常无论如何也不应将对象直接添加到 Stage。
     * Stage 应该包含的唯一对象是根对象。
     * 创建 DisplayObjectContainer 以包含显示列表上的所有项目。
     * 如果需要，随后将 DisplayObjectContainer 实例添加到 Stage。
     * 
     * @param child 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
     * @returns 在 child 参数中传递的 DisplayObject 实例。
     */
    addChild(child: DisplayObject<T>) {
        if (child && child.$host) {
            child.$host.dispatchEvent(new Event(DisplayObjectEvent.ADDED));
            child.$host.dispatchEvent(new Event(DisplayObjectEvent.ADDED_TO_STAGE));
            Reflect.set(child.$host, 'displayObject', child);
            rootSprite.bind('frame', this.frame);
            return this.$host.appendChild(child.$host);
        }
    }

    frame = () => {
        this.dispatchEvent(DisplayObjectEvent.ENTER_FRAME);
        this.dispatchEvent(DisplayObjectEvent.EXIT_FRAME);
        this.dispatchEvent(DisplayObjectEvent.FRAME_CONSTRUCTED);
    }

    /**
     * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。
     * 该子项将被添加到指定的索引位置。
     * 索引为 0 表示该 DisplayObjectContainer 对象的显示列表的后（底）部。  
     * 如果添加一个已将其它显示对象容器作为父项的子对象，则会从其它显示对象容器的子列表中删除该对象。
     * 
     * @param child 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
     * @param index 添加该子项的索引位置。如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
     * @returns 在 child 参数中传递的 DisplayObject 实例。
     */
    addChildAt(child: DisplayObject<T>, index: number) {
        if (child && child.$host) {
            child.$host.dispatchEvent(new Event(DisplayObjectEvent.ADDED));
            child.$host.dispatchEvent(new Event(DisplayObjectEvent.ADDED_TO_STAGE));
            Reflect.set(child.$host, 'displayObject', child);
            rootSprite.bind('frame', this.frame);
            return this.$host.insertBefore(this.$host, this.$host.children[index || 0]);
        }
    }

    /**
     * 表示安全限制是否会导致出现以下情况：在列表中忽略了使用指定 point 点调用 DisplayObjectContainer.getObjectsUnderPoint() 方法时返回的所有显示对象。
     * 默认情况下，一个域中的内容无法访问另一个域中的对象，除非通过调用 Security.allowDomain() 方法来允许它们这样做。  
     * point 参数位于舞台的坐标空间中，此坐标空间可能与显示对象容器的坐标空间不同（除非显示对象容器是舞台）。
     * 您可以使用 globalToLocal() 和 localToGlobal() 方法在这些坐标空间之间转换点。
     * 
     * @param point 要查看其下方内容的点。
     * @returns 如果点包含具有安全限制的子显示对象，则为 true。
     */
    areInaccessibleObjectsUnderPoint(point: Point) {
        return false;
    }

    /**
     * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。
     * 搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。
     * 孙项、曾孙项等，每项都返回 true。
     * 
     * @param child 要测试的子对象。
     * @returns 如果 child 对象是 DisplayObjectContainer 的子项或容器本身，则为 true；否则为 false。
     */
    contains(child: DisplayObject<T>) {
        return this.$host.contains(child.$host);
    }

    /**
     * 返回位于指定索引处的子显示对象实例。
     * 
     * @param index 子对象的索引位置。
     * @returns 位于指定索引位置处的子显示对象。
     */
    getChildAt(index: number) {
        return Reflect.get(this.$host.children[index], 'displayObject');
    }

    /**
     * 返回具有指定名称的子显示对象。
     * 如果多个子显示对象具有指定名称，则该方法会返回子级列表中的第一个对象。  
     * getChildAt() 方法比 getChildByName() 方法快。
     * getChildAt() 方法从缓存数组中访问子项，而 getChildByName() 方法则必须遍历链接的列表来访问子项。
     * 
     * @param name 要返回的子项的名称。
     * @returns 具有指定名称的子显示对象。
     */
    getChildByName(name: string) {
        const host = this.$host.querySelector(`[name="${name}"]`);
        if (host) {
            Reflect.get(host, 'displayObject');
        }
    }

    /**
     * 返回 DisplayObject 的 child 实例的索引位置。
     * 
     * @param child 要标识的 DisplayObject 实例。
     * @returns 要标识的子显示对象的索引位置。
     */
    getChildIndex(child: DisplayObject<T>) {
        const children = this.$host.childNodes;
        for (let i = 0, len = children.length; i < len; i++) {
            if (children[i] === child.$host) {
                return i;
            }
        }
        throw new ReferenceError('对象不存在！');
    }

    /**
     * 返回对象的数组，这些对象位于指定点下，并且是该 DisplayObjectContainer 实例的子项（或孙子项，依此类推）。
     * 返回的数组中将省略出于安全原因而无法访问的任何子对象。
     * 要确定此安全限制是否影响返回的数组，请调用 areInaccessibleObjectsUnderPoint() 方法。  
     * point 参数位于舞台的坐标空间中，此坐标空间可能与显示对象容器的坐标空间不同（除非显示对象容器是舞台）。
     * 您可以使用 globalToLocal() 和 localToGlobal() 方法在这些坐标空间之间转换点。
     * 
     * @param point 要查看其下方内容的点。
     * @deprecated 暂未实现
     */
    getObjectsUnderPoint(point: Point) { }

    remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        } else {
            this.root.removeChild(this);
        }
    }

    /**
     * 从 DisplayObjectContainer 实例的子列表中删除指定的 child DisplayObject 实例。
     * 将已删除子项的 parent 属性设置为 null；如果不存在对该子项的任何其它引用，则将该对象作为垃圾回收。
     * DisplayObjectContainer 中该子项之上的任何显示对象的索引位置都减去 1。  
     * 垃圾回收器重新分配未使用的内存空间。
     * 当在某处变量或对象不再被主动地引用或存储时，如果不存在对该变量或对象的任何其它引用，则垃圾回收器将清理并擦除其过去占用的内存空间。
     * 
     * @param child 要删除的 DisplayObject 实例。
     */
    removeChild(child: DisplayObject<T>) {
        child.$host.dispatchEvent(new Event(DisplayObjectEvent.REMOVED));
        child.$host.dispatchEvent(new Event(DisplayObjectEvent.REMOVED_FROM_STAGE));
        child.$host.remove();
        rootSprite.unbind('frame', child.frame);
        return child;
    }

    /**
     * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject。
     * 将已删除子项的 parent 属性设置为 null；如果没有对该子项的任何其他引用，则将该对象作为垃圾回收。
     * DisplayObjectContainer 中该子项之上的任何显示对象的索引位置都减去 1。  
     * 垃圾回收器重新分配未使用的内存空间。
     * 当在某处变量或对象不再被主动地引用或存储时，如果不存在对该变量或对象的任何其它引用，则垃圾回收器将清理并擦除其过去占用的内存空间。
     * 
     * @param index 要删除的 DisplayObject 的子索引。
     * @returns 已删除的 DisplayObject 实例。
     */
    removeChildAt(index: number) {
        const host = this.$host.children[index];
        if (host) {
            host.dispatchEvent(new Event(DisplayObjectEvent.REMOVED));
            host.dispatchEvent(new Event(DisplayObjectEvent.REMOVED_FROM_STAGE));
            host.remove();
            return Reflect.get(host, 'displayObject');
        }
    }

    /**
     * 从 DisplayObjectContainer 实例的子级列表中删除所有 child DisplayObject 实例。
     * 将已删除子项的 parent 属性设置为 null，如果没有对该子项的任何其他引用，则将该对象作为垃圾回收。  
     * 垃圾回收器重新分配未使用的内存空间。
     * 当在某处变量或对象不再被主动地引用或存储时，如果不存在对该变量或对象的任何其它引用，则垃圾回收器将清理并擦除其过去占用的内存空间。
     * 
     * @param beginIndex 开始位置。小于 0 的值将引发 RangeError。
     * @param endIndex 结束位置。小于 0 的值将引发 RangeError。
     */
    removeChildren(beginIndex = 0, endIndex = 0x7fffffff) {
        const children = this.$host.children;
        for (let i = beginIndex, len = Math.min(children.length, endIndex + 1); i < len; i++) {
            const host = children[i];
            host.dispatchEvent(new Event(DisplayObjectEvent.REMOVED));
            host.dispatchEvent(new Event(DisplayObjectEvent.REMOVED_FROM_STAGE));
            host.remove();
        }
    }

    /**
     * 更改现有子项在显示对象容器中的位置。
     * 这会影响子对象的分层。  
     * 在使用 setChildIndex() 方法并指定一个已经占用的索引位置时，唯一发生更改的位置是显示对象先前的位置和新位置之间的位置。
     * 所有其他位置将保持不变。如果将一个子项移动到比它当前的索引更低的索引处，则这两个索引之间的所有子项的索引引用都将增加 1。
     * 如果将一个子项移动到比它当前的索引更高的索引处，则这两个索引之间的所有子项的索引引用都将减小 1。
     * 
     * @param child 要为其更改索引编号的 DisplayObject 子实例。
     * @param index 生成的 child 显示对象的索引编号。
     */
    setChildIndex(child: DisplayObject<T>, index: number) {
        this.addChildAt(child, index);
    }

    /**
     * 对源起于此对象的所有 MovieClip 递归停止时间轴执行。  
     * 忽略属于执行代码无权访问的沙箱的子显示对象。  
     * **注意：**不会停止通过 NetStream 对象控制的流媒体播放。
     */
    stopAllMovieClips() { }

    /**
     * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。
     * 显示对象容器中所有其他子对象的索引位置保持不变。
     * 
     * @param child1 第一个子对象。
     * @param child2 第二个子对象。
     */
    swapChildren(child1: DisplayObject<T>, child2: DisplayObject<T>) {
        switch (child1.$host.compareDocumentPosition(child2.$host)) {
            case 2: {
                this.$host.insertBefore(child1.$host, child2.$host);
                break;
            }
            default: {
                this.$host.insertBefore(child2.$host, child1.$host);
                break;
            }
        }
    }

    /**
     * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）。
     * 显示对象容器中所有其他子对象的索引位置保持不变。
     * 
     * @param index1 第一个子对象的索引位置。
     * @param index2 第二个子对象的索引位置。
     */
    swapChildrenAt(index1: number, index2: number) {
        const [child1, child2] = [this.$host.children[index1], this.$host.children[index2]];
        switch (child1.compareDocumentPosition(child2)) {
            case 2: {
                this.$host.insertBefore(child1, child2);
                break;
            }
            default: {
                this.$host.insertBefore(child2, child1);
                break;
            }
        }
    }
}

class SpriteRoot extends DisplayObject<HTMLElement> {

    static bk1: BitmapData;

    /**
     * @link [哔哩哔哩2012拜年祭](https://www.bilibili.com/video/av203614?p=4)
     * @deprecated CommentCanvas.parent.parent.bk1 
     */
    get bk1() {
        return SpriteRoot.bk1 || (SpriteRoot.bk1 = new BitmapData(542, 320, true, 0));
    }

    /**
     * @link [哔哩哔哩2012拜年祭](https://www.bilibili.com/video/av203614?p=4)
     * @deprecated Shape.parent.parent.cti.text 
     */
    cti = {}

    /**
     * 用户名
     * @link [【BILIBILI合作】2012夜神月圣诞祭](https://www.bilibili.com/video/av222938)
     */
    get Xname() {
        const res = (<any>self).UserStatus?.userInfo?.uname || 'Akari';
        return `${res}[${res}]`;
    }

    constructor() {
        super(undefined, false);
    }

    /**
     * 弹幕引擎事件的引用
     * 由代码弹幕引擎初始化时写入。
     */
    bind<K extends keyof IEvent>(type: K, listener: (evt: IEvent[K]) => void) { }

    /**
     * 弹幕引擎事件的引用
     * 由代码弹幕引擎初始化时写入。
     */
    one<K extends keyof IEvent>(type: K, listener: (evt: IEvent[K]) => void) { }

    /**
     * 弹幕引擎事件的引用
     * 由代码弹幕引擎初始化时写入。
     */
    unbind<K extends keyof IEvent>(type: K, listener: (evt: IEvent[K]) => void) { }
}

export const rootSprite = new SpriteRoot();

interface IEvent {
    /** 【传入】时间轴：秒 */
    currentTime: number;
    /** 【外发】时间轴跳转：秒 */
    seek: number;
    /** 【转发】暂停渲染 */
    pause: void;
    /** 【转发】继续播放 */
    play: void;
    /** 【转发】容器大小变更 */
    resize: void;
    /** 【外发】播放 */
    enPlay: void;
    /** 【外发】暂停 */
    enPause: void;
    /** TODO: 【转发】发送弹幕 */
    comment: IDanmaku;
    /** 【转发】帧更新 */
    frame: void;
}