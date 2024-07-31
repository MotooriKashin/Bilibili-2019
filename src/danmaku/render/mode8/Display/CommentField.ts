import { Format } from "../../../../utils/fomat";
import { IDisplay } from "./Display";
import { DisplayObject } from "./DisplayObject";
import { TextFormat } from "./TextFormat";

export class CommentField extends DisplayObject<HTMLDivElement> {

    /** 如果设置为 true 且文本字段没有焦点，Flash Player 将以灰色突出显示文本字段中的所选内容。 */

    get align() {
        return this.defaultTextFormat.align;
    }

    set align(value) {
        this.defaultTextFormat.align = value;
        this.$host.style.textAlign = value;
    }

    alwaysShowSelection = false;

    #background = false;

    /** 指定文本字段是否具有背景填充。 */
    get background() {
        return this.#background;
    }

    set background(value) {
        this.#background = value;
        if (value) {
            this.$host.style.backgroundColor = Format.hexColor(this.#backgroundColor)
        } else {
            this.$host.style.backgroundColor = '';
        }
    }

    #backgroundColor = 0;

    /** 文本字段背景的颜色。 */
    get backgroundColor() {
        return this.#backgroundColor;
    }

    set backgroundColor(value) {
        this.#backgroundColor = value;
        this.background = true;
    }

    #border = false;

    /** 指定文本字段是否具有边框。 */
    get border() {
        return this.#border;
    }

    set border(value) {
        this.#border = value;
        if (value) {
            const shadowColor = Format.hexColor(this.#borderColor);
            this.$host.style.textShadow = `1px 0 1px ${shadowColor},0 1px 1px ${shadowColor},0 -1px 1px ${shadowColor},-1px 0 1px ${shadowColor}`;
        } else {
            this.$host.style.borderColor = '';
        }
    }

    #borderColor = 0xffffff;

    /** 文本字段边框的颜色。 */
    get borderColor() {
        return this.#borderColor;
    }

    set borderColor(value) {
        this.#borderColor = value;
        this.border = true;
    }

    /** 一个整数（从 1 开始的索引），指示指定文本字段中当前可以看到的最后一行。 */
    readonly bottomScrollV = 1;

    #condenseWhite = false;

    /** 一个布尔值，指定是否删除具有 HTML 文本的文本字段中的额外空白（空格、换行符等等）。 */
    get condenseWhite() {
        return this.#condenseWhite;
    }

    set condenseWhite(value) {
        this.#condenseWhite = value;
        this.text = this.$text;
    }

    /** 指定应用于新插入文本（例如，用户输入的文本或使用 replaceSelectedText() 方法插入的文本）的格式。 */
    defaultTextFormat = new TextFormat();

    /**
     * 用于此文本字段的网格固定类型。
     * @deprecated 暂未实现
     */
    gridFitType = '';

    /** 包含文本字段内容的 HTML 表示形式。 */
    get htmlText() {
        return this.text;
    }

    set htmlText(text: string) {
        this.text = this.$text = text;
    }

    /** 文本字段中的字符数。 */
    get length() {
        return this.$text.length;
    }

    /** 指示字段是否为多行文本字段。 */
    multiline = true;

    /** 定义多行文本字段中的文本行数。 */
    numLines = 1;

    /**
     * 指示用户可输入到文本字段中的字符集。
     * @deprecated 暂未实现
     */
    restrict = '';

    /**
     * 此文本字段中字型边缘的清晰度。
     * @deprecated 暂未实现
     */
    sharpness = 1;

    /** 作为文本字段中当前文本的字符串。 */
    get text() {
        return this.$text;
    }

    set text(value) {
        value = String(value);
        this.$text = value;
        value = value.replace(/<\/?[^>]+(>|$)/g, '');
        if (this.#condenseWhite) {
            value = value.trim();
        }
        this.$host.innerText = value;
    }

    /** 文本字段中文本的颜色（采用十六进制格式）。 */
    get color() {
        return this.defaultTextFormat.color;
    }

    set color(value) {
        if (value) {
            this.defaultTextFormat.color = value;
            this.$host.style.color = Format.hexColor(value);
            if (value <= 16) {
                this.$host.style.textShadow = "0 0 1px #fff";
            } else {
                this.$host.style.textShadow = "";
            };
        }
    }

    /** 文本字段中文本的颜色（采用十六进制格式）。 */
    get textColor() {
        return this.defaultTextFormat.color;
    }

    set textColor(value) {
        this.color = value;
    }

    /** 文本的高度，以像素为单位。 */
    get textHeight() {
        return this.$host.getBoundingClientRect().height;
    }

    /** 文本的宽度，以像素为单位。 */
    get textWidth() {
        return this.$host.getBoundingClientRect().width;
    }

    /**
     * 此文本字段中字型边缘的粗细。
     * @deprecated 暂未实现
     */
    thickness = 1;

    /**
     * 一个布尔值，指示文本字段是否自动换行。
     * @deprecated 暂未实现
     */
    wordWrap = false;

    get font() {
        return this.defaultTextFormat.font;
    }

    set font(value) {
        this.defaultTextFormat.font = value;
        this.$host.style.fontFamily = value;
    }

    /** 此文本字段中字型的大小。 */
    get fontsize() {
        return this.defaultTextFormat.size;
    }

    set fontsize(value) {
        this.defaultTextFormat.size = value;
        this.$host.style.fontSize = value + 'px';
    }

    /** 一个布尔值，指示文本字是否粗体。 */
    get bold() {
        return this.defaultTextFormat.bold;
    }

    set bold(value) {
        this.defaultTextFormat.bold = value;
        this.$host.style.fontWeight = value ? 'bold' : '';
    }

    get italic() {
        return this.defaultTextFormat.italic;
    }

    set italic(value) {
        this.defaultTextFormat.italic = value;
        if (value) {
            this.$host.style.fontStyle = 'italic';
        } else {
            this.$host.style.fontStyle = '';
        }
    }

    get underline() {
        return this.defaultTextFormat.underline;
    }

    set underline(value) {
        this.defaultTextFormat.underline = value;
        this.$host.style.textDecoration = 'underline';
    }

    get margin() {
        return this.defaultTextFormat.margin;
    }

    set margin(value) {
        this.defaultTextFormat.margin = value;
        this.$host.style.margin = value;
    }

    constructor(private $text: string, param: IDisplay) {
        super(param);
        this.$host.classList.add('cmt');
        this.$host.style.cssText = `position: absolute; transform-origin: 0 0 0`;
        this.textColor = param.color || this.defaultTextFormat.color;
        this.font = this.defaultTextFormat.font;
        this.fontsize = param.fontsize || this.defaultTextFormat.size;
        this.text = $text || '';
        this.borderColor = this.defaultTextFormat.color !== 0 ? 0 : 0xffffff;
        this.border = true;
        this.init();
        if (!param.lifeTime && this.$delay) {
            // 对于没有设定生存时间的弹幕，在所有动画结束后移除
            setTimeout(() => { this.remove() }, Math.max(this.$delay, 1000));
        }
    }

    /**
     * 将 newText 参数指定的字符串追加到文本字段的文本的末尾。
     * 此方法要比对 text 属性的加法赋值 (+=)（如 someTextField.text += moreText）更有效，对于包含大量内容的文本字段尤其有效。
     * 
     * @param newText 要追加到现有文本末尾的字符串。
     */
    appendText(newText: string) {
        this.$text += newText;
        this.text = this.$text;
    }

    getTextFormat() {
        return this.defaultTextFormat;
    }

    setTextFormat(value: TextFormat) {
        this.defaultTextFormat = value;
        this.bold = this.defaultTextFormat.bold;
        this.textColor = this.defaultTextFormat.color;
        this.font = this.defaultTextFormat.font;
        this.fontsize = this.defaultTextFormat.size;
        this.italic = this.defaultTextFormat.italic;
        this.underline = this.defaultTextFormat.underline;
        this.margin = this.defaultTextFormat.margin;
    }
}