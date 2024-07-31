/**
 * 利用 AccessibilityProperties 类可控制 Flash 对象辅助功能（如屏幕阅读器）演示。  
 * 您可以将 AccessibilityProperties 对象附加到任何显示对象，但是 Flash Player 只会读取以下某些类型的对象的 AccessibilityProperties 对象：
 * 所有 SWF 文件（以 DisplayObject.root 形式表示）、容器对象（DisplayObjectContainer 和子类）、按钮（SimpleButton 和子类）以及文本（TextField 和子类）。  
 * 这些对象的 name 属性是要指定的最重要的属性，因为辅助功能向用户提供对象名称以作为基本的导航方法。
 * 不要将 AccessibilityProperties.name 与 DisplayObject.name 混淆；这二者有区别且不相关。
 * AccessibilityProperties.name 属性是通过辅助功能用语音读出的名称，而 DisplayObject.name 本质上是仅向 ActionScript 代码显示的变量名称。  
 * 在 Flash Professional 中，AccessibilityProperties 对象的属性在创作期间将覆盖“辅助功能”面板中的相应设置。  
 * 要确定 Flash Player 是否正在支持辅助功能的环境中运行，请使用 Capabilities.hasAccessibility 属性。
 * 如果修改 AccessibilityProperties 对象，则需要调用 Accessibility.updateProperties() 方法以使更改生效。
 */
export class AccessibilityProperties {

    /**
     * 在呈现辅助功能时为该显示对象提供一个说明。
     * 如果要显示有关对象的大量信息，最佳的方法就是选择一个简洁的名称并将大部分内容放在 description 属性中。
     * 适用于整个 SWF 文件、容器、按钮和文本。
     * 默认值为空字符串。  
     * 在 Flash Professional 中，此属性对应于“辅助功能”面板中的“描述”字段。
     */
    description = '';

    /**
     * 如果为 true，则会导致 Flash Player 从辅助演示中排除该显示对象内的子对象。  
     * 默认值为 false。适用于所有 SWF 文件和容器。
     */
    forceSimple = false;

    /**
     * 在呈现辅助功能时为该显示对象提供一个名称。
     * 适用于整个 SWF 文件、容器、按钮和文本。
     * 不要将其与不相关的 DisplayObject.name 混淆。
     * 默认值为空字符串。  
     * 在 Flash Professional 中，此属性对应于“辅助功能”面板中的“名称”字段。
     */
    name = '';

    /**
     * 如果为 true，则禁用 Flash Player 的默认自动标记系统。
     * 自动标签导致按钮内的文本对象被视为按钮名称，文本字段附近的文本对象被视为文本字段名称。
     * 默认值为 false。
     * 仅适用于所有 SWF 文件。  
     * 将忽略 noAutoLabeling 属性值，除非在某个辅助功能第一次检查 SWF 文件之前指定它。
     * 如果打算将 noAutoLabeling 设置为 true，应尽早在代码中执行此操作。
     */
    noAutoLabeling = false;

    /**
     * 表示与该显示对象关联的快捷键。
     * 仅为与快捷键关联的 UI 控件提供此字符串。
     * 适用于容器、按钮和文本。
     * 默认值为空字符串。  
     * **注意：**分配此属性并不会自动将指定的按键组合分配给该对象；您必须自己执行该操作，例如，通过侦听 KeyboardEvent。  
     * 该字符串的语法使用组合键的长名称，并使用加号 (+) 字符来表示按键组合。
     * 有效的字符串示例如“Ctrl+F”、“Ctrl+Shift+Z 等等。
     */
    shortcut = '';

    /**
     * 如果为 true，则从辅助功能演示中排除该显示对象。
     * 默认值为 false。
     * 适用于整个 SWF 文件、容器、按钮和文本。
     */
    silent = false;
}