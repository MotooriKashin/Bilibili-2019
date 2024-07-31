/** 取流常数 */
export enum FNVAL {
    VER = 0,
    /** 优先返回 flv 格式视频地址 */
    FLV = 0b0,
    /** 只返回 mp4 格式的视频地址 */
    MP4 = 0b1,
    /** 优先返回 DASH-H265 视频的JSON内容 */
    DASH_H265 = 0b10000,
    /** 优先返回 HDR 的视频地址 */
    HDR = 0b1000000,
    /** 优先返回 4K 的视频地址 */
    DASH_4K = 0b10000000,
    /** 优先返回 杜比音频 的视频地址 */
    DOLBY_AUDIO = 0b100000000,
    /** 优先返回 杜比视界 的视频地址 */
    DOLBY_VIDEO = 0b1000000000,
    /** 优先返回 8K 的视频地址 */
    DASH_8K = 0b10000000000,
    /** 优先返回 AV1 的视频地址 */
    DASH_AV1 = 0b100000000000,
}