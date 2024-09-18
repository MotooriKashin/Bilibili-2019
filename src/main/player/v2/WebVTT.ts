import { Format } from "../../../utils/fomat";

/** WebVTT */
export class WebVTT {

    private cue: VTTCue[] = [];

    constructor(
        /** 字幕标题 */
        private title?: string,
        /** 内嵌样式序列。禁止出现空白行或者连续换行 */
        private style?: string[],
    ) {
        style && (this.style = style.map(d => d.replace(/\n+/g, '\n')));
    }

    /** 字幕轴升序 */
    private sort() {
        this.cue.sort((a, b) => a.startTime > b.startTime ? 1 : -1);
    }

    /**
     * 添加字幕轴
     * 
     * @param cue 字幕轴
     */
    addCue(...cue: VTTCue[]) {
        this.cue.push(...cue);
    }

    /** 格式化为文本 */
    toJSON() {
        this.sort();
        return `WEBVTT${this.title ? ` ${this.title}` : ''}

${this.style ? `${this.style.join('\n\n')}` : ''}

${this.cue.map(d => d.toJSON()).join('\n\n')}

`;
    }
}

/** VTTCue */
export class VTTCue {

    constructor(
        /** 起始时间：秒 */
        public startTime: number,
        /** 消失时间：秒 */
        public endTime: number,
        /** 字幕文本 */
        public text: string,
        /** 
         * 注释文本。允许换行，但不允许连续换行（即空白行）  
         * 支持 HTML 标签：
         *    - `<c></c>` 使用 CSS 类对包含的文本进行样式设置。
         *      例如：`<c.classname>text</c>`
         *    - `<i></i>` 将包含的文本斜体化。
         *      例如：`<i>text</i>`
         *    - `<b></b>` 将包含的文本粗体化。
         *      例如：`<b>text</b>`
         *    - `<u></u>` 给包含的文本加下划线。
         *      例如：`<u>text</u>`
         *    - `<ruby></ruby>`和`<rt></rt>` 使用 ruby 文本标签展示 ruby 字符（注解字符）
         *      例如：`<ruby>WWW<rt>World Wide Web</rt>oui<rt>yes</rt></ruby>`
         *    - `<v></v>` 声音标签。与类标签类似，也用于使用 CSS 设置包含文本的样式。
         *      例如：`<v Bob>text</v>`
         *    - 时间戳标签
         *      时间戳必须大于 cue 开始的时间戳，大于在 cue 有效内容中任意之前的时间戳，并且小于 cue 结束的时间戳。
         *      活动的文本（active text）是指当前时间戳和下一个时间戳之间的文本或者如果有效内容中没有其他时间戳，则一直到有效内容末尾的文本。
         *      有效内容中活动的文本之前的任何文本都是之前已出现的文本（previous text）。
         *      活动的文本之后的文本都是未来即将出现的文本（future text）。
         *      例如：`When the moon <00:17.500>hits your eye`
         */
        public note?: string,
        /** 
         * 标识符是标识 cue 的名称。
         * 它可以从一个脚本中引用 cue。
         * 其不得包含换行以及不能包含“-->”字符串。
         * 它必须以一个新行结束。
         * 它们不必是唯一的，尽管对它们进行编号很常见（例如，1、2、3）。
         */
        public tag?: string,
        /** 字幕设置。支持显示方向、位置等 */
        public setting?: CueSetting,
    ) {
        this.text = this.splitTextLines(text);
        note && (this.note = this.noteESC(note));
        tag && (this.tag = this.tagESC(tag));
    }

    /**
     * 切分换行文本
     * 
     * @param text 原始文本
     * @returns 字幕行序列
     */
    private splitTextLines(text: string) {
        return this.ESC(text)
            .replace(/\r/g, '')
            .replace(/\n+/g, '\n')
            .replace(/&lt;(\/?[A-Za-z\d:\. ]+?)&gt;/g, '<$1>'); // 还原 HTML 标签
    }

    /**
     * 转义字符
     * 
     * @param text 原始文本
     * @returns 转义后的文本
     */
    private ESC(text: string) {
        return text.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;');
    }

    /**
     * 转义注释
     * 
     * @param text 原始文本
     * @returns 转义后的文本
     */
    private noteESC(text: string) {
        return this.ESC(text).replace(/\n+/g, '\n');
    }

    /**
     * 转义标识符
     * 
     * @param text 原始文本
     * @returns 转义后的文本
     */
    private tagESC(text: string) {
        return text.replace(/\n+/g, '\n').replace(/-->/g, '--&gt;');
    }

    private formatSetting() {
        if (this.setting) {
            let res = '';
            for (const d of Object.keys(this.setting)) {
                res += ` ${d}:${this.setting[<keyof CueSetting>d]}`;
            }
        } else { return '' }
    }

    /**
     * 添加字幕内容  
     * 注意：
     *    1. 使用本方法添加的字幕将另起一行
     *    2. 不允许使用换行符，要换行请多次调用本方法
     * 
     * 支持 HTML 标签：
     *    - `<c></c>` 使用 CSS 类对包含的文本进行样式设置。
     *      例如：`<c.classname>text</c>`
     *    - `<i></i>` 将包含的文本斜体化。
     *      例如：`<i>text</i>`
     *    - `<b></b>` 将包含的文本粗体化。
     *      例如：`<b>text</b>`
     *    - `<u></u>` 给包含的文本加下划线。
     *      例如：`<u>text</u>`
     *    - `<ruby></ruby>`和`<rt></rt>` 使用 ruby 文本标签展示 ruby 字符
     *      例如：`<ruby>WWW<rt>World Wide Web</rt>oui<rt>yes</rt></ruby>`
     *    - `<v></v>` 与类标签类似，也用于使用 CSS 设置包含文本的样式。
     *      例如：`<v Bob>text</v>`
     *    - 时间戳标签
     *      时间戳必须大于 cue 开始的时间戳，大于在 cue 有效内容中任意之前的时间戳，并且小于 cue 结束的时间戳。
     *      活动的文本（active text）是指当前时间戳和下一个时间戳之间的文本或者如果有效内容中没有其他时间戳，则一直到有效内容末尾的文本。
     *      有效内容中活动的文本之前的任何文本都是之前已出现的文本（previous text）。
     *      活动的文本之后的文本都是未来即将出现的文本（future text）。
     *      例如：`When the moon <00:17.500>hits your eye`
     * 
     * @param text 字幕文本
     */
    addText(text: string) {
        this.text += `
${this.splitTextLines(text.replace(/\n/g, ''))}`;
    }

    /**
     * 添加注释
     * 
     * @param text 注释文本
     */
    addNote(text: string) {
        if (this.note) {
            this.note += this.noteESC(text);
        } else {
            this.note = this.noteESC(text);
        }
    }

    /**
     * 添加标识符
     * 
     * @param text 标识符文本
     */
    addTag(text: string) {
        this.tag = this.tagESC(text);
    }

    /**
     * 添加字幕设定
     * 
     * @param setting 设定内容
     */
    addSetting(setting: CueSetting) {
        if (this.setting) {
            this.setting = Object.assign(this.setting, setting);
        } else {
            this.setting = setting;
        }
    }

    /**
     * 使用 CSS 类对包含的文本进行样式设置
     * 
     * @param text 要匹配的字符串
     * @param query css查询值
     * @example
     * // 原始文本：这是一条测试字幕
     * VTTCue.prototype.c('测试','.text') // 修改后的文本：这是一条<c.text>测试</c>字幕
     */
    c(text: string, query: string) {
        this.text = this.text.replaceAll(text, `<c${query}>${text}</c>`);
    }

    /**
     * 将包含的文本斜体化
     * 
     * @param text 要匹配的字符串
     * @param query css查询值
     * @example
     * // 原始文本：这是一条测试字幕
     * VTTCue.prototype.i('测试') // 修改后的文本：这是一条<i>测试</i>字幕
     * VTTCue.prototype.i('测试','.text') // 修改后的文本：这是一条<i.text>测试</i>字幕
     */
    i(text: string, query?: string) {
        this.text = this.text.replaceAll(text, `<i${query || ''}>${text}</i>`);
    }

    /**
     * 将包含的文本粗体化
     * 
     * @param text 要匹配的字符串
     * @param query css查询值
     * @example
     * // 原始文本：这是一条测试字幕
     * VTTCue.prototype.b('测试') // 修改后的文本：这是一条<b>测试</b>字幕
     * VTTCue.prototype.b('测试','.text') // 修改后的文本：这是一条<b.text>测试</b>字幕
     */
    b(text: string, query?: string) {
        this.text = this.text.replaceAll(text, `<b${query || ''}>${text}</b>`);
    }

    /**
     * 给包含的文本加下划线
     * 
     * @param text 要匹配的字符串
     * @param query css查询值
     * @example
     * // 原始文本：这是一条测试字幕
     * VTTCue.prototype.u('测试') // 修改后的文本：这是一条<u>测试</u>字幕
     * VTTCue.prototype.u('测试','.text') // 修改后的文本：这是一条<u.text>测试</u>字幕
     */
    u(text: string, query?: string) {
        this.text = this.text.replaceAll(text, `<u${query || ''}>${text}</u>`);
    }

    /**
     * 给包含的文本加声音标签。
     * 与类标签类似，也用于使用 CSS 设置包含文本的样式。
     * 
     * @param text 要匹配的字符串
     * @param query css查询值
     * @example
     * // 原始文本：这是一条测试字幕
     * VTTCue.prototype.v('测试') // 修改后的文本：这是一条<v>测试</v>字幕
     * VTTCue.prototype.v('测试','Bob') // 修改后的文本：这是一条<v Bob>测试</v>字幕
     */
    v(text: string, query: string) {
        this.text = this.text.replaceAll(text, `<v${` ${query}` || ''}>${text}</v>`);
    }

    /**
     * 使用 ruby 文本标签展示 ruby 字符（注解字符）
     * 
     * @param ruby 要匹配的字符串
     * @param rt 匹配的字符串对应的注解字符
     * @example
     * // 原始文本：这是一条测试字幕
     * VTTCue.prototype.ruby('测试','test') // 修改后的文本：这是一条<ruby>测试<rt>test</rt></ruby>字幕
     */
    ruby(ruby: string, rt: string) {
        this.text = this.text.replaceAll(ruby, `<ruby>${ruby}<rt>${rt}</rt></ruby>`);
    }

    /**
     * 给文本加时间标签
     * 
     * @param text 目标文本，只处理第一个匹配项
     * @param time 时间标签，必须大于 startTime 同时 小于 endTime
     * @example
     * // 原始文本：这是一条测试字幕
     * // startTime = 0
     * // endTime = 5
     * VTTCue.prototype.ruby('测试',3) // 修改后的文本：这是一条<00:03.000>测试字幕
     * // 结果是前两秒显示“这是一条”，第3秒补全“测试”后的内容，第5秒移除字幕
     */
    time(text: string, time: number) {
        this.text = this.text.replace(text, `<${Format.mmssttt(time)}>${text}`);
    }

    /** 格式化为文本 */
    toJSON() {
        return `${this.note ? `NOTE ${this.note}
` : ''}${this.tag ? `${this.tag}
`: ''}${Format.mmssttt(this.startTime)} --> ${Format.mmssttt(this.endTime)}${this.formatSetting()}
${this.text}`
    }
}

interface CueSetting {
    /** 文本将垂直的显示而不是水平的显示，例如在一些亚洲语言中。 */
    vertical?: 'rl' | 'lr';
    /**
     * 如果没有设置垂直方向，那么指定文本垂直方向显示的位置。  
     * 如果设置了垂直，line 指定文本出现的水平位置。
     * - 数字
     *    - 数字表示视频中显示的 cue 第一行的高度。
     *      正数表示自上而下，负数表示自下而上。
     * - 百分比
     *    - 它必须是一个 0 和 100 之间的整数，包括 0 和 100（即不是小数），并且其后必须跟随一个百分比符号（%）。
     * 
     * | Line | vertical omitted | vertical:rl | vertical:lr |
     * | :-: | :-: | :-: | :-: |
     * | line:0 | top | right | left |
     * | line:-1 | bottom | left | right |
     * | line:0% | top | right | left |
     * | line:100% | bottom | left | right |
     */
    line?: number | string;

    /**
     * 指定字幕水平出现的位置。
     * 如果设置了垂直方向，position 指定文本垂直方向出现的位置。
     * 当值是一个百分比，其必须是一个 0 到 100 之间的整数，包括 0 和 100（不是小数），并且其后必须跟随一个百分比符号（%）。
     * | Position | vertical omitted | vertical:rl | vertical:lr |
     * | :-: | :-: | :-: | :-: |
     * | position:0% | left | top | top |
     * | position:100% | right | bottom | bottom |
     */
    position?: number | string;

    /**
     * 指定字幕区域的宽度。
     * 如果设置了垂直方向，size 指定了文本区域的高度。
     * 当值是一个百分比，其必须是一个 0 到 100 之间的整数，包括 0 和 100（不是小数），并且其后必须跟随一个百分比符号（%）。
     * | Size | vertical omitted | vertical:rl | vertical:lr |
     * | :-: | :-: | :-: | :-: |
     * | size:100% | full width | full height | full height |
     * | size:50% | half width | half width | half width |
     */
    size?: number | string;

    /**
     * 指定文本的对齐方式。
     * 如果设置了字幕 size ，则在 cue 设置的 size 给出的空间中对齐。
     * | Align | vertical omitted | vertical:rl | vertical:lr |
     * | :-: | :-: | :-: | :-: |
     * | align:start | left | top | top |
     * | align:center | centered horizontally | centered vertically | centered vertically |
     * | align:end | right | bottom | bottom |
     */
    align?: 'start' | 'center' | 'end';
}