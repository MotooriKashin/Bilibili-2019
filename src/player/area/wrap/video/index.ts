import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";
import { Context } from "../../../widget/context";
import { Slider } from "../../../widget/slider";
import { Statistic } from "./statistic";

/** 播放器节点 */
@customElement('video')
class Video extends HTMLVideoElement {

    /**
     * 需要监听变动的属性。
     * 与实例方法`attributeChangedCallback`配合使用。
     * 此字符串序列定义了`attributeChangedCallback`回调时的第一个参数的可能值。
     */
    static observedAttributes = ['src', 'loop'];

    /**
     * 在属性更改、添加、移除或替换时调用。
     * 需要与静态属性`observedAttributes`配合使用。
     * 此回调的第一个参数在`observedAttributes`数组中定义。
     */
    attributeChangedCallback(name: 'src' | 'loop', oldValue: string, newValue: string) {
        switch (name) {
            case 'src': {
                // 更新播放源
                if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(oldValue)) {
                    URL.revokeObjectURL(oldValue);
                }
                break;
            }
            case 'loop': {
                // 是否循环播放
                this.dispatchEvent(new Event('loopchange'));
                break;
            }
            default: {
                break;
            }
        }
    }

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    /** 右键菜单 */
    private $context = new Context(this);

    /** 播放速度 */
    private $playbackRate = Element.add('li', { class: 'context-playback-rate' }, this.$context);

    /** 播放速率 */
    private $inputRate = this.$playbackRate.appendChild(new Slider());

    /** 画面比例 */
    private $ratio = Element.add('li', { class: 'context-playback-ratio' }, this.$context);

    private $ratioToggle = Element.add('div', undefined, this.$ratio);

    /** 画面比例：默认 */
    private $ratio1 = Element.add('button', { class: 'bpui-button' }, this.$ratioToggle);

    /** 画面比例：4:3 */
    private $ratio43 = Element.add('button', { class: 'bpui-button' }, this.$ratioToggle);

    /** 画面比例：16:9 */
    private $ratio169 = Element.add('button', { class: 'bpui-button' }, this.$ratioToggle);

    /** 关灯 */
    private $deglim = Element.add('li', { class: 'context-playback-deglim' }, this.$context);

    /** 镜像 */
    private $mirror = Element.add('li', { class: 'context-playback-mirror' }, this.$context);

    /** 更新历史 8c739d8a */
    private $history = Element.add('li', { class: 'context-playback-history' }, this.$context);

    /** 视频统计信息 */
    private $statistic = Element.add('li', { class: 'context-playback-statistic' }, this.$context);

    /** 视频统计信息面板 */
    private $statistics = new Statistic();

    constructor() {
        super();

        this.$context.classList.add('bofqi-video-context-menu', 'black');
        this.$inputRate.min = '0.25';
        this.$inputRate.step = '0.25';
        this.$inputRate.max = '5';
        this.$inputRate.defaultValue = '1';
        this.$inputRate.$hint = true;
        this.$inputRate.classList.add('label');
        this.$ratio1.textContent = '默认';
        this.$ratio1.classList.add('text-only');
        this.$ratio1.classList.add('active');
        this.$ratio43.textContent = '4:3';
        this.$ratio43.classList.add('text-only');
        this.$ratio169.textContent = '16:9';
        this.$ratio169.classList.add('text-only');
        this.$deglim.dataset.value = '关灯';

        this.addEventListener('ratechange', () => {
            this.$inputRate.$value = <any>this.playbackRate;
        });
        this.addEventListener('loadedmetadata', () => {
            this.$inputRate.$value = <any>this.playbackRate;
        });
        this.$inputRate.addEventListener('change', () => {
            this.playbackRate = +this.$inputRate.$value;
        });
        this.$inputRate.addEventListener('click', e => {
            e.stopPropagation();
        });
        this.$ratio1.addEventListener('click', () => {
            this.style.removeProperty('--aspect-ratio');
            this.$ratio1.classList.add('active');
            this.$ratio43.classList.remove('active');
            this.$ratio169.classList.remove('active');
        });
        this.$ratio43.addEventListener('click', () => {
            this.style.setProperty('--aspect-ratio', '4 / 3');
            this.$ratio1.classList.remove('active');
            this.$ratio43.classList.add('active');
            this.$ratio169.classList.remove('active');
        });
        this.$ratio169.addEventListener('click', () => {
            this.style.setProperty('--aspect-ratio', '16 / 9');
            this.$ratio1.classList.remove('active');
            this.$ratio43.classList.remove('active');
            this.$ratio169.classList.add('active');
        });
        this.$deglim.addEventListener('click', () => {
            this.$deglim.dataset.value = document.body.classList.toggle('deglim') ? '开灯' : '关灯';
        });
        this.$mirror.addEventListener('click', () => {
            this.$mirror.classList.toggle('active', this.classList.toggle('mirror'));
        });
        this.$history.addEventListener('click', () => {
            self.open('/blackboard/webplayer_history.html#html5');
        });
        this.$statistic.addEventListener('click', () => {
            this.parentElement?.contains(this.$statistics) || this.parentElement?.appendChild(this.$statistics)
            this.$statistic.classList.toggle('active', this.$statistics.toggle());
        });
        this.$context.addEventListener('open', () => {
            this.$deglim.dataset.value = document.body.classList.contains('deglim') ? '开灯' : '关灯';
            this.$mirror.classList.toggle('active', this.classList.contains('mirror'));
            this.$statistic.classList.toggle('active', this.$statistics.classList.contains('active'));
        });
    }

    /**
     * 跳帧播放
     * 
     * @param cur 目标时间：/s
     */
    seek(t: number) {
        this.currentTime = t;
    }
}

/** 
 * 视频节点  
 * 作为播放器的核心组件，不是以属性而是以模块的形式提供，
 * 以便能够从任何地方访问。
 */
export const video = new Video();