import { IDanmaku } from "../../../danmaku";
import { DANMAKU } from "../../../danmaku/block";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { PLAYER_EVENT, ev } from "../../event-target";
import { Context } from "../../widget/context";
import { DanmakuElem } from "./danmaku";

/** 弹幕列表 */
@customElement('div')
export class Danmaku extends HTMLDivElement {

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

    /** 被选中弹幕 */
    private $dmSelected: IDanmaku[] = [];

    private $dms: IDanmaku[] = [];

    /** 列表抬头 */
    private $header = Element.add('div', { class: 'bofqi-auxiliary-danmaku-header' }, this);

    /** 列表抬头·时间 */
    private $progress = Element.add('div', { class: 'bofqi-auxiliary-danmaku-progress' }, this.$header, '时间');

    /** 列表抬头·时间 */
    private $content = Element.add('div', { class: 'bofqi-auxiliary-danmaku-content' }, this.$header, '弹幕内容');

    /** 列表抬头·时间 */
    private $sent = Element.add('div', { class: 'bofqi-auxiliary-danmaku-sent' }, this.$header, '发送时间');

    /** 列表 */
    private $list = Element.add('div', { class: 'bofqi-auxiliary-danmaku-list' }, this);

    /** 右键菜单 */
    private $context = new Context(this.$list);

    /** 右键菜单·屏蔽发送者 */
    private $block = Element.add('li', { class: 'context-danmaku-block' }, this.$context, '屏蔽发送者');

    /** 右键菜单·复制选中弹幕 */
    private $copy = Element.add('li', { class: 'context-danmaku-copy' }, this.$context, '复制选中弹幕');

    /** 右键菜单·举报弹幕 */
    private $report = Element.add('li', { class: 'context-danmaku-report' }, this.$context, '举报弹幕');

    /** 右键菜单·查看该发送者的所有弹幕 */
    private $filter = Element.add('li', { class: 'context-danmaku-filter' }, this.$context, '查看该发送者的所有弹幕');

    /** 右键菜单·UP主视频中禁言此用户 */
    private $silent = Element.add('li', { class: 'context-danmaku-silent' }, this.$context, 'UP主视频中禁言此用户');

    /** 右键菜单·导出弹幕 */
    private $export = Element.add('li', { class: 'context-danmaku-border-top' }, this.$context, '导出弹幕');


    constructor() {
        super();

        this.classList.add('bofqi-auxiliary-danmaku');
        this.$context.classList.add('bofqi-video-context-menu');

        ev.bind(PLAYER_EVENT.OPTINOS_CHANGE, ({ detail }) => {
            const { block } = detail.danmaku;

            this.classList.toggle('block-1', Boolean(block & DANMAKU.SCROLL));
            this.classList.toggle('block-4', Boolean(block & DANMAKU.BOTTOM));
            this.classList.toggle('block-5', Boolean(block & DANMAKU.TOP));
            this.classList.toggle('block-7', Boolean(block & DANMAKU.ADVANCE));
            this.classList.toggle('block-8', Boolean(block & DANMAKU.SCRIPT));
            this.classList.toggle('block-9', Boolean(block & DANMAKU.BAS));
        });
        ev.bind(PLAYER_EVENT.DANMAKU_ADD, ({ detail }) => {
            this.$dms = this.$dms.concat(detail);
        });
        ev.bind(PLAYER_EVENT.DANMAKU_CONTEXT, ({ detail }) => {
            this.$dmSelected = [detail];
        });
        ev.bind(PLAYER_EVENT.IDENTIFY, this.identify);
        ev.bind(PLAYER_EVENT.DANMAKU_IDENTIFY, this.identify);

        this.$copy.addEventListener('click', () => {
            if (this.$dmSelected.length) {
                navigator.clipboard.writeText(this.$dmSelected.map(d => d.content).join('\n'))
            }
        });
        this.$export.addEventListener('click', () => {
            showSaveFilePicker({
                suggestedName: `${crypto.randomUUID()}.dm.json.gz`,
                types: [
                    {
                        description: '弹幕',
                        accept: {
                            'application/danmkau+gzip': ['.gz'],
                        }
                    }
                ],
            }).then(async d => {
                const blob = new Blob([JSON.stringify(this.$dms, undefined, '\t')]);
                const stream = blob.stream().pipeThrough(new CompressionStream('gzip'));
                return <[FileSystemWritableFileStream, Blob]>[
                    await d.createWritable(),
                    await new Response(stream).blob()
                ];
            }).then(([handle, file]) => {
                handle.write(file).finally(() => { handle.close() });
            });
        });

        new IntersectionObserver(this.observeCallback).observe(this.$list);
    }

    private observeCallback = (entries: IntersectionObserverEntry[]) => {
        let isIntersecting = false;
        for (const entry of entries) {
            isIntersecting = entry.isIntersecting;
        }

        if (isIntersecting) {
            // 显示弹幕列表
            const part = document.createDocumentFragment();
            for (const dm of this.$dms) {
                part.appendChild(new DanmakuElem(dm))
            }
            this.$list.appendChild(part);
        } else {
            // 清除弹幕
            this.$list.replaceChildren();
        }
    }

    private identify = () => {
        this.$dmSelected.length = 0;
        this.$dms.length = 0;
        this.$list.replaceChildren();
    }
}