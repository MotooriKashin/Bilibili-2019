import { Player } from "../..";
import { IDanmaku } from "../../../danmaku";
import { DANMAKU } from "../../../danmaku/block";
import { toastr } from "../../../toastr";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { ev, PLAYER_EVENT } from "../../event";
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

    #player: Player;

    /** 被选中弹幕 */
    #dmSelected: IDanmaku[] = [];

    #dms: IDanmaku[] = [];

    /** 列表抬头 */
    #header = Element.add('div', { class: 'bofqi-auxiliary-danmaku-header', appendTo: this });

    /** 列表抬头·时间 */
    #progress = Element.add('div', { class: 'bofqi-auxiliary-danmaku-progress', appendTo: this.#header, innerText: '时间' });

    /** 列表抬头·时间 */
    #content = Element.add('div', { class: 'bofqi-auxiliary-danmaku-content', appendTo: this.#header, innerText: '弹幕内容' });

    /** 列表抬头·时间 */
    #sent = Element.add('div', { class: 'bofqi-auxiliary-danmaku-sent', appendTo: this.#header, innerText: '发送时间' });

    /** 列表 */
    #list = Element.add('div', { class: 'bofqi-auxiliary-danmaku-list', appendTo: this });

    /** 右键菜单 */
    #context = new Context(this.#list);

    /** 右键菜单·屏蔽发送者 */
    #block = Element.add('li', { class: 'context-danmaku-block', appendTo: this.#context, innerText: '屏蔽发送者' });

    /** 右键菜单·复制选中弹幕 */
    #copy = Element.add('li', { class: 'context-danmaku-copy', appendTo: this.#context, innerText: '复制选中弹幕' });

    /** 右键菜单·举报弹幕 */
    #report = Element.add('li', { class: 'context-danmaku-report', appendTo: this.#context, innerText: '举报弹幕' });

    /** 右键菜单·查看该发送者的所有弹幕 */
    #filter = Element.add('li', { class: 'context-danmaku-filter', appendTo: this.#context, innerText: '查看该发送者的所有弹幕' });

    /** 右键菜单·UP主视频中禁言此用户 */
    #silent = Element.add('li', { class: 'context-danmaku-silent', appendTo: this.#context, innerText: 'UP主视频中禁言此用户' });

    /** 右键菜单·导出弹幕 */
    #export = Element.add('li', { class: 'context-danmaku-border-top', appendTo: this.#context, innerText: '导出弹幕' });

    #startIndex = 0;

    #seeLength = 0;

    constructor(player: Player) {
        super();

        this.#player = player;
        this.classList.add('bofqi-auxiliary-danmaku');
        this.#context.classList.add('bofqi-video-context-menu');

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
            this.#dms = this.#dms.concat(detail);
            this.#list.hasChildNodes() || this.render();
        });
        ev.bind(PLAYER_EVENT.DANMAKU_CONTEXT, ({ detail }) => {
            this.#dmSelected = [detail];
        });
        ev.bind(PLAYER_EVENT.DANMAKU_IDENTIFY, this.identify);

        this.#copy.addEventListener('click', () => {
            if (this.#dmSelected.length) {
                navigator.clipboard.writeText(this.#dmSelected.map(d => d.content).join('\n'))
            }
        });
        this.#export.addEventListener('click', () => {
            const toast = toastr.warn('请选择保存位置~');
            toast.$delay = 0;
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
            })
                .then(async d => {
                    toast.appendText(`> 正在打包弹幕 -> ${d.name}`);
                    const blob = new Blob([JSON.stringify(this.#dms, undefined, '\t')]);
                    const stream = blob.stream().pipeThrough(new CompressionStream('gzip'));
                    return <[FileSystemWritableFileStream, Blob]>[
                        await d.createWritable(),
                        await new Response(stream).blob()
                    ];
                })
                .then(([handle, file]) => {
                    toast.appendText('> 保存中...请勿关闭标签页~', `> 大小：${Format.fileSize(file.size)}`);
                    handle.write(file).finally(() => {
                        handle.close();
                        toast.appendText('已保存到本地磁盘~ <')
                        toast.$type = 'success';
                        toast.$delay = 4;
                    });
                })
                .catch(e => {
                    toast.appendText(e);
                    toast.$type = 'error';
                    toast.$delay = 4;
                    console.log(e);
                });
        });

        new ResizeObserver(this.observeResizeCallback).observe(this.#list);
        new IntersectionObserver(this.observeIntersectionCallback).observe(this.#list);
        this.#list.addEventListener('scroll', () => {
            const { scrollTop } = this.#list;
            const startindex = Math.floor(scrollTop / 24);
            const { length } = this.#dms;
            if (this.#startIndex < startindex) {
                // 向下滚动
                for (; (this.#startIndex < startindex && (this.#startIndex + this.#seeLength) < length); this.#startIndex++) {
                    this.#list.appendChild(new DanmakuElem(this.#dms[this.#startIndex + this.#seeLength], player));
                    this.#list.firstElementChild?.remove();
                }
            } else {
                // 向上滚动
                for (; (this.#startIndex > startindex && (this.#startIndex - 1) >= 0); this.#startIndex--) {
                    this.#list.prepend(new DanmakuElem(this.#dms[this.#startIndex - 1], player));
                    this.#list.lastElementChild?.remove();
                }
            }
            this.marginFix();
        });
    }

    observeIntersectionCallback = (entries: IntersectionObserverEntry[]) => {
        let isIntersecting = false;
        for (const entry of entries) {
            isIntersecting = entry.isIntersecting;
        }

        if (!isIntersecting) {
            this.#startIndex = 0;
        }
    }

    observeResizeCallback = (entries: ResizeObserverEntry[]) => {
        let blockSize = 0;
        for (const entry of entries) {
            for (const borderBoxSize of entry.borderBoxSize) {
                borderBoxSize.blockSize && (blockSize = borderBoxSize.blockSize);
            }
        }

        if (blockSize) {
            this.render(blockSize);
        }
    }

    render(blockSize?: number) {
        blockSize || (blockSize = this.#list.clientHeight);
        this.#list.replaceChildren();
        const { length } = this.#dms;
        const max = Math.ceil(blockSize / 24) + 5;
        for (let i = 0; (i < max && (this.#startIndex + i) < length); i++) {
            this.#list.appendChild(new DanmakuElem(this.#dms[this.#startIndex + i], this.#player));
            this.#seeLength = i + 1;
        }
        this.marginFix();
    }

    marginFix() {
        const { length } = this.#dms;
        this.#list.style.setProperty('--margin-block-start', `${this.#startIndex * 24}px`);
        this.#list.style.setProperty('--margin-block-end', `${(length - this.#seeLength - this.#startIndex) * 24}px`);
    }


    identify = () => {
        this.#list.replaceChildren();
        this.#dmSelected.length = 0;
        this.#dms.length = 0;
        this.#startIndex = 0;
    }
}