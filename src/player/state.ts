/** 播放器状态 */
export const PLAYER_STATE = {
    /**
     * 播放器模式  
     * 使用二进制位判定 {@link PLAYER_MODE}
     */
    mode: 0,
}

/**
 * 播放器模式  
 * 使用二进制位判定
 */
export enum PLAYER_MODE {
    /** 宽屏 */
    WIDE = 0B1,
    /** 网页全屏 */
    WEB = 0B10,
    /** 全屏 */
    FULL = 0B100,
}