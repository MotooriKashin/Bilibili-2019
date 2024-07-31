import { DANMAKU } from "../../../../danmaku/block";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";
import { ev, PLAYER_EVENT } from "../../../event-target";
import { options } from "../../../option";
import { POLICY } from "../../../policy";
import { Checkbox } from "../../../widget/checkbox";
import { Slider } from "../../../widget/slider";

/** 设置面版 */
@customElement('div')
export class SettingWrap extends HTMLDivElement {

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

    private $header = Element.add('header', undefined, this, '播放器设置');

    private $list = Element.add('div', { class: 'bofqi-setting' }, this);

    private $danamku = Element.add('div', { class: 'bofqi-setting-title' }, this.$list, '弹幕设置');

    private $opacityContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '弹幕不透明度' }, this.$list);
    /** 弹幕不透明度 */
    private $opacity = this.$opacityContent.appendChild(new Slider());

    private $speedPlusContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '弹幕速度' }, this.$list);
    /** 弹幕速度 */
    private $speedPlus = this.$speedPlusContent.appendChild(new Slider());

    private $danmakuNumberContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '同屏弹幕密度' }, this.$list);
    /** 同屏弹幕密度 */
    private $danmakuNumber = this.$danmakuNumberContent.appendChild(new Slider());

    private $fontSizeContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '字号缩放' }, this.$list);
    /** 字号缩放 */
    private $fontSize = this.$fontSizeContent.appendChild(new Slider());

    private $fullScreenSyncContent = Element.add('div', { class: 'bofqi-setting-content' }, this.$list);
    /** 弹幕等比缩放 */
    private $fullScreenSync = this.$fullScreenSyncContent.appendChild(new Checkbox());

    private $fontBorderSyncContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '边框样式' }, this.$list);
    /** 边框样式 */
    private $fontBorder = Element.add('form', { class: 'bofqi-setting-font-border' }, this.$fontBorderSyncContent);

    private $fontFamilySyncContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '弹幕字体' }, this.$list);
    /** 弹幕字体 */
    private $fontFamily = Element.add('select', { class: 'bpui-select' }, this.$fontFamilySyncContent);

    private $sameAsPanelContent = Element.add('div', { class: 'bofqi-setting-content compact' }, this.$list);
    /** 应用到界面字体 */
    private $sameAsPanel = this.$sameAsPanelContent.appendChild(new Checkbox());

    private $boldContent = Element.add('div', { class: 'bofqi-setting-content compact' }, this.$list);
    /** 粗体 */
    private $bold = this.$boldContent.appendChild(new Checkbox());

    private $preventShadeContent = Element.add('div', { class: 'bofqi-setting-content' }, this.$list);
    /** 防挡字幕 */
    private $preventShade = this.$preventShadeContent.appendChild(new Checkbox());

    private $typeContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '渲染类型' }, this.$list);
    /** 渲染类型 */
    private $type = Element.add('select', { class: 'bpui-select' }, this.$typeContent);

    private $speedSyncContent = Element.add('div', { class: 'bofqi-setting-content' }, this.$list);
    /** 弹幕速度同步播放倍速 */
    private $speedSync = this.$speedSyncContent.appendChild(new Checkbox());

    private $player = Element.add('div', { class: 'bofqi-setting-title' }, this.$list, '播放器设置');

    private $policyContent = Element.add('div', { class: 'bofqi-setting-content', 'data-label': '渲染类型' }, this.$list);
    /** 渲染类型 */
    private $policy = Element.add('select', { class: 'bpui-select' }, this.$policyContent);

    private $incognitoContent = Element.add('div', { class: 'bofqi-setting-content' }, this.$list);
    /** 弹幕速度同步播放倍速 */
    private $incognito = this.$incognitoContent.appendChild(new Checkbox());

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-setting');
        this.popover = 'auto';

        this.$opacity.min = '1';
        this.$opacity.$hint = true;
        this.$opacity.formatHint(v => {
            return Math.floor(+v) + '%';
        });
        this.$speedPlus.min = '10';
        this.$speedPlus.max = '200';
        this.$speedPlus.step = '10';
        this.$speedPlus.$hint = true;
        this.$speedPlus.formatHint(v => {
            return Math.floor(+v) + '%';
        });
        this.$danmakuNumber.min = '1';
        this.$danmakuNumber.max = '105';
        this.$danmakuNumber.$hint = true;
        this.$danmakuNumber.formatHint(v => {
            switch (v) {
                case '101': return '200';
                case '102': return '300';
                case '103': return '400';
                case '104': return '500';
                case '105': return '无限制';
                default: return v;
            }
        });
        this.$fontSize.min = '10';
        this.$fontSize.max = '200';
        this.$fontSize.step = '10';
        this.$fontSize.$hint = true;
        this.$fontSize.formatHint(v => {
            return Math.floor(+v) + '%';
        });
        this.$fullScreenSync.$text = '弹幕等比缩放';
        const id = crypto.randomUUID();
        this.$fontBorder.innerHTML = `<label><input type="radio" name=${id} value="0">重墨</label>
<label><input type="radio" name=${id} value="1">描边</label>
<label><input type="radio" name=${id} value="2">45°投影</label>`;
        this.$fontFamily.innerHTML = `<option style="font-family: SimHei, Microsoft JhengHei" value="SimHei, Microsoft JhengHei">默认</option>
<option style="font-family: SimSun" value="SimSun">宋体</option>
<option style="font-family: FangSong" value="FangSong">仿宋</option>
<option style="font-family: &quot;Microsoft YaHei&quot;" value="Microsoft YaHei">微软雅黑</option>
<option style="font-family: &quot;Microsoft YaHei Light&quot;" value="Microsoft YaHei Light">微软雅黑 Light</option>
<option style="font-weight: bold;">...</option>`;
        this.$sameAsPanel.$text = '应用到界面字体';
        this.$sameAsPanel.$disabled = true;
        this.$bold.$text = '粗体';
        this.$preventShade.$text = '防挡字幕';
        this.$type.innerHTML = `<option>CSS3</option><option>Canvas</option>`;
        this.$type.disabled = true;
        this.$speedSync.$text = '弹幕速度同步播放倍速';
        this.$player.insertAdjacentHTML('beforebegin', '<hr>');
        this.$policy.innerHTML = `<option value="${POLICY.AVC}">AVC</option>
<option value="${POLICY.HEVC}">HEVC</option>
<option value="${POLICY.AV1}">AV1</option>`;
        this.$incognito.$text = '无痕模式';

        ev.one(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { fontFamily, fontFamilyCustom } = detail.danmaku;
            if (fontFamilyCustom) {
                const [fullName, family] = fontFamilyCustom;
                Element.add('option', { style: `font-family: ${family}`, value: family }, this.$fontFamily, fullName);
                this.$fontFamily.value = family;
            }
            this.$fontFamily.value = fontFamily || '默认';
        });
        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { opacity, speedPlus, danmakuNumber, fontSize, fullScreenSync, fontBorder, fontFamily, bold, preventShade, speedSync } = detail.danmaku;

            this.$opacity.$value = <any>Math.max(1, Math.min(100, opacity * 100));
            this.$speedPlus.$value = <any>Math.max(10, Math.min(200, speedPlus * 100));
            switch (danmakuNumber) {
                case 0: {
                    this.$danmakuNumber.$value = '105';
                    break;
                }
                case 200: {
                    this.$danmakuNumber.$value = '101';
                    break;
                }
                case 300: {
                    this.$danmakuNumber.$value = '102';
                    break;
                }
                case 400: {
                    this.$danmakuNumber.$value = '103';
                    break;
                }
                case 500: {
                    this.$danmakuNumber.$value = '104';
                    break;
                }
                default: {
                    this.$danmakuNumber.$value = <any>Math.max(1, Math.min(100, danmakuNumber));
                    break;
                }
            }
            this.$fontSize.$value = <any>Math.max(10, Math.min(200, fontSize * 100));
            this.$fullScreenSync.$value = fullScreenSync;
            const fb = this.$fontBorder.querySelector<HTMLInputElement>(`[value="${fontBorder}"]`);
            fb && (fb.checked = true);
            this.$fontFamily.value = fontFamily || '默认';
            this.$bold.$value = bold;
            this.$preventShade.$value = preventShade;
            this.$speedSync.$value = speedSync;

            const { policy, incognito } = detail.player;
            this.$policy.value = <any>policy;
            this.$incognito.$value = incognito;
        });

        this.$opacity.addEventListener('change', () => {
            options.danmaku.opacity = Math.max(0.01, Math.min(1, +this.$opacity.$value / 100));
        });
        this.$speedPlus.addEventListener('change', () => {
            options.danmaku.speedPlus = Math.max(0.1, Math.min(2, +this.$speedPlus.$value / 100));
        });
        this.$danmakuNumber.addEventListener('change', () => {
            const value = this.$danmakuNumber.$value;
            switch (value) {
                case '101': {
                    options.danmaku.danmakuNumber = 200;
                    break;
                }
                case '102': {
                    options.danmaku.danmakuNumber = 300;
                    break;
                }
                case '103': {
                    options.danmaku.danmakuNumber = 400;
                    break;
                }
                case '104': {
                    options.danmaku.danmakuNumber = 500;
                    break;
                }
                case '105': {
                    options.danmaku.danmakuNumber = 0;
                    break;
                }
                default: {
                    options.danmaku.danmakuNumber = Math.max(1, Math.min(100, +value));
                    break;
                }
            }
        });
        this.$fontSize.addEventListener('change', () => {
            options.danmaku.fontSize = Math.max(0.1, Math.min(2, +this.$fontSize.$value / 100));
        });
        this.$fullScreenSync.addEventListener('change', () => {
            options.danmaku.fullScreenSync = this.$fullScreenSync.$value;
        });
        this.$fontBorder.addEventListener('change', () => {
            const form = new FormData(this.$fontBorder);
            options.danmaku.fontBorder = +[...form.values()][0];
        });
        this.$fontFamily.addEventListener('change', () => {
            // 更改字体
            if (this.$fontFamily.value === '...') {
                this.$fontFamily.value = options.danmaku.fontFamily;
                queryLocalFonts().then(d => {
                    const popover = document.createElement('div');
                    popover.popover = 'auto';
                    popover.classList.add('popover-local-font');
                    this.append(popover);
                    d.forEach(d => {
                        if (/[\p{L}&&\p{Script=Han}]/v.test(d.fullName)) {
                            const button = document.createElement('button');
                            button.textContent = d.fullName;
                            button.style.fontFamily = `"${d.family}"`;
                            button.addEventListener('click', e => {
                                e.stopPropagation();
                                options.danmaku.fontFamilyCustom = [d.fullName, d.family];
                                options.danmaku.fontFamily = d.family;
                                Element.add('option', { style: `font-family: ${d.family}`, value: d.family }, this.$fontFamily, d.fullName);
                                this.$fontFamily.value = d.family;
                                popover.hidePopover();
                            })
                            popover.appendChild(button);
                        }
                    });
                    popover.addEventListener('toggle', () => {
                        popover.matches(":popover-open") || popover.remove();
                    });
                    popover.showPopover();
                });
            } else {
                options.danmaku.fontFamily = this.$fontFamily.value;
            }
        });
        this.$bold.addEventListener('change', () => {
            options.danmaku.bold = this.$bold.$value;
        });
        this.$preventShade.addEventListener('change', () => {
            options.danmaku.preventShade = this.$preventShade.$value;
        });
        this.$speedSync.addEventListener('change', () => {
            options.danmaku.speedSync = this.$speedSync.$value;
        });
        this.$policy.addEventListener('change', () => {
            options.player.policy = +this.$policy.value;
        });
        this.$incognito.addEventListener('change', () => {
            options.player.incognito = this.$incognito.$value;
        });
    }
}