import { BilibiliPlayer } from "..";
import { videoshot } from "../../../io/com/bilibili/api/x/player/videoshot";
import { ev, PLAYER_EVENT } from "../../../player/event";
import { MAIN_EVENT, mainEv } from "../../event";

export class Progress {

    #img = document.createElement('div');

    /** 缩略图信息 */
    pvData?: Awaited<ReturnType<typeof videoshot>>;

    constructor(private player: BilibiliPlayer) {

        player.$area.$control.$progress.$hover.appendChild(this.#img);

        ev.bind(PLAYER_EVENT.LOAD_VIDEO_FILE, this.#identify);
        ev.bind(PLAYER_EVENT.PROGRESS_HOVER, this.#hover);
        mainEv.bind(MAIN_EVENT.IDENTIFY, this.#identify);
        mainEv.bind(MAIN_EVENT.CONNECT, this.#init);
    }

    #init = () => {
        videoshot(this.player.$cid, this.player.$aid)
            .then(d => {
                this.pvData = d;
            })
            .catch(e => {
                console.error('获取缩略图出错', e);
            });
    }

    #hover = (evt: CustomEvent<number>) => {
        if (this.pvData) {
            const {
                pv_index,
                pv_img,
                pv_x_len = 10,
                pv_y_len = 10,
                pv_x_size = 160,
                pv_y_size = 90,
            } = this.pvData;
            const { detail: value } = evt;
            if (pv_index && pv_img) {
                const p = pv_index.findIndex((d, i) => value >= pv_index[i - 1] && value < d);
                if (p >= 0 && pv_img[Math.floor(p / 100)]) {
                    this.#img.style.flexShrink = '0';
                    this.#img.style.inlineSize = pv_x_size + 'px';
                    this.#img.style.blockSize = pv_y_size + 'px';
                    this.#img.style.scale = `${160 / pv_x_size}`;
                    this.#img.style.transformOrigin = 'bottom';
                    this.#img.style.backgroundImage = `url(${pv_img[Math.floor(p / 100)]})`;
                    this.#img.style.backgroundPosition = pv_x_size * -(p % 100 % pv_x_len) + "px " + pv_y_size * -Math.floor(p % 100 / pv_y_len) + "px";

                }
            }
        }
    }

    #identify = () => {
        delete this.pvData;
        this.#img.removeAttribute('style');
    }
}

