import { pgcPlayurl } from "../../io/com/bilibili/api/pgc/player/web/playurl";
import { IModulePositiveEpisode, pgcAppSeason } from "../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { playurl } from "../../io/com/bilibili/api/x/player/playurl";
import { toviewWeb } from "../../io/com/bilibili/api/x/v2/history/toview/web";
import { detail } from "../../io/com/bilibili/api/x/web-interface/view/detail";
import { PlayViewUnite } from "../../io/net/biliapi/grpc/bilibili.app.playerunite.v1.Player/PlayViewUnite";
import { toastr } from "../../toastr";
import { AV } from "../../utils/av";
import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import { Format } from "../../utils/fomat";
import { MAIN_EVENT, mainEv } from "../event";
import { IDM } from "../IDM";
import { ROUTER } from "../router";
import stylesheet from "./index.css" with {type: 'css'};

/** 下载功能 */
@customElement(undefined, `download-${Date.now()}`)
export class Download extends HTMLElement {

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

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #host = this.attachShadow({ mode: 'closed' });

    #container = Element.add('div', {
        appendTo: this.#host, class: 'container', innerHTML: '<header>下载配置</header>'
    });

    #from = Element.add('form', { appendTo: this.#container });

    #method = Element.add('label', {
        appendTo: this.#from, data: { label: '下载方式' }, innerHTML: `<select name="method" title="要使用的下载方法。\n">
    <option value="0" disabled>浏览器</option>
    <option value="1" selected>IDM</option>
</select>` });

    #playurl = Element.add('label', {
        appendTo: this.#from, data: { label: '下载源' }, innerHTML: `<select name="playurl" title="要下载的流的来源。\n不同的来源能获取到的资源或许有差异。">
    <option value="0" selected>api.bilibili.com/x/player/playurl</option>
    <option value="1">bilibili.app.playerunite.v1.Player/PlayViewUnite</option>
</select>` });

    #codeType = Element.add('label', {
        appendTo: this.#from, data: { label: '视频编码' }, innerHTML: `<select name="codetype" title="要指定的视频编码。\n部分下载来源需要提前指定视频编码，另一部分则不用。">
    <option value="1" selected>AVC</option>
    <option value="2">HEVC</option>
    <option value="3">AV1</option>
</select>` });

    // #idm = Element.add('fieldset', { appendTo: this.#from, attribute: { name: 'idm' }, innerHTML: '<legend>IDM</legend>' });

    #fileName = Element.add('input', { appendTo: Element.add('label', { appendTo: this.#from, data: { label: '文件名' }, attribute: { title: '指定要保存的文件名（不含拓展名）。\n一般点击【获取】按钮会自动生成，可以在其基础上修改。\n另外，不是所有下载方式都支持指定文件名。' } }), attribute: { name: 'filename' } });

    #referer = Element.add('input', { appendTo: Element.add('label', { appendTo: this.#from, data: { label: 'Referer' }, attribute: { title: '鉴权请求头之一。\n不正确的数值将导致服务器拒绝下载请求，除非你明确知道正确数值，否则不建议修改。\n该请求头包含了当前下载请求的来源页面的地址，即表示当前下载是通过此来源页面里的链接发起的。' } }), attribute: { name: 'referer' } });

    #userAgent = Element.add('input', { appendTo: Element.add('label', { appendTo: this.#from, data: { label: 'User-Agent' }, attribute: { title: '鉴权请求头之一。\n不正确的数值将导致服务器拒绝下载请求，除非你明确知道正确数值，否则不建议修改。\n该请求头是一个特征字符串，使得服务器和对等网络能够识别发出下载请求的用户代理的应用程序、操作系统、供应商或版本信息。' } }), attribute: { name: 'useragent' } });

    #action = Element.add('button', { appendTo: this.#from, innerText: '获取', attribute: { title: '获取或刷新下载流，点击后将在页面底部列出所有获取到的下载流。\n一般在修改【下载源】、【视频编码】等情况下需要点击进行刷新。' } });

    #wrap = Element.add('div', { appendTo: this.#from, class: 'wrap' });

    #router?: ROUTER;

    #url?: URL;

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];

        this.popover = 'auto';
        this.#wrap.popover = 'auto';

        this.#referer.value = location.origin;
        this.#userAgent.value = 'Bilibili Freedoooooom/MarkII';

        mainEv.bind(MAIN_EVENT.NAVIGATE, ({ detail }) => {
            this.#router = detail[0];
            this.#url = detail[1];
            this.#wrap.replaceChildren();
            this.#fileName.value = '';
        });

        this.#from.addEventListener('submit', e => {
            e.preventDefault();

            if (this.#router !== undefined && this.#url) {
                this.$navigate(this.#router, this.#url);
            }
        });
    }

    /** 路由 */
    private async $navigate(
        router: ROUTER,
        url: URL,
    ) {
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                if (aid) {
                    detail(aid)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            // 视频信息
                            const { View } = data;
                            const { aid, cid, title } = View;
                            this.#fileName.value = title;
                            this.callPlayurl(aid, cid);
                        })
                        .catch(e => {
                            toastr.error('解析下载数据出错', e);
                            console.error(e);
                        });
                }
                break;
            }
            case ROUTER.BANGUMI: {
                const path = url.pathname.split('/');
                let ssid = 0, epid = 0;
                switch (true) {
                    case /^ss\d+$/i.test(path[3]): {
                        ssid = +path[3].slice(2);
                        break;
                    }
                    case /^ep\d+$/i.test(path[3]): {
                        epid = +path[3].slice(2);
                        break;
                    }
                }
                if (ssid || epid) {
                    pgcAppSeason(ssid ? { season_id: ssid } : { ep_id: epid })
                        .then(async ({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            ssid || (ssid = data.season_id);
                            epid || (data.user_status.progress?.last_ep_id && (epid = data.user_status.progress?.last_ep_id));
                            let ep: IEpisode | IModulePositiveEpisode | undefined;
                            data.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        if (!ep) {
                                            epid || (epid = d.data.episodes[0]?.ep_id);
                                            if (epid) {
                                                ep = d.data.episodes.find(d => d.ep_id === epid);
                                            }
                                        }
                                        break;
                                    }
                                }
                            });
                            if (!ep) {
                                if (ssid) {
                                    const { code, message, result } = await pgcSection(ssid);
                                    if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                                    const eps = (<IEpisode[]>[]).concat(...(result.main_section?.episodes || []), ...result.section.map(d => d.episodes));
                                    ep = epid ? eps.find(d => d.id === epid) : eps[0];
                                } else {
                                    throw new ReferenceError('番剧信息里未包含有效分集列表？', { cause: { code, message, data } });
                                }
                            }
                            if (!ep) throw new ReferenceError('番剧信息里未包含有效分集列表？', { cause: { code, message, data } });
                            this.#fileName.value = `${data.title}：${isNaN(+ep.title) ? ep.title : `第${ep.title}话`} ${ep.long_title}`;
                            this.callPlayurl(ep.aid, ep.cid, ssid, epid);
                        })
                        .catch(e => {
                            console.error(e);
                        });
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                let aid = 0;
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                if (aid) {
                    this.$navigate(ROUTER.AV, new URL(`https://www.bilibili.com/video/av${aid}`));
                } else {
                    toviewWeb()
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            aid || (aid = data.list[0].aid);
                            this.$navigate(ROUTER.AV, new URL(`https://www.bilibili.com/video/av${aid}`));
                        })
                        .catch(console.error);
                }
                break;
            }
        }
    }

    private getp(v: number) {
        switch (true) {
            case v >= 2160: return 'ultrahighres';
            case v > 1080: return 'highres';
            case v > 720: return 'hd1080';
            case v > 480: return 'hd720';
            default: return 'large';
        }
    }

    private getq(v: number) {
        switch (true) {
            case v >= 120: return 'ultrahighres';
            case v > 80: return 'highres';
            case v > 72: return 'hd1080';
            case v > 32: return 'hd720';
            default: return 'large';
        }
    }

    private callPlayurl(
        aid: number,
        cid: number,
        ssid?: number,
        epid?: number,
    ) {
        const form = new FormData(this.#from);
        const pl = form.get('playurl');
        switch (pl) {
            case '0': {
                if (epid) {
                    pgcPlayurl(aid, cid, epid)
                        .then(({ code, message, result }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, result } });
                            const { durl, dash, support_formats, quality } = result;
                            const divs = <Record<string, HTMLDivElement>>{};
                            if (dash) {
                                const { video, audio, flac, dolby, duration } = dash;
                                video.forEach((d, i) => {
                                    switch (d.codecid) {
                                        case 7: {
                                            divs.avc || (divs.avc = Element.add('div', { appendTo: this.#wrap, class: 'i-m4v', data: { label: 'AVC' } }));
                                            Element.add('div', { appendTo: divs.avc, class: this.getp(d.height), data: { quality: support_formats.find(e => e.quality === d.id)?.display_desc || `${d.height}P`, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                                this.callMethod(d.baseUrl, this.#fileName.value + '.m4v', this.#referer.value, this.#userAgent.value);
                                            });
                                            break;
                                        }
                                        case 12: {
                                            divs.hevc || (divs.hevc = Element.add('div', { appendTo: this.#wrap, class: 'i-hevc', data: { label: 'HEVC' } }));
                                            Element.add('div', { appendTo: divs.hevc, class: this.getp(d.height), data: { quality: support_formats.find(e => e.quality === d.id)?.display_desc || `${d.height}P`, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                                this.callMethod(d.baseUrl, this.#fileName.value + '.m4v', this.#referer.value, this.#userAgent.value);
                                            });
                                            break;
                                        }
                                        case 13: {
                                            divs.av1 || (divs.av1 = Element.add('div', { appendTo: this.#wrap, class: 'i-av1', data: { label: 'AV1' } }));
                                            Element.add('div', { appendTo: divs.av1, class: this.getp(d.height), data: { quality: support_formats.find(e => e.quality === d.id)?.display_desc || `${d.height}P`, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                                this.callMethod(d.baseUrl, this.#fileName.value + '.m4v', this.#referer.value, this.#userAgent.value);
                                            });
                                            break;
                                        }
                                    }
                                });
                                if (flac) {
                                    divs.flac = Element.add('div', { appendTo: this.#wrap, class: 'i-opus', data: { label: 'FLAC' } });
                                    Element.add('div', { appendTo: divs.flac, class: 'ultrahighres', data: { quality: 'HiRes', size: <any>Format.fileSize(flac.audio.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                        this.callMethod(flac.audio.baseUrl, this.#fileName.value + '.flac', this.#referer.value, this.#userAgent.value);
                                    });
                                }
                                dolby.audio.forEach(d => {
                                    divs.dolby = Element.add('div', { appendTo: this.#wrap, class: 'i-ac3', data: { label: '杜比音效' } });
                                    Element.add('div', { appendTo: divs.dolby, class: 'ultrahighres', data: { quality: 'HiRes', size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                        this.callMethod(d.baseUrl, this.#fileName.value + '.flac', this.#referer.value, this.#userAgent.value);
                                    });
                                });
                                audio.forEach(d => {
                                    divs.aac || (divs.aac = Element.add('div', { appendTo: this.#wrap, class: 'i-m4a', data: { label: 'AAC' } }));
                                    Element.add('div', { appendTo: divs.aac, class: 'large', data: { quality: <any>d.id, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                        this.callMethod(d.baseUrl, this.#fileName.value + '.m4a', this.#referer.value, this.#userAgent.value);
                                    });
                                });
                            } else if (durl) {
                                const type = durl[0].url.includes('flv') ? 'flv' : 'mp4';
                                divs[type] || (divs[type] = Element.add('div', { appendTo: this.#wrap, class: `i-${type}`, data: { label: type.toUpperCase() } }));
                                durl.forEach(d => {
                                    Element.add('div', { appendTo: divs[type], class: this.getq(quality), data: { quality: support_formats.find(e => e.quality === quality)?.display_desc + '-' + d.order, size: <any>Format.fileSize(Number(d.size)) } }).addEventListener('click', () => {
                                        this.callMethod(d.url, this.#fileName.value + `.${type}`, this.#referer.value, this.#userAgent.value);
                                    });
                                })
                            }
                        })
                        .catch(e => {
                            toastr.error('获取下载源出错', e);
                            console.error(e);
                        });

                } else {
                    playurl(aid, cid)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            const { durl, dash, support_formats, quality } = data;
                            const divs = <Record<string, HTMLDivElement>>{};
                            if (dash) {
                                const { video, audio, flac, dolby, duration } = dash;
                                video.forEach((d, i) => {
                                    switch (d.codecid) {
                                        case 7: {
                                            divs.avc || (divs.avc = Element.add('div', { appendTo: this.#wrap, class: 'i-m4v', data: { label: 'AVC' } }));
                                            Element.add('div', { appendTo: divs.avc, class: this.getp(d.height), data: { quality: support_formats.find(e => e.quality === d.id)?.display_desc || `${d.height}P`, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                                this.callMethod(d.baseUrl, this.#fileName.value + '.m4v', this.#referer.value, this.#userAgent.value);
                                            });
                                            break;
                                        }
                                        case 12: {
                                            divs.hevc || (divs.hevc = Element.add('div', { appendTo: this.#wrap, class: 'i-hevc', data: { label: 'HEVC' } }));
                                            Element.add('div', { appendTo: divs.hevc, class: this.getp(d.height), data: { quality: support_formats.find(e => e.quality === d.id)?.display_desc || `${d.height}P`, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                                this.callMethod(d.baseUrl, this.#fileName.value + '.m4v', this.#referer.value, this.#userAgent.value);
                                            });
                                            break;
                                        }
                                        case 13: {
                                            divs.av1 || (divs.av1 = Element.add('div', { appendTo: this.#wrap, class: 'i-av1', data: { label: 'AV1' } }));
                                            Element.add('div', { appendTo: divs.av1, class: this.getp(d.height), data: { quality: support_formats.find(e => e.quality === d.id)?.display_desc || `${d.height}P`, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                                this.callMethod(d.baseUrl, this.#fileName.value + '.m4v', this.#referer.value, this.#userAgent.value);
                                            });
                                            break;
                                        }
                                    }
                                });
                                if (flac) {
                                    divs.flac = Element.add('div', { appendTo: this.#wrap, class: 'i-opus', data: { label: 'FLAC' } });
                                    Element.add('div', { appendTo: divs.flac, class: 'ultrahighres', data: { quality: 'HiRes', size: <any>Format.fileSize(flac.audio.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                        this.callMethod(flac.audio.baseUrl, this.#fileName.value + '.flac', this.#referer.value, this.#userAgent.value);
                                    });
                                }
                                dolby.audio.forEach(d => {
                                    divs.dolby = Element.add('div', { appendTo: this.#wrap, class: 'i-ac3', data: { label: '杜比音效' } });
                                    Element.add('div', { appendTo: divs.dolby, class: 'ultrahighres', data: { quality: 'HiRes', size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                        this.callMethod(d.baseUrl, this.#fileName.value + '.flac', this.#referer.value, this.#userAgent.value);
                                    });
                                });
                                audio.forEach(d => {
                                    divs.aac || (divs.aac = Element.add('div', { appendTo: this.#wrap, class: 'i-m4a', data: { label: 'AAC' } }));
                                    Element.add('div', { appendTo: divs.aac, class: 'large', data: { quality: <any>d.id, size: <any>Format.fileSize(d.bandwidth * duration / 8) } }).addEventListener('click', () => {
                                        this.callMethod(d.baseUrl, this.#fileName.value + '.m4a', this.#referer.value, this.#userAgent.value);
                                    });
                                });
                            } else if (durl) {
                                const type = durl[0].url.includes('flv') ? 'flv' : 'mp4';
                                divs[type] || (divs[type] = Element.add('div', { appendTo: this.#wrap, class: `i-${type}`, data: { label: type.toUpperCase() } }));
                                durl.forEach(d => {
                                    Element.add('div', { appendTo: divs[type], class: this.getq(quality), data: { quality: support_formats.find(e => e.quality === quality)?.display_desc + '-' + d.order, size: <any>Format.fileSize(Number(d.size)) } }).addEventListener('click', () => {
                                        this.callMethod(d.url, this.#fileName.value + `.${type}`, this.#referer.value, this.#userAgent.value);
                                    });
                                })
                            }
                        })
                        .catch(e => {
                            toastr.error('获取下载源出错', e);
                            console.error(e);
                        });
                }
                break;
            }
            case '1': {
                const accessKey = localStorage.getItem('access_key');
                if (!accessKey) throw new ReferenceError('请先获取移动端鉴权~');
                PlayViewUnite({ accessKey, aid: BigInt(aid), cid: BigInt(cid), preferCodecType: Number(form.get('codetype')) || 0 })
                    .then(({ vodInfo }) => {
                        if (!vodInfo) throw new ReferenceError('未获取到下载源');
                        this.#wrap.replaceChildren();
                        const { dashAudio, streamList, lossLessItem } = vodInfo;
                        const divs = <Record<string, HTMLDivElement>>{};
                        streamList.forEach(d => {
                            const { dashVideo, streamInfo, segmentVideo } = d;
                            if (dashVideo) {
                                switch (dashVideo.codecid) {
                                    case 7: {
                                        divs.avc || (divs.avc = Element.add('div', { appendTo: this.#wrap, class: 'i-m4v', data: { label: 'AVC' } }));
                                        Element.add('div', { appendTo: divs.avc, class: this.getp(dashVideo.height), data: { quality: streamInfo?.description || `${dashVideo.height}P`, size: <any>Format.fileSize(Number(dashVideo.size)) } }).addEventListener('click', () => {
                                            this.callMethod(dashVideo.baseUrl, this.#fileName.value + '.m4v', '', this.#userAgent.value);
                                        });
                                        break;
                                    }
                                    case 12: {
                                        divs.hevc || (divs.hevc = Element.add('div', { appendTo: this.#wrap, class: 'i-hevc', data: { label: 'HEVC' } }));
                                        Element.add('div', { appendTo: divs.hevc, class: this.getp(dashVideo.height), data: { quality: streamInfo?.description || `${dashVideo.height}P`, size: <any>Format.fileSize(Number(dashVideo.size)) } }).addEventListener('click', () => {
                                            this.callMethod(dashVideo.baseUrl, this.#fileName.value + '.m4v', '', this.#userAgent.value);
                                        });
                                        break;
                                    }
                                    case 13: {
                                        divs.av1 || (divs.av1 = Element.add('div', { appendTo: this.#wrap, class: 'i-av1', data: { label: 'AV1' } }));
                                        Element.add('div', { appendTo: divs.av1, class: this.getp(dashVideo.height), data: { quality: streamInfo?.description || `${dashVideo.height}P`, size: <any>Format.fileSize(Number(dashVideo.size)) } }).addEventListener('click', () => {
                                            this.callMethod(dashVideo.baseUrl, this.#fileName.value + '.m4v', '', this.#userAgent.value);
                                        });
                                        break;
                                    }
                                }
                            } else if (segmentVideo) {
                                const type = segmentVideo.segment[0].url.includes('flv') ? 'flv' : 'mp4';
                                divs[type] || (divs[type] = Element.add('div', { appendTo: this.#wrap, class: `i-${type}`, data: { label: type.toUpperCase() } }));
                                segmentVideo.segment.forEach(d => {
                                    Element.add('div', { appendTo: divs[type], class: this.getq(streamInfo?.quality || 0), data: { quality: streamInfo?.description! + '-' + d.order, size: <any>Format.fileSize(Number(d.size)) } }).addEventListener('click', () => {
                                        this.callMethod(d.url, this.#fileName.value + `.${type}`, '', this.#userAgent.value);
                                    });
                                });
                            }
                        });
                        if (lossLessItem?.audio) {
                            divs.flac = Element.add('div', { appendTo: this.#wrap, class: 'i-opus', data: { label: 'FLAC' } });
                            Element.add('div', { appendTo: divs.flac, class: 'ultrahighres', data: { quality: 'HiRes', size: <any>Format.fileSize(Number(lossLessItem.audio.size)) } }).addEventListener('click', () => {
                                this.callMethod(lossLessItem.audio!.baseUrl, this.#fileName.value + '.flac', '', this.#userAgent.value);
                            });
                        }
                        dashAudio.forEach(d => {
                            divs.aac || (divs.aac = Element.add('div', { appendTo: this.#wrap, class: 'i-m4a', data: { label: 'AAC' } }));
                            Element.add('div', { appendTo: divs.aac, class: 'large', data: { quality: <any>d.id, size: <any>Format.fileSize(Number(d.size)) } }).addEventListener('click', () => {
                                this.callMethod(d.baseUrl, this.#fileName.value + '.m4a', '', this.#userAgent.value);
                            });
                        });
                        this.#wrap.showPopover();
                    })
                    .catch(e => {
                        toastr.error('获取下载源出错', e);
                        console.error(e);
                    });
                break;
            }
        }
    }

    private callMethod(
        url: string,
        fileName?: string,
        referer?: string,
        userAgent?: string,
    ) {
        const form = new FormData(this.#from);
        const method = form.get('method');

        switch (method) {
            case '1': {
                IDM.download({ url, fileName, userAgent, referer, origin: referer });
                break;
            }
        }
    }
}