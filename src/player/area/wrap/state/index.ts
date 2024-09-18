import { Player } from "../../..";
import svg_play_state from "../../../../assets/svg/play-state.svg";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";

/** 播放状态 */
@customElement('div')
export class State extends HTMLDivElement {

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
    // connectedCallback() { }

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    #preTime = 0;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-state');

        player.$video.addEventListener('play', () => {
            this.$play.classList.toggle('on', player.$video.paused);
            this.$buff.classList.toggle('on', false);
        });
        player.$video.addEventListener('playing', () => {
            this.$play.classList.toggle('on', player.$video.paused);
            this.$buff.classList.toggle('on', false);
        });
        player.$video.addEventListener('pause', () => {
            this.$play.classList.toggle('on', player.$video.paused);
            this.$buff.classList.toggle('on', false);
        });
        player.$video.addEventListener('ended', () => {
            this.$play.classList.toggle('on', player.$video.paused);
            this.$buff.classList.toggle('on', false);
        });
        player.$video.addEventListener('emptied', () => {
            this.$play.classList.toggle('on', player.$video.paused);
            this.$buff.classList.toggle('on', false);
        });
        player.$video.addEventListener('waiting', () => {
            this.$buff.classList.toggle('on', true);
        });
        player.$video.addEventListener('timeupdate', () => {
            const time = Math.floor(player.$video.currentTime);
            if (this.#preTime !== time) {
                this.$buff.classList.toggle('on', false);
                this.#preTime = time;
            }
        });
    }

    private $play = Element.add('div', { class: 'bofqi-state-play', appendTo: this, innerHTML: svg_play_state });

    private $buff = Element.add('div', { class: 'bofqi-state-buff', appendTo: this });
}