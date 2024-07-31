/**
 * ApplicationDomain 类是分散的类定义组的一个容器。
 * 应用程序域用于划分位于同一个安全域中的类。
 * 它们允许同一个类存在多个定义，并且允许子级重用父级定义。  
 * 在通过 Loader 类加载外部 SWF 文件时会使用应用程序域。
 * 加载的 SWF 文件中的所有 ActionScript 3.0 定义都存储在由 LoaderContext 对象的 applicationDomain 属性指定的应用程序域中，此对象是您为 Loader 对象的 load() 或 loadBytes() 方法传递的 context 参数。
 * LoaderInfo 对象还包含一个只读的 applicationDomain 属性。  
 * SWF 文件中的所有代码被定义为存在于应用程序域中。
 * 主应用程序就在当前的应用程序域中运行。
 * 系统域中包含所有应用程序域（包括当前域），这意味着它包含所有 Flash Player 类。  
 * 除系统域以外，每个应用程序域都有一个关联的父域。
 * 主应用程序的应用程序域的父域是系统域。
 * 已加载的类仅在其父级中没有相关定义时才进行定义。
 * 不能用较新的定义覆盖已加载的类定义。  
 */
export class ApplicationDomain {

    #currentDomain = this;

    /** 获取正在其中执行代码的当前应用程序域。 */
    get currentDomain() {
        return this.#currentDomain;
    }

    /** 获取并设置将在此 ApplicationDomain 中对其执行域全局内存操作的对象。 */
    domainMemory: number[] = [];

    /** 获取用作 ApplicationDomain.domainMemory 所需的最小内存对象长度。 */
    get MIN_DOMAIN_MEMORY_LENGTH() {
        return 0;
    }

    /**
     * 创建一个新的应用程序域。
     * 
     * @param parentDomain 如果未传入父域，此应用程序域将使用系统域作为其父域。
     */
    constructor(private parentDomain?: ApplicationDomain) { }

    /**
     * 从指定的应用程序域获取一个公共定义。
     * 该定义可以是一个类、一个命名空间或一个函数的定义。
     * 
     * @param name 定义的名称。
     */
    getDefinition(name: string) {
        throw new ReferenceError('不存在具有指定名称的公共定义。');
    }

    /**
     * 从指定应用程序域获取各个公共定义的所有完全限定名称。
     * 该定义可以是一个类、一个命名空间或一个函数的定义。
     * 可将从此方法返回的名称传递给 getDefinition() 方法，以获取实际定义的对象。  
     * 返回的矢量为 String 类型，每个字符串的格式为：*package。path::definitionName*
     * 如果 *definitionName* 在顶级包中，则去除 *package。path::*
     */
    getQualifiedDefinitionNames() {
        throw new ReferenceError('此定义属于调用代码不具有访问权限的域。');
    }

    /**
     * 检查指定的应用程序域之内是否存在一个公共定义。
     * 该定义可以是一个类、一个命名空间或一个函数的定义。
     * 
     * @param name 定义的名称。
     * @returns 如果指定的定义存在，则返回 true 值；否则，返回 false。
     */
    hasDefinition(name: string) {
        return false;
    }
}