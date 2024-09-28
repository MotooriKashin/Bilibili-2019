import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Download } from "../../download";
import { BilibiliPlayer } from "../../player";
import stylesheet from "./index.css" with {type: 'css'};
import { Part } from "./part";
import { Toolbar } from "./toolbar";

/** 播放器模块 */
@customElement(undefined, `player-box-${Date.now()}`)
export class Bofqi extends HTMLElement {

    #host = this.attachShadow({ mode: 'closed' });

    #player = new BilibiliPlayer();

    #part = new Part();

    #toolbar = new Toolbar();

    #download = new Download();

    #playerBox = Element.add('div', { class: 'player-box', appendTo: this.#host, children: [this.#part, this.#player, this.#toolbar, this.#download] });

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];
        this.#player.classList.add('bilibili-player');

        this.#player.$auxiliary.$info.$more.add({
            text: '下载视频',
            callback: () => {
                this.#download.showPopover();
            }
        })
    }
}