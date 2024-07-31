/**
 * Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。  
 * Event 类的属性包含有关事件的基本信息，例如事件的类型或者是否可以取消事件的默认行为。
 * 对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。
 * 但其他事件可能需要更详细的信息。
 * 例如，与鼠标单击关联的事件需要包括有关单击事件的位置以及在单击事件期间是否按下了任何键的其他信息。
 * 您可以通过扩展 Event 类（MouseEvent 类执行的操作）将此类其他信息传递给事件侦听器。
 * ActionScript 3.0 API 为需要其他信息的常见事件定义多个 Event 子类。
 * 与每个 Event 子类关联的事件将在每个类的文档中加以介绍。  
 * Event 类的方法可以在事件侦听器函数中使用以影响事件对象的行为。
 * 某些事件有关联的默认行为。
 * 例如，doubleClick 事件有关联的默认行为，此行为突出显示事件发生时鼠标指针下的词。
 * 通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
 * 也可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
 */
export enum Event {
    /**
     * 将显示对象添加到显示列表中时调度。
     * 以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
     */
    ADDED = "added",
    /**
     * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * 以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
     */
    ADDED_TO_STAGE = "addedToStage",
    /**
     * [播放事件] 播放头进入新帧时调度。
     * 如果播放头不移动，或者只有一帧，则会继续以帧速率调度此事件。
     * 此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。
     */
    ENTER_FRAME = "enterFrame",
    /**
     * [广播事件] 播放头退出当前帧时调度。
     * 所有帧脚本已运行。
     * 如果播放头不移动，或者只有一帧，则会继续以帧速率调度此事件。
     * 此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。
     */
    EXIT_FRAME = "exitFrame",
    /**
     * [广播事件] 在帧显示对象的构造函数运行之后但在帧脚本运行之前调度。
     * 如果播放头不移动，或者只有一帧，则会继续以帧速率调度此事件。
     * 此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。
     */
    FRAME_CONSTRUCTED = "frameConstructed",
    /**
     * 将要从显示列表中删除显示对象时调度。
     * DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。  
     * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
     */
    REMOVED = "removed",
    /**
     * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。  
     * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
     */
    REMOVED_FROM_STAGE = "removedFromStage",
    /**
     * [广播事件] 将要更新和呈现显示列表时调度。
     * 此事件为侦听此事件的对象在呈现显示列表之前进行更改提供了最后的机会。
     * 每次希望调度 render 事件时，必须调用 Stage 对象的 invalidate() 方法。
     * 只有当 Render 事件与调用 Stage.invalidate() 的对象互相信任时，才会将这些事件调度给某个对象。
     * 此事件为广播事件，这意味着具有注册了此事件的侦听器的所有显示对象都会调度此事件。  
     * **注意：**如果显示未呈现，则不会调度此事件。当内容最小化或遮蔽时会出现这种情况。
     */
    RENDER = "render",
}