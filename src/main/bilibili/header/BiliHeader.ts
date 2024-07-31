export interface BiliHeader {
    components: unknown;
    config: {
        disableChannelEntry?: boolean;
        disableSticky?: boolean;
        forceVersion?: number;
        headerType: 'mini' | 'medium';
        theme?: 'light';
        tokenSupport?: boolean;
    }
}