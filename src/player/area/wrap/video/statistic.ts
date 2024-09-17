import FlvJs from "flv.js";
import { customElement } from "../../../../utils/Decorator/customElement";
import { Element } from "../../../../utils/element";
import { Format } from "../../../../utils/fomat";
import { ev, PLAYER_EVENT } from "../../../event";
import { IVideoInfoEvent } from "../../../../dash-player";

/** 播放器节点区域 */
@customElement('ul')
export class Statistic extends HTMLUListElement {

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

    /** 关闭按钮 */
    private $close = Element.add('i', { class: 'bofqi-statistic-close', appendTo: this });

    /** 是否可见 */
    private isIntersecting = false;

    /** 编码类型 */
    private $mimeType = this.appendChild(new InfoLine('Mime Type'));

    /** 播放器类型 */
    private $playerType = this.appendChild(new InfoLine('Player Type'));

    /** 分辨率 */
    private $resolution = this.appendChild(new InfoLine('Resolution'));

    /** 帧率 */
    private $FPS = this.appendChild(new InfoLine('FPS'));

    /** 视频编码版本 */
    private $videoProfile = this.appendChild(new InfoLine('Video Profile'));

    /** 音频采样 */
    private $audioSampling = this.appendChild(new InfoLine('Audio Sampling'));

    /** 视频比特率 */
    private $videoDataRate = this.appendChild(new InfoLine('Video DataRate'));

    /** 音频比特率 */
    private $audioDataRate = this.appendChild(new InfoLine('Audio DataRate'));

    /** 分片数 */
    private $segments = this.appendChild(new InfoLine('Segments'));

    /** 加载方式 */
    private $loader = this.appendChild(new InfoLine('Loader'));

    /** 流类型 */
    private $StreamType = this.appendChild(new InfoLine('Stream Type'));

    /** 流主机 */
    private $StreamHost = this.appendChild(new InfoLine('Stream Host'));

    /** 视频主机 */
    private $videoHost = this.appendChild(new InfoLine('Video Host'));

    /** 音频主机 */
    private $audioHost = this.appendChild(new InfoLine('Audio Host'));

    /** 视频速率 */
    private $videoSpeed = this.appendChild(new InfoLine('Video Speed', true));

    /** 音频速率 */
    private $audioSpeed = this.appendChild(new InfoLine('Audio Speed', true));

    /** 链接速率 */
    private $connectSpeed = this.appendChild(new InfoLine('Connect Speed', true));

    /** 网络活动 */
    private $networkActivity = this.appendChild(new InfoLine('Network Activity', true));

    /** 丢帧 */
    private $droppedFrames = this.appendChild(new InfoLine('Dropped Frames'));

    constructor() {
        super();
        this.classList.add('bofqi-statistic');

        new IntersectionObserver(this.observeCallback).observe(this);
        this.$close.addEventListener('click', this.close);
        ev.bind(PLAYER_EVENT.VIDEO_INFO_DASH, this.dashjs);
        ev.bind(PLAYER_EVENT.VIDEO_INFO_FLV, this.flvjs);
        ev.bind(PLAYER_EVENT.VIDEO_INFO_NATIVE, this.native);
        ev.bind(PLAYER_EVENT.VIDEO_DESTORY, this.identify);
    }


    private observeCallback = (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
            this.isIntersecting = entry.isIntersecting;
        }
    }

    /** 刷新DASH数据 */
    private dashjs = (ev: CustomEvent<IVideoInfoEvent>) => {
        if (this.isIntersecting) {
            const { mediaInfo, statisticsInfo } = ev.detail;
            this.$mimeType.update(mediaInfo.mimeType);
            this.$playerType.update(statisticsInfo.playerType);
            this.$resolution.update(`${mediaInfo.width} × ${mediaInfo.height}@${(Number(mediaInfo.fps) || 0).toFixed(3)} [SAR ${mediaInfo.sar}]`);
            this.$videoDataRate.update(Format.bps(mediaInfo.videoDataRate || 0));
            this.$audioDataRate.update(Format.bps(mediaInfo.audioDataRate || 0));
            this.$segments.update(`${(statisticsInfo.audioCurrentSegmentIndex || 0) + 1}/${statisticsInfo.audioTotalSegmentCount}`);
            statisticsInfo.videoURL && this.$videoHost.update(new URL(statisticsInfo.videoURL, location.origin).host);
            statisticsInfo.audioURL && this.$audioHost.update(new URL(statisticsInfo.audioURL, location.origin).host);
            this.$videoSpeed.update(statisticsInfo.videoConnectionSpeed || 0, Format.bps((statisticsInfo.videoConnectionSpeed || 0) * 1024));
            this.$audioSpeed.update(statisticsInfo.audioConnectionSpeed || 0, Format.bps((statisticsInfo.audioConnectionSpeed || 0) * 1024));
            this.$networkActivity.update(statisticsInfo.networkActivity || 0, Format.bit(statisticsInfo.networkActivity || 0));
            this.$droppedFrames.update(`${statisticsInfo.droppedFrames}/${statisticsInfo.decodedFrames}`);
        }
    }

    /** 刷新FLV数据 */
    private flvjs = (ev: CustomEvent<[FlvJs.FlvPlayerMediaInfo, FlvJs.FlvPlayerStatisticsInfo]>) => {
        const [mediaInfo, statisticsInfo] = ev.detail;
        this.$mimeType.update(mediaInfo.mimeType);
        this.$playerType.update(statisticsInfo.playerType);
        this.$resolution.update(`${mediaInfo.width} × ${mediaInfo.height} [SAR ${mediaInfo.sarNum}:${mediaInfo.sarDen}]`);
        this.$FPS.update(mediaInfo.fps || 0);
        this.$videoProfile.update(`${mediaInfo.profile}, ${mediaInfo.level}`);
        this.$audioSampling.update(`${mediaInfo.audioSampleRate} Hz, ${mediaInfo.audioChannelCount === 1 ? 'Mono' : mediaInfo.audioChannelCount === 2 ? 'Stereo' : `${mediaInfo.audioChannelCount} Channels`}`);
        this.$videoDataRate.update(Format.bps((mediaInfo.videoDataRate || 0) * 1024));
        this.$audioDataRate.update(Format.bps((mediaInfo.audioDataRate || 0) * 1024));
        this.$segments.update(`${(statisticsInfo.currentSegmentIndex || 0) + 1}/${statisticsInfo.totalSegmentCount || 0}`);
        this.$loader.update(statisticsInfo.loaderType || '');
        statisticsInfo.url && (this.$StreamType.update(new URL(statisticsInfo.url, location.origin).protocol.replace(':', '')),
            this.$StreamHost.update(new URL(statisticsInfo.url, location.origin).host));
        this.$connectSpeed.update(statisticsInfo.speed || 0, Format.bit((statisticsInfo.speed || 0) * 1024));
        this.$droppedFrames.update(`${statisticsInfo.droppedFrames}/${statisticsInfo.decodedFrames}`);
    }

    /** 刷新NATIVE数据 */
    private native = (ev: CustomEvent<[FlvJs.NativePlayerMediaInfo, FlvJs.NativePlayerStatisticsInfo]>) => {
        const [mediaInfo, statisticsInfo] = ev.detail;
        this.$mimeType.update(mediaInfo.mimeType);
        this.$playerType.update(statisticsInfo.playerType);
        this.$resolution.update(`${mediaInfo.width} × ${mediaInfo.height}`);
        statisticsInfo.url && (this.$StreamType.update(new URL(statisticsInfo.url, location.origin).protocol.replace(':', '')),
            this.$StreamHost.update(new URL(statisticsInfo.url, location.origin).host));
        this.$droppedFrames.update(`${statisticsInfo.droppedFrames}/${statisticsInfo.decodedFrames}`);
    }

    /** 打开面板 */
    open = () => {
        this.classList.add('active');
    }

    /** 关闭面板 */
    close = () => {
        this.classList.remove('active');
    }

    toggle = () => {
        return this.classList.toggle('active');
    }

    identify = () => {
        this.close();
        this.$mimeType.idetify();
        this.$playerType.idetify();
        this.$resolution.idetify();
        this.$FPS.idetify();
        this.$videoProfile.idetify();
        this.$audioSampling.idetify();
        this.$videoDataRate.idetify();
        this.$audioDataRate.idetify();
        this.$segments.idetify();
        this.$loader.idetify();
        this.$StreamType.idetify();
        this.$StreamHost.idetify();
        this.$videoHost.idetify();
        this.$audioHost.idetify();
        this.$videoSpeed.idetify();
        this.$audioSpeed.idetify();
        this.$connectSpeed.idetify();
        this.$networkActivity.idetify();
        this.$droppedFrames.idetify();
    }
}

@customElement('li')
class InfoLine extends HTMLLIElement {

    /** 标题 */
    private $title = Element.add('span', { class: 'info-title' });

    /** 图表 */
    private $graph = Element.add('span', { class: 'info-graph' });

    /** 数据 */
    private $data = Element.add('span');

    /** 数据缓存 */
    private $dataCatch = '';

    /** 点缓存 */
    private graphPointArr: number[] = [];

    /** 线缓存 */
    private graphLineArr: [number, number][] = [];

    private graphWidth = 180;

    private graphHeight = 14;

    private minValue = 0;

    private maxValue = 140;

    private perValue = 14 / (this.maxValue - this.minValue);

    constructor(
        title: string,
        private isgraph = false
    ) {
        super();
        this.classList.add('info-line');
        this.$title.textContent = title;
        isgraph ? (this.append(this.$title, this.$graph, this.$data), this.initGraph()) : this.append(this.$title, this.$data)
    }

    private initGraph() {
        for (let i = 0, len = this.graphWidth / 2; i < len; i++) {
            this.graphPointArr.push(0);
            this.graphLineArr.push([i * 2, this.graphHeight]);
        }
    }

    /**
     * 更新数据
     * 
     * @param point 数据内容
     * @param str 附加数据
     */
    update(point: number | string, str?: string) {
        if (this.isgraph) {
            this.show();
            this.graphPointArr.shift();
            this.graphPointArr.push(+point);
            this.graphLineArr = [];
            this.maxValue = Math.max.apply(this, this.graphPointArr) || 1;
            this.perValue = this.graphHeight / (this.maxValue - this.minValue);

            for (let i = 0, len = this.graphPointArr.length; i < len; i++) {
                const point = this.graphPointArr[i];
                this.graphLineArr.push([i * 2, this.graphHeight - (point - this.minValue) * this.perValue]);
            }
            str && (this.$dataCatch === str || (this.$data.textContent = this.$dataCatch = str));
            // update graph line array
            this.$graph.innerHTML = `<svg width="${this.graphWidth}" height="${this.graphHeight}" viewBox="0 0 ${this.graphWidth} ${this.graphHeight}"><g><polyline stroke="white" fill="none" points="${(<number[][]>this.graphLineArr).reduce((s, d) => {
                s += d.join(',') + ' ';
                return s;
            }, '')}"></polyline></g></svg>`;
        } else {
            this.$dataCatch === point || (this.show(), this.$data.textContent = this.$dataCatch = <string>point);
        }
    }

    show() {
        this.classList.add('active');
    }

    hide() {
        this.classList.remove('active');
    }

    idetify = () => {
        this.hide();
        this.$dataCatch = '';
        this.graphPointArr.length = 0;
        this.graphLineArr.length = 0;
        this.graphWidth = 180;
        this.graphHeight = 14;
        this.minValue = 0;
        this.maxValue = 140;
        this.perValue = 14 / (this.maxValue - this.minValue);
        this.$data.replaceChildren();
        this.$graph.replaceChildren();
        this.initGraph();
    }
}

export interface IStatistic {
    /** 编码类型 */
    mimeType: string;
    /** 播放器类型 */
    playerType: string;
    /** 分辨率 */
    resolution: string;
    /** 视频比特率 */
    videoDataRate: number;
    /** 音频比特率 */
    audioDataRate: number;
    /** 分片数 */
    segments: string;
    /** 视频主机 */
    videoHost: string;
    /** 音频主机 */
    audioHost: string;
    /** 视频速率 */
    videoSpeed: number;
    /** 音频速率 */
    audioSpeed: number;
    /** 网络活动 */
    networkActivity: number;
    /** 丢帧 */
    droppedFrames: string;
}