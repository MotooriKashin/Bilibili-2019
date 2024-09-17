import FlvJs from "flv.js";
import { Video } from "./area/wrap/video";
import { ev, PLAYER_EVENT } from "./event";

/** flv.js播放器内核管理 */
export class FlvAgent {

    flvPlayer: FlvJs.Player

    constructor(
        video: Video,
        mediaDataSource: FlvJs.MediaDataSource,
        config?: FlvJs.Config,
        seekTime = 0,
    ) {
        FlvJs.LoggingControl.forceGlobalTag = true;
        FlvJs.LoggingControl.enableVerbose = false;
        ev.trigger(PLAYER_EVENT.VIDEO_DESTORY, void 0);
        this.flvPlayer = FlvJs.createPlayer(mediaDataSource, {
            enableWorker: false,
            stashInitialSize: 1024 * 64,
            accurateSeek: true,
            seekType: 'range',
            rangeLoadZeroStart: false,
            lazyLoadMaxDuration: 100,
            lazyLoadRecoverDuration: 50,
            deferLoadAfterSourceOpen: false,
            fixAudioTimestampGap: false,
            reuseRedirectedURL: true,
            ...config,
        });
        this.flvPlayer.attachMediaElement(video);
        this.flvPlayer.load();
        seekTime && video.$seek(seekTime);
        ev.one(PLAYER_EVENT.VIDEO_DESTORY, () => {
            this.flvPlayer.destroy();
        });
        this.flvPlayer.on(FlvJs.Events.STATISTICS_INFO, () => {
            if (this.flvPlayer.type === 'FlvPlayer') {
                ev.trigger(PLAYER_EVENT.VIDEO_INFO_FLV, [
                    (<FlvJs.FlvPlayer>this.flvPlayer).mediaInfo,
                    (<FlvJs.FlvPlayer>this.flvPlayer).statisticsInfo]
                );
            } else if (this.flvPlayer.type === 'NativePlayer') {
                ev.trigger(PLAYER_EVENT.VIDEO_INFO_NATIVE, [
                    (<FlvJs.NativePlayer>this.flvPlayer).mediaInfo,
                    (<FlvJs.NativePlayer>this.flvPlayer).statisticsInfo]
                );
            }
        });
        this.flvPlayer.on(FlvJs.Events.ERROR, () => {
            ev.trigger(PLAYER_EVENT.MEDIA_ERROR, void 0);
        });
    }
}