/** ComponentEvent 类定义与 UIComponent 类关联的事件。 */
export enum ComponentEvent {
    /** 在组件可见性从可见改为不可见以后调度。 */
    HIDE = "hide",
    /** 在移动组件以后调度。 */
    MOVE = "move",
    /** 在调整组件大小以后调度。 */
    RESIZE = "resize",
    /** 在组件可见性从不可见改为可见以后调度。 */
    SHOW = "show",
}