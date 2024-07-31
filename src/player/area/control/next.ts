import { customElement } from "../../../utils/Decorator/customElement";
import svg_next from "../../assets/svg/next.svg";
import { PLAYER_EVENT, ev } from "../../event-target";

/** 播放器下一视频控制 */
@customElement('button')
export class Next extends HTMLButtonElement {

    /**
     * 需要监听变动的属性。
     * 与实例方法`attributeChangedCallback`配合使用。
     * 此字符串序列定义了`attributeChangedCallback`回调时的第一个参数的可能值。
     */
    // static observedAttributes = [];

    /**
     * 在属性更改、添加、移除或替换时调用。
     * 需要与静态属性`observedAttributes`配合使用。
     * 此回调的第一个参数在`observedAttributes`数组中定义。
     */
    // attributeChangedCallback(name: IobservedAttributes, oldValue: string, newValue: string) {}

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    private ids: any[] = [];

    private currentIndex = 0;

    constructor() {
        super();

        this.classList.add('bofqi-control-button', 'bofqi-control-pause');
        this.insertAdjacentHTML('beforeend', svg_next);

        this.hide();

        ev.bind(PLAYER_EVENT.IDENTIFY, this.identify);

        this.addEventListener('click', this.nextTrack);

        navigator.mediaSession.setActionHandler('nexttrack', this.nextTrack);
        navigator.mediaSession.setActionHandler('previoustrack', this.previousTrack);
    }

    /**
     * 更新切P数据
     * 
     * @param ids 分P列表数据，当切P时间发生时对应数据将发送给您
     * @param currentId 当前P在`ids`中的索引
     */
    update(ids: any[], currentIndex: number) {
        this.ids = ids;
        this.currentIndex = currentIndex;
        (ids.length > 1 && currentIndex + 1 < ids.length) ? this.show() : this.hide();
    }

    private show = () => {
        this.classList.toggle('hidden', false);
    }

    private hide = () => {
        this.classList.toggle('hidden', true);
    }

    private toggle = () => {
        this.classList.toggle('hidden');
    }

    private previousTrack = () => {
        const i = --this.currentIndex;
        if (this.ids[i]) {
            ev.trigger(PLAYER_EVENT.CALL_NEXT_PAGE, this.ids[i]);
        } else {
            ++this.currentIndex;
        }
    }

    private nextTrack = () => {
        const i = ++this.currentIndex;
        if (this.ids[i]) {
            ev.trigger(PLAYER_EVENT.CALL_NEXT_PAGE, this.ids[i]);
            if (i + 1 >= this.ids.length) {
                this.hide()
            }
        } else {
            --this.currentIndex;
        }
    }

    private identify = () => {
        this.ids.length = 0;
        this.currentIndex = 0;
        this.hide();
    }
}