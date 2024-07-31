/**
 * View Transitions API提供了一种机制，
 * 可以轻松地在不同 DOM 状态之间创建动画转换，
 * 同时还可以一步更新 DOM 内容。
 */
declare interface ViewTransition {
    /** 一个在过渡动画完成后兑现的 Promise，新的页面视图对用户可见且可交互。 */
    finished: Promise<void>;
    /** 一个在伪元素树创建且过渡动画即将开始时兑现的 Promise。 */
    ready: Promise<void>;
    /** 当 document.startViewTransition() 的回调返回的 Promise 兑现时，该 Promise 也会兑现。 */
    updateCallbackDone: Promise<void>;
    /** 跳过视图过渡的动画部分，但不会跳过运行 document.startViewTransition() 的回调，该回调会更新 DOM。 */
    skipTransition(): void;
}

declare interface Document {
    /**
     * 开始一个新的视图过渡，并返回一个 ViewTransition 对象来表示它。
     * @deprecated 此例及其消耗性能，不如使用CSS过渡和动画！除非是CSS做不到的（比如不同页面导航）
     * @param callback 一个在视图过渡过程中通常用于更新 DOM 的回调函数，它返回一个 Promise。
     * 这个回调函数在 API 截取了当前页面的屏幕截图后被调用。
     * 当回调函数返回的 Promise 兑现时，视图过渡将在下一帧开始。
     * 如果回调函数返回的 Promise 拒绝，过渡将被放弃。
     */
    startViewTransition(callback: () => void): ViewTransition;
}