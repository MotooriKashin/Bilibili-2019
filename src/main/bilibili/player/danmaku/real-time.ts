import { BilibiliPlayer } from "..";
import { DanmakuEvent } from "../../../../io/protobuf/DanmakuEvent";
import { IDmSegMobileReply } from "../../../../io/protobuf/DmSegMobileReply";
import { RoomResp } from "../../../../io/protobuf/RoomResp";
import { Socket } from "./socket";
import { EVENTS } from "./state";

/** 实时弹幕 */
export class RealTime {

    private defaultPort = 7826;

    private domain = 'broadcast.chat.bilibili.com';

    private socketKey!: string;

    private socket?: Socket;

    private realdmPath = 'bilibili.broadcast.message.main.DanmukuEvent';

    private livePath = 'bilibili.broadcast.message.ogv.CMDBody';

    constructor(private player: BilibiliPlayer) { }

    async getSevers() {
        this.sendBroadcast();
    }

    /** 开启websoket */
    private sendBroadcast() {
        const url = `wss://${this.domain}:${this.defaultPort}/sub?platform=web`;

        this.socketKey = `video://${this.player.aid}/${this.player.cid}`;
        if (this.player.ssid) {
            this.socketKey += `?sid=${this.player.ssid}&epid=${this.player.epid}`;
        }

        this.socket = new Socket(url, [this.realdmPath], [this.socketKey]);

        this.socket.bind(EVENTS.B_ROOM, e => {
            if (e.body?.value) {
                const { id, msg, online } = RoomResp.decode(e.body.value);
                if (online) {
                    this.player.setOnline(online.online);
                }
                if (msg) {
                    switch (msg.targetPath) {
                        case this.realdmPath: {
                            this.player.addDanmaku((<IDmSegMobileReply>DanmakuEvent.decode(msg.body.value)).elems);
                            break;
                        }
                    }
                }
            }
        });
    }



    identify = () => {
        this.socket?.dispose();
    }
}