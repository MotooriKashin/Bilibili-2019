import { Player } from "../..";
import svg_24subtitle from "../../../assets/svg/24subtitle.svg";
import svg_24subtitleon from "../../../assets/svg/24subtitleon.svg";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { ev, PLAYER_EVENT } from "../../event";
import { options } from "../../option";
import { Checkbox } from "../../widget/checkbox";
import { Color } from "../../widget/color";
import { Slider } from "../../widget/slider";

/** 字幕控制 */
@customElement('label')
export class Subtitle extends HTMLLabelElement {

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

    /** 浮动面板 */
    #wrap = Element.add('div', { class: 'bofqi-subtitle-wrap' });

    /** 字幕选择 */
    private $select = Element.add('select', { class: ['bofqi-subtitle-select', 'bpui-select'], appendTo: this.#wrap });

    /** 下载按钮 */
    private $download = Element.add('button', { class: 'bpui-button', appendTo: this.#wrap, innerText: '下载' });

    /** 字体大小 */
    private $fontSize = this.#wrap.appendChild(new Slider());

    /** 等比缩放 */
    private $scale = this.#wrap.appendChild(new Checkbox());

    private $colorButton = Element.add('button', { class: 'closed-caption-color', appendTo: this.#wrap });

    /** 字幕颜色 */
    private $color = new Color(this.$colorButton, '--closed-caption-color');

    /** 字幕描边 */
    private $shadow = Element.add('select', { class: 'bpui-select', appendTo: this.#wrap });

    /** 字体 */
    private $font = Element.add('select', { class: 'bpui-select', appendTo: this.#wrap });

    /** 背景不透明度 */
    private $opacity = this.#wrap.appendChild(new Slider());

    /** 已有字幕文件 */
    private $files: Record<string, ITrack> = {};

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-area-control-btn', 'bofqi-area-subtitle');
        this.innerHTML = svg_24subtitle + svg_24subtitleon;

        this.$select.insertAdjacentHTML('beforebegin', `<div class="bofqi-subtitle-title">字幕</div>`);
        this.$fontSize.insertAdjacentHTML('beforebegin', `<div class="bofqi-subtitle-title">字体大小</div>`);
        this.$opacity.insertAdjacentHTML('beforebegin', `<div class="bofqi-subtitle-title">背景不透明度</div>`);
        this.$colorButton.insertAdjacentHTML('beforebegin', `<hr><span>字幕颜色</span>`);
        this.$shadow.insertAdjacentHTML('beforebegin', `<hr><span>字幕描边</span>`);
        this.$font.insertAdjacentHTML('beforebegin', `<hr><span>字幕字体</span>`);

        this.classList.add('disabled');
        this.$fontSize.$max = 4;
        this.$fontSize.$hint = true;
        this.$scale.$text = '等比缩放';
        this.$shadow.dataset.label = '字幕描边';
        this.$shadow.innerHTML = `<option>无描边</option>
<option style="text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px, #000 -1px 0px 1px">重墨</option>
<option style="text-shadow: #000 0px 0px 1px, #000 0px 0px 1px ,#000 0px 0px 1px">描边</option>
<option style="text-shadow: #000 1px 1px 2px, #000 0px 0px 1px">45°投影</option>`;
        this.$font.innerHTML = `<option style="font-family: inherit" value="inherit">默认</option>
<option style="font-family: SimSun" value="SimSun">宋体</option>
<option style="font-family: FangSong" value="FangSong">仿宋</option>
<option style="font-family: &quot;Microsoft YaHei&quot;" value="Microsoft YaHei">微软雅黑</option>
<option style="font-family: &quot;Microsoft YaHei Light&quot;" value="Microsoft YaHei Light">微软雅黑 Light</option>
<option style="font-weight: bold;">...</option>`;
        this.$opacity.$hint = true;
        this.$opacity.$step = 5;

        ev.bind(PLAYER_EVENT.VIDEO_DESTORY, this.identify);
        ev.one(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { fontFamily, fontFamilyCustom } = detail.subtile;
            if (fontFamilyCustom) {
                const [fullName, family] = fontFamilyCustom;
                Element.add('option', { style: { fontFamily: family }, attribute: { value: family }, appendTo: this.$font, innerText: fullName });
                this.$font.value = family;
            }
            this.$font.value = fontFamily || '默认';
        });
        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { fontSize, scale, color, shadow, opacity, fontFamily } = detail.subtile;
            switch (fontSize) {
                case 0.6: {
                    this.$fontSize.$value = 0;
                    this.$fontSize.$hintValue = '极小';
                    break
                }
                case 0.8: {
                    this.$fontSize.$value = 1;
                    this.$fontSize.$hintValue = '0.5';
                    break
                }
                case 1.3: {
                    this.$fontSize.$value = 3;
                    this.$fontSize.$hintValue = '1.5';
                    break
                }
                case 1.6: {
                    this.$fontSize.$value = 4;
                    this.$fontSize.$hintValue = '极大';
                    break
                }
                default: {
                    this.$fontSize.$value = 2;
                    this.$fontSize.$hintValue = '适中';
                    break
                }
            }
            this.$scale.$value = scale;
            this.#wrap.style.setProperty('--caption-color', this.$color.$value = color || '#ffffff');
            this.$shadow.value = shadow || '无描边';
            this.$opacity.$value = <any>opacity ?? '100';
            this.$font.value = fontFamily || '默认';
        });
        ev.bind(PLAYER_EVENT.VTT_FILE_LOAD, ({ detail }) => { this.load(detail) });

        this.addEventListener('click', () => {
            if (!player.$video.$track.$hasTrack && this.$files[this.$select.value]) {
                const file = this.$files[this.$select.value];
                player.$video.$track.attach(
                    file.src,
                    file.srclang,
                    file.label
                );
                player.$video.$track.show();
            } else {
                player.$video.$track.toggle();
            }
            this.classList.toggle('on', player.$video.$track.track.mode === 'showing');
        });
        this.#wrap.addEventListener('click', e => {
            e.stopPropagation();
        });
        this.$select.addEventListener('change', () => {
            if (this.$files[this.$select.value]) {
                const file = this.$files[this.$select.value];
                player.$video.$track.attach(
                    file.src,
                    file.srclang,
                    file.label
                );
                player.$video.$track.show();
            }
            this.classList.toggle('on', player.$video.$track.track.mode === 'showing');
        });
        this.$download.addEventListener('click', () => {
            const file = this.$files[this.$select.value];
            if (file) {
                showSaveFilePicker({
                    suggestedName: `${file.label}.vtt`,
                    types: [
                        {
                            description: 'WebVTT',
                            accept: {
                                'text/vtt': ['.vtt'],
                            }
                        }
                    ],
                })
                    .then(d => d.createWritable())
                    .then(d => {
                        fetch(file.src).then(d => d.blob()).then(e => d.write(e)).finally(() => { d.close() })
                    }).catch(e => {
                        toastr.error(e);
                        console.error(e);
                    });
            }
        });
        this.$fontSize.addEventListener('change', () => {
            switch (this.$fontSize.$value) {
                case 0: {
                    options.subtile.fontSize = 0.6;
                    break;
                }
                case 1: {
                    options.subtile.fontSize = 0.8;
                    break;
                }
                case 3: {
                    options.subtile.fontSize = 1.3;
                    break;
                }
                case 4: {
                    options.subtile.fontSize = 1.6;
                    break;
                }
                default: {
                    options.subtile.fontSize = 1;
                    break;
                }
            }
        });
        this.$scale.addEventListener('click', () => {
            // 修改等比缩放
            options.subtile.scale = this.$scale.$value;
        });
        this.$color.addEventListener('change', () => {
            // 修改字幕颜色
            options.subtile.color = this.$color.$value;
        });
        this.$shadow.addEventListener('change', () => {
            // 更新描边
            options.subtile.shadow = this.$shadow.value;
        });
        this.$font.addEventListener('change', () => {
            // 更改字体
            if (this.$font.value === '...') {
                this.$font.value = options.subtile.fontFamily;
                queryLocalFonts()
                    .then(d => {
                        const popover = document.createElement('div');
                        popover.popover = 'auto';
                        popover.classList.add('popover-local-font');
                        this.append(popover);
                        d.forEach(({ family, fullName }) => {
                            if (/[\p{L}&&\p{Script=Han}]/v.test(fullName)) {
                                const button = document.createElement('button');
                                button.textContent = fullName;
                                button.style.fontFamily = family;
                                button.addEventListener('click', e => {
                                    e.stopPropagation();
                                    options.subtile.fontFamilyCustom = [fullName, family];
                                    options.subtile.fontFamily = family;
                                    Element.add('option', { style: { fontFamily: family }, attribute: { value: family }, appendTo: this.$font, innerText: fullName });
                                    this.$font.value = family;
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
                options.subtile.fontFamily = this.$font.value;
            }
        });
        this.$opacity.addEventListener('change', () => {
            // 更新背景透明度
            options.subtile.opacity = +this.$opacity.$value;
        });
    }

    /**
     * 加载字幕到播放器
     * 
     * @param file 字幕文件
     */
    load(file: File) {
        if (!(file.name in this.$files)) {
            this.$files[file.name] = {
                srclang: navigator.language,
                src: URL.createObjectURL(file),
                label: file.name.replace(/\.vtt$/g, '')
            }
            Element.add('option', { attribute: { value: file.name }, appendTo: this.$select, innerText: file.name });
            this.classList.remove('disabled');
        }
    }

    private identify = () => {
        Object.values(this.$files).forEach(d => {
            // 释放URL对象引用
            if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(d.src)) {
                URL.revokeObjectURL(d.src);
            }
        })
        this.$files = {};
        this.#player.$video.$track.identify();
        this.classList.remove('on');
        this.classList.add('disabled');
    }
}

interface ITrack {

    srclang: string;

    src: string;

    label: string;
}