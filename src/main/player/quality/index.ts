import { BilibiliPlayer } from "..";
import { pgcPlayurl } from "../../../io/com/bilibili/api/pgc/player/web/playurl";
import { pugvPlayurl } from "../../../io/com/bilibili/api/pugv/player/web/playurl";
import { playurl } from "../../../io/com/bilibili/api/x/player/playurl";
import { QUALITY_DESCRIBE } from "../../../io/quality";
import { ev, PLAYER_EVENT } from "../../../player/event";
import { toastr } from "../../../toastr";
import { cookie } from "../../../utils/cookie";
import { MAIN_EVENT, mainEv } from "../../event";

export class Quality {

    playurl?: Awaited<ReturnType<typeof pgcPlayurl>>['result'] | Awaited<ReturnType<typeof playurl>>['data'] | Awaited<ReturnType<typeof pugvPlayurl>>['data']

    constructor(private player: BilibiliPlayer) {

        ev.bind(PLAYER_EVENT.QUALITY_CHANGE, ({ detail }) => {
            cookie.set('CURRENT_QUALITY', detail);
            if (detail === 0) {
                // 自动画质无须切换
                ev.trigger(PLAYER_EVENT.QUALITY_SET_FOR, detail);
                toastr.success(`已经切换至${QUALITY_DESCRIBE[detail]}画质`);
            } else {
                if (this.playurl?.dash?.video.find(d => d.id === detail)) {
                    // 无需联网请求的DASH画质
                    ev.trigger(PLAYER_EVENT.QUALITY_SET_FOR, detail);
                    toastr.success(`已经切换至${QUALITY_DESCRIBE[detail]}画质`);
                } else {
                    toastr.info(`正在为您切换到${QUALITY_DESCRIBE[detail]}画质,请稍候...`);
                    this.player.updateSource(detail, () => {
                        toastr.success(`已经切换至${QUALITY_DESCRIBE[detail]}画质`);
                        ev.trigger(PLAYER_EVENT.QUALITY_SET_FOR, detail);
                    }, () => {
                        toastr.error(`切换画质失败，已回滚~`);
                    })
                }
            }
        });
        mainEv.bind(MAIN_EVENT.PLAYURL, ({ detail }) => {
            this.playurl = detail;
        });
    }
}