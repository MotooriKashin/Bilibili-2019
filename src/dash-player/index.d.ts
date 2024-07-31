export default class DashPlayer {
    static isBwpHEVCPrefSupported(): boolean;
    static isEC3DolbyATMOSTypeSupported(): boolean;
    static isHEVCDolbyVisionTypeSupported(): boolean;
    static isHEVCHDR10TypeSupported(): boolean;
    static isHEVC8kTypeSupported(): boolean;
    static isHEVCTypeSupported(): boolean;
    static isFLACTypeSupported(): boolean;
    static isMultiAudioTracksSupported(): boolean;

    static EVENTS: {
        ERROR: string;
        WARNING: string;
        VIDEO_INFO: string;
        QUALITY_CHANGE_RENDERED: string;
        QUALITY_CHANGE_REQUESTED: string;
        BUFFERING_OPTIMIZATION: string;
        FRAGMENT_LOADING_COMPLETED: string;
        FRAGMENT_LOADING_ABANDONED: string;
        FRAGMENT_LOADING_HEADER_RECEIVED: string;
        QUOTA_EXCEEDED: string;
        FRAGMENT_P2P_LOAD_INFO: string;
        APPENDED_NEXT_SOURCE_DURATION_CHANGED: string;
        SOURCE_INITIALIZED: string;
    }

    static STRING: {
        ABR_DYNAMIC: "abrDynamic";
        ABR_BOLA: "abrBola";
        ABR_THROUGHPUT: "abrThroughput";
    }


    type: string;
    buffered: TimeRanges;
    duration: number;
    volume: number;
    muted: boolean;
    currentTime: number;
    state: {
        qualityNumberMap: {
            video: Record<string, number>;
            audio: Record<string, number>;
        };
        currentQualityIndex: {
            video: number;
            audio: number;
        };
        statisticsInfo: IStatInfoInterface;
        mediaInfo: IMediaInfoInterface;
        segmentsInfoMap: {
            video: IStatInfoInterface;
            audio: IStatInfoInterface;
        };
        mpd: {
            video: IMpd[];
            audio: IMpd[];
        }
    };
    switchSuccess?: boolean;

    constructor(video: HTMLVideoElement, options: IDashPlayerOption);
    initialize(mpd: IMPDJsonData): Promise<void>;
    setAutoSwitchQualityFor(type: string, value?: boolean, value2?: boolean): DashPlayer;
    setAutoSwitchTopQualityFor(type: string, value?: number): DashPlayer;
    seek(t: number): void;
    getCurrentCodecID(value: string): number;
    getLogHistory(): {
        log: string;
    };
    getCorePlayer(): {
        getAverageThroughput: (key: string) => number;
        on(event: string, listener: (...args: any[]) => void): void;
        off(event: string, listener: (...args: any[]) => void): void;
        getInitializeDate(): FragmentLoadingAbandonedEvent["request"]["requestStartDate"];
        setP2pPermission(flag: boolean, val: number): void;
        setBufferToKeep(num: number): void;
    };
    destroy(): void;
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    attachMediaElement(mediaElement: HTMLMediaElement): void;
    detachMediaElement(): void;
    load(): void;
    unload(): void;
    play(): Promise<void>;
    pause(): void;
    appendSource(mediaDataSourceUrl: string, preloadVideoData: unknown, flag: boolean): Promise<{ cost: number }>;
    switchSource(mediaDataSourceUrl: string, preloadVideoData: unknown, flag: boolean): Promise<{ cost: number }>;
    getCurrentPlayURLFor(type: string): string;
    getBufferLength(type?: string): number;
    getNetworkActivity(): number;
    getBufferingInfo(): Record<string, any>;
    getStableBufferTime(): number;
    setStableBufferTime(time: number): void;
    updateSource(url: IMPDJsonData): Promise<boolean>;
    isLoadingFragment?(url: string): boolean;
    getVideoInfo(): DashPlayer['state'];
    setEndOfStreamState(v: boolean): void;
    getQualityNumberFromQualityIndex(qua: number, type: string): number;
    getQualityFor(type: string): number;
    setQualityFor(type: string, value: unknown): Promise<void>;
    getNextFragmentHistoryInfo?(): string;
}

interface IMPDJsonData {
    video: IAVStreamSegment[];
    audio: IAVStreamSegment[];
    duration: number;
    dolby?: {
        type: number;
        audio: IAVStreamSegment[];
    };
    flac?: {
        display: boolean;
        audio: IAVStreamSegment;
    }
}

interface IAVStreamSegment {
    id?: number;
    baseUrl?: string;
    codecid?: number;
    codecs?: string;
    backupUrl?: string[];
    // drm
    bilidrm_uri?: string;
    ContentProtection?: {
        schemeIdUri: string;
        value?: string;
        pssh?: {
            __prefix: string,
            __text: string
        }
    };
    widevine_pssh?: string;
}

interface FragmentLoadingAbandonedEvent {
    index: number;
    mediaType: 'audio' | 'video';
    qn: number;
    request: {
        bytesLoaded: number;
        requestStartDate: {
            getTime: () => number;
        };
        headersReceivedDate: {
            getTime: () => number;
        };
        requestEndDate: {
            getTime: () => number;
        };
        index: number;
        mediaType: 'audio' | 'video';
    }
};

interface IMpd {
    id: number;
    codecid: number;
    baseUrl: string;
    bandwidth: number;
}

interface IStatInfoInterface {
    currentSegmentIndex?: number;
    decodedFrames: number;
    droppedFrames: number;
    hasRedirect?: boolean;
    loaderType?: LoaderType; // e
    playerType: 'DashPlayer'; // e
    speed?: number;
    totalSegmentCount?: number;
    url: string;

    videoURL?: string;
    audioURL?: string;
    audioCurrentSegmentIndex?: number;
    audioTotalSegmentCount?: number;
    videoConnectionSpeed?: number;
    audioConnectionSpeed?: number;
    networkActivity?: number;

    segments: {
        video: IStatInfoInterface;
        audio: IStatInfoInterface;
    };
    videoCurrentSegmentIndex: number;
    audioCurrentSegmentIndex: number;
    qualityIndex: number;
}

export interface IVideoInfoEvent {
    mediaInfo: IMediaInfoInterface;
    statisticsInfo: IStatInfoInterface;
}

interface IMediaInfoInterface {
    audioChannelCount?: number;
    audioCodec?: string;
    audioDataRate?: number;
    audioSampleRate?: number;
    chromaFormat?: string;
    duration: number;
    fps?: number;
    hasAudio?: boolean;
    hasKeyframesIndex?: boolean;
    hasVideo?: boolean;
    height: number;
    level?: string;
    metadata?: IMetadataInterface;
    mimeType: string;
    profile?: string;
    sarDen?: number;
    sarNum?: number;
    segmentCount?: number;
    videoCodec?: string;
    videoDataRate?: number;
    width: number;
    [key: string]: any;
}

interface IMetadataInterface {
    audiocodecid: number;
    audiodatarate: number;
    audiosamplerate: number;
    audiosamplesize: number;
    audiosize: number;
    canSeekToEnd: boolean;
    creator: string;
    datasize: number;
    description?: string;
    duration: number;
    filesize: number;
    framerate: number;
    hasAudio: boolean;
    hasKeyframes: boolean;
    hasMetadata: boolean;
    hasVideo: boolean;
    height: number;
    keyframes: Array<number> | null;
    lastkeyframelocation: number;
    lastkeyframetimestamp: number;
    lasttimestamp: number;
    metadatacreator: string;
    stereo: boolean;
    videocodecid: number;
    videodatarate: number;
    videosize: number;
    width: number;
}

type LoaderType =
    | 'fetch-stream-loader'
    | 'websocket-loader'
    | 'xhr-moz-chunked-loader'
    | 'xhr-msstream-loader'
    | 'xhr-range-loader';

interface IDashPlayerOption {
    defaultVideoQuality: number;
    defaultAudioQuality: number;
    enableHEVC?: boolean;
    enableAV1?: boolean;
    isAutoPlay?: boolean;
    isDynamic?: boolean;
    enableMultiAudioTracks?: boolean;
    abrStrategy: typeof DashPlayer['STRING'][keyof typeof DashPlayer['STRING']];
    stableBufferTime: number;
    protectionDataSet?: IDRMProtection['protectionData'];
    ignoreEmeEncryptedEvent?: boolean;
}

interface IDRMProtection {
    protectionData: {
        "org.w3.clearkey"?: {
            clearkeys: Record<string, string>;
            priority: number;
        };
        "com.widevine.alpha"?: {
            serverURL: string;
            serverCertificate: string;
            priority: number;
        };
    };
    ignoreEmeEncryptedEvent?: boolean;
}

interface IQualityChange {
    currentTime: number;
    dict: { throughput: number[], latency: number[] };
    isAutoSwitch: boolean;
    mediaType: 'video' | 'audio';
    newQuality: number;
    newQualityNumber: number;
    oldQuality: number;
    oldQualityNumber: number;
}

export interface IQualityChangeRequested extends IQualityChange {
    type: "qualityChangeRequested";
}

export interface IQualityChangeRendered extends IQualityChange {
    type: "qualityChangeRendered";
}