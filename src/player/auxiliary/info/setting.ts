import { Player } from "../..";
import svg_24setting from "../../../assets/svg/24setting.svg";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { ev, PLAYER_EVENT } from "../../event";
import { options } from "../../option";
import { Checkbox } from "../../widget/checkbox";
import { Slider } from "../../widget/slider";

/** 播放器设置 */
@customElement('button')
export class Setting extends HTMLButtonElement {

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

    /** 每当元素添加到文档中时调用。 */
    connectedCallback() {
        this.insertAdjacentElement('afterend', this.#wrap);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.#wrap.remove();
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #player: Player;

    #wrap = Element.add('div', { class: 'bofqi-setting-wrap' });

    #header = Element.add('header', { appendTo: this.#wrap, innerText: '播放器设置' });

    $list = Element.add('div', { class: 'bofqi-setting', appendTo: this.#wrap });

    #danamku = Element.add('div', { class: 'bofqi-setting-title', appendTo: this.$list, innerText: '弹幕设置' });

    #opacityContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list, data: { label: '弹幕不透明度' } });
    /** 弹幕不透明度 */
    #opacity = this.#opacityContent.appendChild(new Slider());

    #speedPlusContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list, data: { label: '弹幕速度' } });
    /** 弹幕速度 */
    #speedPlus = this.#speedPlusContent.appendChild(new Slider());

    #danmakuNumberContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list, data: { label: '同屏弹幕密度' } });
    /** 同屏弹幕密度 */
    #danmakuNumber = this.#danmakuNumberContent.appendChild(new Slider());

    #fontSizeContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list, data: { label: '字号缩放' } });
    /** 字号缩放 */
    #fontSize = this.#fontSizeContent.appendChild(new Slider());

    #fullScreenSyncContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list });
    /** 弹幕等比缩放 */
    #fullScreenSync = this.#fullScreenSyncContent.appendChild(new Checkbox());

    #mode7Content = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list });
    /** mode7 自适应 */
    #mode7 = this.#mode7Content.appendChild(new Checkbox());

    #fontBorderSyncContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list, data: { label: '边框样式' } });
    /** 边框样式 */
    #fontBorder = Element.add('form', { class: 'bofqi-setting-font-border', appendTo: this.#fontBorderSyncContent });

    #fontFamilySyncContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list, data: { label: '弹幕字体' } });
    /** 弹幕字体 */
    #fontFamily = Element.add('select', { class: 'bpui-select', appendTo: this.#fontFamilySyncContent });

    #sameAsPanelContent = Element.add('div', { class: ['bofqi-setting-content', 'compact'], appendTo: this.$list });
    /** 应用到界面字体 */
    #sameAsPanel = this.#sameAsPanelContent.appendChild(new Checkbox());

    #boldContent = Element.add('div', { class: ['bofqi-setting-content', 'compact'], appendTo: this.$list });
    /** 粗体 */
    #bold = this.#boldContent.appendChild(new Checkbox());

    #preventShadeContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list });
    /** 防挡字幕 */
    #preventShade = this.#preventShadeContent.appendChild(new Checkbox());

    #typeContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list, data: { label: '渲染类型' } });
    /** 渲染类型 */
    #type = Element.add('select', { class: 'bpui-select', appendTo: this.#typeContent });

    #speedSyncContent = Element.add('div', { class: 'bofqi-setting-content', appendTo: this.$list });
    /** 弹幕速度同步播放倍速 */
    #speedSync = this.#speedSyncContent.appendChild(new Checkbox());

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-info-setting');
        this.innerHTML = svg_24setting;

        this.#wrap.popover = 'auto';
        this.popoverTargetElement = this.#wrap;

        this.#opacity.$hint = true;
        this.#opacity.formatHint(v => {
            return Math.floor(+v) + '%';
        });
        this.#speedPlus.$max = 200;
        this.#speedPlus.$step = 10;
        this.#speedPlus.$hint = true;
        this.#speedPlus.formatHint(v => {
            return Math.floor(+v) + '%';
        });
        this.#danmakuNumber.$max = 105;
        this.#danmakuNumber.$hint = true;
        this.#danmakuNumber.formatHint(v => {
            switch (+v) {
                case 101: return '200';
                case 102: return '300';
                case 103: return '400';
                case 104: return '500';
                case 105: return '无限制';
                default: return v;
            }
        });
        this.#fontSize.$max = 200;
        this.#fontSize.$step = 10;
        this.#fontSize.$hint = true;
        this.#fontSize.formatHint(v => {
            return Math.floor(+v) + '%';
        });
        this.#fullScreenSync.$text = '弹幕等比缩放';
        this.#mode7.$text = '高级弹幕(mode=7)自适应';
        const id = crypto.randomUUID();
        this.#fontBorder.innerHTML = `<label><input type="radio" name=${id} value="0">重墨</label>
<label><input type="radio" name=${id} value="1">描边</label>
<label><input type="radio" name=${id} value="2">45°投影</label>`;
        this.#fontFamily.innerHTML = `<option style="font-family: SimHei, Microsoft JhengHei" value="SimHei, Microsoft JhengHei">默认</option>
<option style="font-family: SimSun" value="SimSun">宋体</option>
<option style="font-family: FangSong" value="FangSong">仿宋</option>
<option style="font-family: &quot;Microsoft YaHei&quot;" value="Microsoft YaHei">微软雅黑</option>
<option style="font-family: &quot;Microsoft YaHei Light&quot;" value="Microsoft YaHei Light">微软雅黑 Light</option>
<option style="font-weight: bold;">...</option>`;
        this.#sameAsPanel.$text = '应用到界面字体';
        this.#sameAsPanel.$disabled = true;
        this.#bold.$text = '粗体';
        this.#preventShade.$text = '防挡字幕';
        this.#type.innerHTML = `<option>CSS3</option><option>Canvas</option>`;
        this.#type.disabled = true;
        this.#speedSync.$text = '弹幕速度同步播放倍速';

        ev.one(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { fontFamily, fontFamilyCustom } = detail.danmaku;
            if (fontFamilyCustom) {
                const [fullName, family] = fontFamilyCustom;
                const option = document.createElement('option');
                option.style.fontFamily = family;
                option.value = family;
                option.text = fullName;
                this.#fontFamily.appendChild(option);
                this.#fontFamily.value = family;
            }
            this.#fontFamily.value = fontFamily || '默认';
        });
        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { opacity, speedPlus, danmakuNumber, fontSize, fullScreenSync, fontBorder, fontFamily, bold, preventShade, speedSync, mode7Scale } = detail.danmaku;

            this.#opacity.$value = <any>Math.max(1, Math.min(100, opacity * 100));
            this.#speedPlus.$value = <any>Math.max(10, Math.min(200, speedPlus * 100));
            switch (danmakuNumber) {
                case 0: {
                    this.#danmakuNumber.$value = 105;
                    break;
                }
                case 200: {
                    this.#danmakuNumber.$value = 101;
                    break;
                }
                case 300: {
                    this.#danmakuNumber.$value = 102;
                    break;
                }
                case 400: {
                    this.#danmakuNumber.$value = 103;
                    break;
                }
                case 500: {
                    this.#danmakuNumber.$value = 104;
                    break;
                }
                default: {
                    this.#danmakuNumber.$value = <any>Math.max(1, Math.min(100, danmakuNumber));
                    break;
                }
            }
            this.#fontSize.$value = <any>Math.max(10, Math.min(200, fontSize * 100));
            this.#fullScreenSync.$value = fullScreenSync;
            this.#mode7.$value = mode7Scale;
            const fb = this.#fontBorder.querySelector<HTMLInputElement>(`[value="${fontBorder}"]`);
            fb && (fb.checked = true);
            this.#fontFamily.value = fontFamily || '默认';
            this.#bold.$value = bold;
            this.#preventShade.$value = preventShade;
            this.#speedSync.$value = speedSync;
        });

        this.#opacity.addEventListener('change', () => {
            options.danmaku.opacity = Math.max(0.01, Math.min(1, +this.#opacity.$value / 100));
        });
        this.#speedPlus.addEventListener('change', () => {
            options.danmaku.speedPlus = Math.max(0.1, Math.min(2, +this.#speedPlus.$value / 100));
        });
        this.#danmakuNumber.addEventListener('change', () => {
            const value = this.#danmakuNumber.$value;
            switch (value) {
                case 101: {
                    options.danmaku.danmakuNumber = 200;
                    break;
                }
                case 102: {
                    options.danmaku.danmakuNumber = 300;
                    break;
                }
                case 103: {
                    options.danmaku.danmakuNumber = 400;
                    break;
                }
                case 104: {
                    options.danmaku.danmakuNumber = 500;
                    break;
                }
                case 105: {
                    options.danmaku.danmakuNumber = 0;
                    break;
                }
                default: {
                    options.danmaku.danmakuNumber = Math.max(1, Math.min(100, +value));
                    break;
                }
            }
        });
        this.#fontSize.addEventListener('change', () => {
            options.danmaku.fontSize = Math.max(0.1, Math.min(2, +this.#fontSize.$value / 100));
        });
        this.#fullScreenSync.addEventListener('change', () => {
            options.danmaku.fullScreenSync = this.#fullScreenSync.$value;
        });
        this.#mode7Content.addEventListener('change', () => {
            options.danmaku.mode7Scale = this.#mode7.$value;
        });
        this.#fontBorder.addEventListener('change', () => {
            const form = new FormData(this.#fontBorder);
            options.danmaku.fontBorder = +[...form.values()][0];
        });
        this.#fontFamily.addEventListener('change', () => {
            // 更改字体
            if (this.#fontFamily.value === '...') {
                this.#fontFamily.value = options.danmaku.fontFamily;
                queryLocalFonts()
                    .then(d => {
                        const popover = document.createElement('div');
                        popover.popover = 'auto';
                        popover.classList.add('popover-local-font');
                        this.append(popover);
                        d.forEach(({ fullName, family }) => {
                            if (/[\p{L}&&\p{Script=Han}]/v.test(fullName)) {
                                const button = document.createElement('button');
                                button.textContent = fullName;
                                button.style.fontFamily = family;
                                button.addEventListener('click', e => {
                                    e.stopPropagation();
                                    options.danmaku.fontFamilyCustom = [fullName, family];
                                    options.danmaku.fontFamily = family;
                                    const option = document.createElement('option');
                                    option.style.fontFamily = family;
                                    option.value = family;
                                    option.text = fullName;
                                    this.#fontFamily.appendChild(option);
                                    this.#fontFamily.value = family;
                                    popover.hidePopover();
                                })
                                popover.appendChild(button);
                            }
                        });
                        popover.addEventListener('toggle', () => {
                            popover.matches(":popover-open") || popover.remove();
                        });
                        popover.showPopover();
                    })
                    .catch(e => {
                        toastr.error(e);
                        console.log(e);
                    });
            } else {
                options.danmaku.fontFamily = this.#fontFamily.value;
            }
        });
        this.#bold.addEventListener('change', () => {
            options.danmaku.bold = this.#bold.$value;
        });
        this.#preventShade.addEventListener('change', () => {
            options.danmaku.preventShade = this.#preventShade.$value;
        });
        this.#speedSync.addEventListener('change', () => {
            options.danmaku.speedSync = this.#speedSync.$value;
        });
    }
}