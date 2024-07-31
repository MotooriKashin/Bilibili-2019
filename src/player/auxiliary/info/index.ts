import { customElement } from "../../../utils/Decorator/customElement";
import { More } from "./more";
import { MoreWrap } from "./more/wrap";
import { Number } from "./number";
import { Setting } from "./setting";
import { SettingWrap } from "./setting/wrap";

/** 播放信息栏 */
@customElement('div')
export class Info extends HTMLDivElement {

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

    /** 弹幕数及播放人数信息 */
    $number = this.appendChild(new Number);

    /** 更多按钮 */
    $more = this.appendChild(new More());

    /** 更多设置面板 */
    $moreWrap = this.appendChild(new MoreWrap());

    /** 设置按钮 */
    $setting = this.appendChild(new Setting());

    /** 设置面版 */
    $settingWrap = this.appendChild(new SettingWrap());

    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-info');
        this.$more.popoverTargetElement = this.$moreWrap;
        this.$setting.popoverTargetElement = this.$settingWrap;
    }
}