declare interface swfobject {
    removeSWF: (target: string) => void;
    embedSWF: (...args: any[]) => void;
}

/**
 * @deprecated flashplayer已不被支持
 */
declare var swfobject: swfobject;