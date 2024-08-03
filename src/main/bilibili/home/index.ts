import { TYPE } from "../../../io/com/bilibili/api/pgc/web/timeline";
import { add } from "../../../io/com/bilibili/api/x/v2/history/toview/add";
import { del } from "../../../io/com/bilibili/api/x/v2/history/toview/del";
import { REGION } from "../../../io/com/bilibili/api/x/web-interface/dynamic/region";
import { rcmd } from "../../../io/com/bilibili/api/x/web-interface/index/top/rcmd";
import { locs } from "../../../io/com/bilibili/api/x/web-show/res/locs";
import { getList } from "../../../io/com/bilibili/live/api/xlive/web-interface/v1/webMain/getList";
import { getMoreRecList } from "../../../io/com/bilibili/live/api/xlive/web-interface/v1/webMain/getMoreRecList";
import svg_reflesh from "../../../player/assets/svg/reflesh.svg";
import svg_sent from "../../../player/assets/svg/sent.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { AV } from "../../../utils/av";
import { cookie } from "../../../utils/cookie";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
import { Ranking } from "./ranking";
import { Timeline } from "./timeline";
import { VideoInfo } from "./video-info";

/** 顶栏 */
@customElement('div')
export class Home extends HTMLDivElement {

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

    private $chief_recommend = Element.add('div', { class: 'chief-recommend' }, this);

    private $carousel_box = Element.add('a', { class: 'carousel-box', target: '_blank' }, this.$chief_recommend);

    private $trig = Element.add('form', { class: 'trig' }, this.$chief_recommend);

    private $recommend_module = Element.add('div', { class: 'recommend-module' }, this.$chief_recommend);

    private $recommend_flesh = Element.add('button', { class: 'recommend-flesh', title: '刷新' }, this.$chief_recommend, svg_reflesh);

    private $home_popularize = Element.add('div', { class: 'home-popularize' }, this);

    private $popularize = Element.add('div', { class: 'popularize' }, this.$home_popularize, '<div class="headline"><i class="icon-t icon-promote"></i>推广</div><div class="storey-box"></div>');

    private $rank_list = Element.add('div', { class: 'rank_list' }, this.$home_popularize, '<a href="/video/online.html" target="_blank">在线列表</a>');

    private rollTimer?: number;

    private $bili_live = Element.add('div', { class: 'bili-live' }, this);

    private $bili_live_l = Element.add('div', { class: 'l-con' }, this.$bili_live, `<div class="headline"><i class="icon-t icon-promote"></i><a href="//live.bilibili.com/" target="_blank" class="name">正在直播</a><button class="read-push">${svg_reflesh}刷新动态</button><a href="//live.bilibili.com/" target="_blank" class="link-more">更多${svg_sent}</a></div><div class="storey-box"></div>`);

    private $bili_live_r = Element.add('div', { class: 'r-con' }, this.$bili_live);

    private $bili_live_r_tab = Element.add('form', { class: 'bili-tab' }, this.$bili_live_r);

    private $bili_live_r_box = Element.add('div', { class: 'tab-box' }, this.$bili_live_r);

    private $bili_douga = this.appendChild(new Ranking('动画', '/v/douga', REGION.DOUGA));

    private $timeline_bangumi = this.appendChild(new Timeline('番剧', '/anime', TYPE.BANGUMI, REGION.BANGUMI));

    private $bili_bangumi = this.appendChild(new Ranking('番剧动态', '/anime', REGION.BANGUMI));

    private $timeline_guochuang = this.appendChild(new Timeline('国创', '/guochuang', TYPE.GUOCHUANG, REGION.GUOCHUANG));

    private $bili_guochuang = this.appendChild(new Ranking('国产原创相关', '/guochuang', REGION.GUOCHUANG));

    private $bili_music = this.appendChild(new Ranking('音乐', '/v/music', REGION.MUSCI));

    private $bili_dance = this.appendChild(new Ranking('舞蹈', '/v/dance', REGION.DANCE));

    private $bili_game = this.appendChild(new Ranking('游戏', '/v/game', REGION.GAME));

    private $bili_knowledge = this.appendChild(new Ranking('知识', '/v/knowledge', REGION.KNOWLEDGE));

    private $bili_technology = this.appendChild(new Ranking('科技', '/v/tech', REGION.TECHNOLOGY));

    private $bili_life = this.appendChild(new Ranking('生活', '/v/life', REGION.LIFE));

    private $bili_kichiku = this.appendChild(new Ranking('鬼畜', '/v/kichiku', REGION.KICHIKU));

    private $bili_fashion = this.appendChild(new Ranking('时尚', '/v/fashion', REGION.FASHION));

    private $bili_news = this.appendChild(new Ranking('资讯', '/v/information', REGION.NEWS));

    private $bili_ent = this.appendChild(new Ranking('娱乐', '/v/ent', REGION.ENT));

    private $bili_movie = this.appendChild(new Ranking('电影', '/movie', REGION.MOVIE));

    private $bili_tv = this.appendChild(new Ranking('电视剧', '/tv', REGION.TV));

    private $bili_cinephile = this.appendChild(new Ranking('影视', '/v/cinephile', REGION.CINEPHILE));

    private $bili_documentary = this.appendChild(new Ranking('纪录片', '/documentary', REGION.DOCUMENTARY));

    constructor() {
        super();
        this.insertAdjacentHTML('beforeend', `<style>${__BILI_HOME_STYLE__}</style>`);

        const id = crypto.randomUUID();
        this.$bili_live_r_tab.insertAdjacentHTML('afterbegin', `<label><input type="radio" name=${id} value="0" checked>直播排行</label><label><input type="radio" name=${id} value="1">关注的主播</label><label><input type="radio" name=${id} value="2">为您推荐</label>`);
        this.$bili_douga.classList.add('bili-douga');
        this.$bili_bangumi.classList.add('no-icon');
        this.$bili_guochuang.classList.add('no-icon');
        this.$bili_music.classList.add('bili-music');
        this.$bili_dance.classList.add('bili-dance');
        this.$bili_game.classList.add('bili-game');
        this.$bili_knowledge.classList.add('bili-knowledge');
        this.$bili_technology.classList.add('bili-technology');
        this.$bili_life.classList.add('bili-life');
        this.$bili_kichiku.classList.add('bili-kichiku');
        this.$bili_fashion.classList.add('bili-fashion');
        this.$bili_news.classList.add('no-icon');
        this.$bili_ent.classList.add('bili-ent');
        this.$bili_movie.classList.add('bili-movie');
        this.$bili_tv.classList.add('bili-tv');
        this.$bili_cinephile.classList.add('bili-cinephile');
        this.$bili_documentary.classList.add('bili-documentary');
        this.$timeline_bangumi.classList.add('timeline-bangumi');
        this.$timeline_guochuang.classList.add('timeline-guochuang');

        new VideoInfo();

        locs(4694, 34).then(d => {
            // 主推荐滚动图
            const chief = d[4694];
            if (chief && chief.length) {
                this.$carousel_box.href = https(AV.fromStr(chief[0].url));
                this.$carousel_box.title = chief[0].name;
                const $carousel: string[] = [];
                const $trig: string[] = [];
                const id = crypto.randomUUID();
                chief.forEach((d, i) => {
                    if (!d.ad_cb && !d.null_frame) {
                        $carousel.push(`<img loading="lazy" title="${d.name}" data-i="${i}" data-href="${d.url}" src="${d.pic}@.webp"${$carousel.length ? '' : ' class="show"'}>`);
                        $trig.push(`<input value="${i}" name=${id} type="radio"${$trig.length ? '' : ' checked'}>`);
                    }
                })
                this.$carousel_box.innerHTML = AV.fromStr(https($carousel.join('')));
                this.$trig.innerHTML = $trig.join('');
            }
            const popularize = d[34];
            if (popularize && popularize.length) {
                this.$popularize.lastElementChild!.innerHTML = https(AV.fromStr(popularize.map(d => (d.ad_cb || d.null_frame) ? '' : `<a target="_blank" href="${d.url}"><img loading="lazy" src="${d.pic}@.webp"><p class="t">${d.name}</p>${d.archive ? `<div class="mask"></div><div class="duration">${Format.fmSeconds(d.archive.duration)}</div><div class="wl" title="稍后再看" data-aid="${d.archive.aid}"></div>` : ''}</a>`).join('')));
            }
        });

        this.rcmd();
        getList().then(({ recommend_room_list, online_total, ranking_list }) => {
            this.$bili_live_l.firstElementChild!.insertAdjacentHTML('beforeend', `<p class="online">当前共有<span>${online_total}</span>个在线直播</p>`);
            this.$bili_live_l.lastElementChild!.innerHTML = https(recommend_room_list.map(d => `<a target="_blank" href="//live.bilibili.com/${d.roomid}"><img loading="lazy" src="${d.cover}@.webp"><p class="t">${d.title}</p><p class="num">${d.area_v2_parent_name}·${d.area_v2_name}</p><div class="mask"></div><div class="duration">${d.uname}</div><div class="online">${Format.carry(d.online)}</div></a>`).join(''));
            ranking_list && (this.$bili_live_r_box.innerHTML = AV.fromStr(https(ranking_list.map((d, i) => `<div class="r-item"><div class="number"><span>${i + 1}</span></div><a href="//live.bilibili.com/${d.uid}" target="_blank" class="preview"><img loading="lazy" alt="" src="${d.face}@.webp"></a><a href="//live.bilibili.com/${d.uid}" target="_blank" class="u-name" data-online="${Format.carry(d.online)}">${d.uname}</a><span class="u-title">${d.title}</span></div>`).join(''))))
        })

        this.$carousel_box.addEventListener('pointerenter', this.carouselPointerEnter);
        this.$carousel_box.addEventListener('pointerleave', this.carouselPointerLeave);
        this.addEventListener('click', e => {
            const { target } = e;
            if (target instanceof HTMLDivElement && target.classList.contains('wl')) {
                // 处理稍后再看
                const d = target.classList.toggle('wld');
                target.title = d ? '移除' : '稍后再看';
                const { aid } = target.dataset;
                const csrf = cookie.get('bili_jct');
                if (aid && csrf) {
                    if (d) {
                        add(csrf, aid).catch(() => {
                            target.classList.remove('wld');
                            target.title = '稍后再看';
                        })
                    } else {
                        del(csrf, aid).catch(() => {
                            target.classList.add('wld');
                            target.title = '移除';
                        })
                    }
                } else {
                    target.classList.remove('wld');
                    target.title = '稍后再看';
                }
                e.stopPropagation();
                e.preventDefault();
            }
        });
        this.$trig.addEventListener('change', () => {
            const d = new FormData(this.$trig);
            const i = [...d.values()][0];
            const next = this.$carousel_box.querySelector(`[data-i="${i}"]`);
            if (next instanceof HTMLElement) {
                this.$carousel_box.querySelector(".show")?.classList.remove('show');
                next.classList.add('show');
                this.$carousel_box.href = next.dataset.href!;
                this.$carousel_box.title = next.title;
            }
        });
        this.$recommend_flesh.addEventListener('click', () => {
            this.$recommend_flesh.disabled = true;
            this.rcmd().finally(() => {
                this.$recommend_flesh.disabled = false;
            })
        });
        this.$bili_live_l.addEventListener('click', e => {
            const { target } = e;
            if (target instanceof HTMLButtonElement && target.classList.contains('read-push')) {
                target.disabled = true;
                getMoreRecList().then(({ recommend_room_list }) => {
                    this.$bili_live_l.lastElementChild!.innerHTML = https(recommend_room_list.map(d => `<a target="_blank" href="//live.bilibili.com/${d.roomid}"><img loading="lazy" src="${d.cover}@.webp"><p class="t">${d.title}</p><p class="num">${d.area_v2_parent_name}·${d.area_v2_name}</p><div class="mask"></div><div class="duration">${d.uname}</div><div class="online">${Format.carry(d.online)}</div></a>`).join(''));
                }).finally(() => {
                    target.disabled = false;
                });
            }
        });
        this.carouselPointerLeave();
    }

    private carouselPointerLeave = () => {
        this.rollTimer = setInterval(() => {
            const now = this.$carousel_box.querySelector('.show');
            if (now) {
                const next = now.nextSibling || this.$carousel_box.firstElementChild;
                if (next instanceof HTMLElement && next !== now) {
                    next.classList.toggle('show');
                    now.classList.toggle('show');
                    this.$carousel_box.href = next.dataset.href!;
                    this.$carousel_box.title = next.title;
                    const trig = this.$trig.querySelector(`[value="${next.dataset.i}"]`);
                    trig && ((<HTMLInputElement>trig).checked = true);
                }
            }
        }, 5e3);
    }

    private carouselPointerEnter = () => {
        clearInterval(this.rollTimer);
    }

    private rcmd() {
        return rcmd().then(d => {
            // 主推荐视频位
            this.$recommend_module.innerHTML = https(AV.fromStr(d.map(d => `<a target="_blank" href="${d.uri}"><img loading="lazy" src="${d.pic}@.webp"><div class="mask"><p class="title">${d.title}</p><p class="author">up主：${d.owner.name}</p><p class="play">播放：${Format.carry(d.stat.view)}</p></div><div class="wl" title="稍后再看" data-aid="${d.id}"></div></a>`).join('')))
        });
    }
}

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_HOME_STYLE__: string;
}