import { Api } from "../..";
import { RestType } from "../../../../../code";

export async function v2(
    cid: number,
    aid: number,
    season_id?: number,
    graph_version?: number,
) {
    const url = new URL(Api + '/x/player/v2');
    url.searchParams.set('cid', <any>cid);
    url.searchParams.set('aid', <any>aid);
    season_id && url.searchParams.set('season_id', <any>season_id);
    graph_version && url.searchParams.set('graph_version', <any>graph_version);
    const response = await fetch(url, { credentials: 'include' });
    return <IPlayerV2>await response.json();
}

/** 用户角色 */
export enum USER {
    /** 未登录 */
    UNLOGIN = 0,
    /** 受限制 */
    LIMITED = 1,
    /** 已注册 */
    REGISTERED = 2,
    /** 正式用户 */
    NORMAL = 3,
    /** VIP */
    VIP = 4,
    /** 职人 */
    ADVANCED = 5,
}

export interface IPlayerV2 extends RestType {
    data: {
        aid: number;
        /** 视频cid */
        cid: number;
        /** 是否允许承包 */
        allow_bp: boolean;
        /** 是否禁止分享 */
        no_share: boolean;
        /** 封禁天数  */
        block_time?: number;
        /** 节操值 */
        moral?: number;
        /** 当前分p是第几p */
        page_no: number;
        /** @deprecated 是否有下一个视频 */
        has_next: boolean;
        /** 是否是系统管理员，由permission字段确认 */
        is_system_admin?: boolean;
        /** 
         * 用户身份，由permission字段确认 
         * | 0 | 1 | 2 | 3 | 4 | 5 |
         * | :-: | :-: | :-: | :-: | :-: | :-: |
         * | 未登录 | 受限制 | 已注册 | 正式用户 | VIP | 职人 |
         */
        role: USER;
        /** 用户是否登录 */
        login_mid: number;
        /** uid加密后的hash串 */
        login_mid_hash?: string;
        /** 是否是该视频up */
        is_owner: boolean;
        /**  用户名  */
        name?: string;
        /** 登录用户rank值，特殊权限相关 */
        permission?: string;
        /** 登录用户等级信息  */
        level_info: {
            current_level?: number;
            current_min?: number;
            current_exp?: number;
            next_exp?: number;
        };
        /** vip状态 */
        vip: {
            /** vip类型 */
            type: number;
            status: number;
            due_date?: number;
            vip_pay_type?: number;
        };
        /** 
         * 用户答题状态
         * | 0 | 1 | 2 | 3 |
         * | :-: | :-: | :-: | :-: |
         * | 默认值 | 未答题 | 答题中 | 答题通过 |
         */
        answer_status: number;
        /** 上次观看进度 */
        last_play_time: number;
        /** 上次观看视频的cid */
        last_play_cid: number;
        /** 在线人数 */
        online_count: number;
        /** 弹幕蒙版 */
        dm_mask?: {
            fps: number;
            mask_url: string;
        };
        /** 视频字幕数据 */
        subtitle?: {
            allow_submit: boolean;
            lan: string;
            lan_doc: string;
            subtitles: ISubtitleItem[];
        };
        /** 视频进度拖动条上thumb的icon  */
        player_icon?: {
            url1: string;
            hash1: string;
            url2: string;
            hash2: string;
        };
        /** 高能看点 */
        view_points?: IViewPoint[];
        /** 是否为ugc付费预览视频 */
        is_ugc_pay_preview?: boolean;
        /** ugc付费预览toast用 | 分割2个文案  */
        preview_toast?: string;
        /** 互动视频相关数据 */
        interaction?: {
            history_node?: {
                node_id: number;
                title: string;
                cid: number;
            };
            graph_version: number;
            msg: string;
            mark: number;
            need_reload?: number;
        };
        pugv?: {
            /**
             * 试看状态
             * | 1 | 2 | 3 |
             * | :-: | :-: | :-: |
             * | 试看 | 非试看 | 5分钟预览 |
             */
            watch_status: number;
            /**
             * 购买状态
             * | 1 | 2 |
             * | :-: | :-: |
             * | 购买 | 未购买 |
             */
            pay_status: number;
            /**
             * 上架状态
             * | 1 | 2 |
             * | :-: | :-: |
             * | 上架 | 下架 |
             */
            season_status: number;
        };
        /** 透传视频云 */
        pcdn_loader?: {
            flv?: {
                vendor?: string;
                script_url?: string;
                group?: string;
                labels?: any;
            };
            dash?: {
                vendor?: string;
                script_url?: string;
                group?: string;
                labels?: any;
            };
        };
        options?: {
            /** 是否为全景视频 */
            is_360?: boolean;
            /** 稿件高清晰度不需要vip鉴权 */
            without_vip?: boolean;
        };
        /** up主引导关注按钮配置参数 */
        guide_attention?: IGuideAttention[];
        /** 跳转卡片配置参数 */
        jump_card?: ISkipCard[];
        /** 控制 添加字幕 */
        online_switch?: {
            /** 按钮的点击策略，0 表示关闭投稿字幕功能 */
            subtitle_submit_switch: string;
        };
        operation_card?: IOperationCard[];
        fawkes?: {
            config_version?: number;
            ff_version?: number;
        };
        show_switch?: IShowSwitchConfig;
        /** 云推荐弹幕 */
        default_dm?: number;
    }
}

interface IDanmakuConf {
    color: number;
    fontsize: Readonly<[number, number, number, number, number, number, number]>;
    initStatus: number;
    input: Readonly<[number, number]>;
    mode: Readonly<[number, number, number, number]>;
    pool: Readonly<[number, number]>;
}

export interface ISubtitleItem {
    id: number;
    lan: string;
    lan_doc: string;
    is_lock: boolean;
    author_mid?: number;
    subtitle_url: string;
    ai_type: number;
}

export interface IViewPoint {
    logoUrl: any;
    imgUrl: any;
    type: number;
    from: number;
    to: number;
    content: string;
}

interface IGuideAttention {
    type: number;
    from: number;
    to: number;
    pos_x: number;
    pos_y: number;
}


interface IShowSwitchConfig {
    /** 是否显示在线人数 */
    online?: boolean;
    /** 是否展示精度变化进度条 */
    long_progress?: boolean;
}

interface IOperationCard {
    id?: number;
    from?: number;
    to?: number;
    status?: boolean;
    card_type?: number;
    biz_type?: number;
    standard_card?: {
        title?: string;
        button_title?: string;
        button_selected_title?: string;
        show_selected?: boolean;
    };
    param_follow?: {
        season_id?: number;
    };
    param_reserve?: {
        activity_id?: number;
    };
    skip_card?: ISkipCard;
}

export interface ISkipCard {
    id: number;
    from: number;
    to: number;

    /**
     * | true | false |
     * | :-: | :-: |
     * | 已选 | 未选 |
     */
    status: boolean;
    /**
     * | 1 | 2 |
     * | :-: | :-: |
     * | 标准卡 | 原跳转卡 |
     */
    cardType: number;

    // 必剪数据
    icon?: string;
    label?: string;
    content?: string;
    button?: string;
    link?: string;

    // 预约数据
    title?: string;
    buttonTitle?: string;
    buttonSelectedTitle?: string;
    showSelected?: boolean;
    seasonId?: number;
    activityId?: number;
    /**
     * | 1 | 2 | 3 |
     * | :-: | :-: | :-: |
     * | 追番追剧 | 活动预约 | 跳转链接 |
     */
    bizType?: number;
}