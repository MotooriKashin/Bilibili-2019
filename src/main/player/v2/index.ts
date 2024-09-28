import { BilibiliPlayer } from "..";
import { v2 } from "../../../io/com/bilibili/api/x/player/v2";
import { https } from "../../../utils/https";
import { MAIN_EVENT, mainEv } from "../../event";
import { ClosedCaption } from "./ClosedCaption";

export class V2 {

    constructor(private player: BilibiliPlayer) {

        mainEv.bind(MAIN_EVENT.CONNECT, this.connect)
    }

    private connect = () => {
        v2(this.player.$cid, this.player.$aid, this.player.$ssid)
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                this.subtitle(data.subtitle)
            })
            .catch(e => {
                console.error('获取播放器接口数据错误', e)
            })
    }

    /** 添加字幕 */
    private subtitle(list: Awaited<ReturnType<typeof v2>>['data']['subtitle']) {
        list?.subtitles.forEach(d => {
            fetch(https(d.subtitle_url))
                .then(e => e.json())
                .then(f => {
                    const cc = new ClosedCaption();
                    cc.addCue(...f.body);
                    const file = new File([cc.toWebVTT().toJSON()], d.lan_doc);
                    this.player.$area.$control.$subtitle.load(file);
                })
                .catch(e => {
                    console.error('获取 CC 字幕出错', e);
                });
        })
    }
}