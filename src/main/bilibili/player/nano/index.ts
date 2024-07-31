import { GroupKind } from "./GroupKind";

export interface NanoInitData {
    aid?: number | string;
    cid?: number | string;
    bvid?: string;
    episodeId?: number | string;
    seasonId?: number | string;
    revision?: number
    featureList?: Set<string>,
    enableAV1?: boolean;
    enableWMP?: boolean;
    enableHEVC?: boolean;
    hideBoxShadow?: boolean;
    t?: number;
    kind?: GroupKind;
    element?: HTMLDivElement;
    auxiliary?: HTMLDivElement;
}