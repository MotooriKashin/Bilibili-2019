import { Api } from "../../..";

/**
 * 获取Banner信息
 * 
 * @param resource_id 资源id
 */
export async function header(resource_id = 142) {
    if (CATCH[resource_id]) return CATCH[resource_id];
    const url = new URL(Api + '/x/web-show/page/header');
    url.searchParams.set('resource_id', <any>resource_id);
    const response = await fetch(url, { credentials: 'include' });
    return CATCH[resource_id] = <IHeader>(await response.json()).data;
}

/** 同一请求缓存 */
const CATCH: Record<number, IHeader> = {};

interface IHeader {
    is_split_layer: number;
    litpic: string;
    name: string;
    pic: string;
    request_id: string;
    /** 格式化后{@link ISplitLayer} */
    split_layer: string;
    url: string;
}

export interface ISplitLayer {
    version: string;
    layers: ILayer[];
}

interface ILayer {
    blur?: {
        initial?: number;
        offset?: number;
        /** 不存在时默认clamp */
        wrap?: 'clamp' | 'alternate';
    };
    id: number;
    name: string;
    opacity?: {
        initial?: number;
        offset?: number;
        /** 不存在时默认clamp */
        wrap?: 'clamp' | 'alternate';
    };
    resources: {
        id: number;
        src: string;
    }[];
    rotate?: {
        initial?: number;
        offset?: number;
    };
    scale?: {
        initial?: number;
        offset?: number;
    };
    translate?: {
        initial?: [number, number];
        offset?: [number, number];
    }
}