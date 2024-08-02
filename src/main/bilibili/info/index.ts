import { ROUTER } from "..";
import { pgcAppSeason } from "../../../io/com/bilibili/api/pgc/view/v2/app/season";
import { IEpisode, pgcSection } from "../../../io/com/bilibili/api/pgc/view/web/season/user/section";
import { status } from "../../../io/com/bilibili/api/pgc/view/web/season/user/status";
import { followAdd } from "../../../io/com/bilibili/api/pgc/web/follow/add";
import { followDel } from "../../../io/com/bilibili/api/pgc/web/follow/del";
import { cards, ICardsOut } from "../../../io/com/bilibili/api/x/article/cards";
import { folder } from "../../../io/com/bilibili/api/x/v2/fav/folder";
import { favAdd } from "../../../io/com/bilibili/api/x/v2/fav/video/add";
import { favDel } from "../../../io/com/bilibili/api/x/v2/fav/video/del";
import { favoured } from "../../../io/com/bilibili/api/x/v2/fav/video/favoured";
import { toviewWeb } from "../../../io/com/bilibili/api/x/v2/history/toview/web";
import { favResourceList } from "../../../io/com/bilibili/api/x/v3/fav/resource/list";
import { coins } from "../../../io/com/bilibili/api/x/web-interface/archive/coins";
import { like as hasLike } from "../../../io/com/bilibili/api/x/web-interface/archive/has/like";
import { like } from "../../../io/com/bilibili/api/x/web-interface/archive/like";
import { coinAdd } from "../../../io/com/bilibili/api/x/web-interface/coin/add";
import { coinTodayExp } from "../../../io/com/bilibili/api/x/web-interface/coin/today/exp";
import { detail } from "../../../io/com/bilibili/api/x/web-interface/view/detail";
import svg_coin from "../../../player/assets/svg/coin.svg";
import svg_heart from "../../../player/assets/svg/heart.svg";
import svg_icon_collection from "../../../player/assets/svg/icon-collection.svg";
import svg_icon_danmaku from "../../../player/assets/svg/icon-danmaku.svg";
import svg_icon_paihang from "../../../player/assets/svg/icon-paihang.svg";
import svg_icon_played from "../../../player/assets/svg/icon-played.svg";
import svg_like_number from "../../../player/assets/svg/like-number.svg";
import svg_message from "../../../player/assets/svg/message.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { AV } from "../../../utils/av";
import { cookie } from "../../../utils/cookie";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
import SORT from "./sort.json"

/** 视频信息 */
@customElement('div')
export class Info extends HTMLDivElement {

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

    private $wrap = Element.add('div', { class: 'bili-wrapper' }, this);

    private $video = Element.add('div', { class: 'video-info' }, this.$wrap);

    private $title = Element.add('h1', undefined, this.$video);

    private $tm = Element.add('div', { class: 'tm-info' }, this.$video);

    private $number = Element.add('div', { class: 'number' }, this.$video);

    private $up = Element.add('div', { class: 'up-info' }, this.$wrap);

    private $face = Element.add('a', { class: 'face', target: '_blank' }, this.$up);

    private $info = Element.add('div', { class: 'info' }, this.$up);

    private $upUser = Element.add('div', { class: 'user' }, this.$info);

    private $upSign = Element.add('div', { class: 'sign' }, this.$info);

    private $upNumber = Element.add('div', { class: 'number' }, this.$info);

    private $upBtn = Element.add('button', { class: 'btn' }, this.$info, '+ 关注');

    private $coinId = crypto.randomUUID();

    private $coinPop = Element.add('div', { class: 'coin-popover', popover: 'auto', id: this.$coinId }, undefined, `<div class="coin-title">给UP主投上<span>2</span>枚硬币</div><form class="mc"><label class="mc-box left-con">1硬币<input type="radio" name="${this.$coinId}" value="1"></label><label class="mc-box right-con">2硬币<input type="radio" name="${this.$coinId}" value="2" checked></label></form><div class="coin-bottom"><button class="bi-btn">确定</button><p class="tips">经验值+20（今日0/50）</p></div>`);

    private $favId = crypto.randomUUID();

    private $favPop = Element.add('div', { class: 'fav-popover', popover: 'auto', id: this.$favId }, undefined, `<div class="title">添加到收藏夹</div><div class="content"></div><div class="bottom"><button disabled>确定</button></div>`);

    private $upStaff = Element.add('div', { class: 'up-staff' }, this.$wrap);

    set like(v: boolean) {
        this.$number.querySelector('.like')?.classList.toggle('on', v);
    }

    set coin(v: boolean) {
        this.$number.querySelector('.coin')?.classList.toggle('on', v);
    }

    set fav(v: boolean) {
        this.$number.querySelector('.fav')?.classList.toggle('on', v);
    }

    set heart(v: boolean) {
        this.$number.querySelector('.heart')?.classList.toggle('on', v);
    }

    #mc = 2;

    set $mc(v: number) {
        this.#mc = v;
        this.$coinPop.firstElementChild!.innerHTML = `给UP主投上<span>${v}</span>枚硬币`;
        this.$coinPop.lastElementChild!.lastElementChild!.innerHTML = `经验值+${v}0（今日${this.#exp}/50）`;
    }

    #exp = 0;

    set $exp(v: number) {
        this.#exp = v;
        this.$coinPop.lastElementChild!.lastElementChild!.innerHTML = `经验值+${this.#mc}0（今日${v}/50）`;
    }

    #aid = 0;

    #cid = 0;

    #ssid = 0;

    #epid = 0;

    #fid_add = new Set<number>();

    #fid_del = new Set<number>();

    constructor() {
        super();
        this.insertAdjacentHTML('beforeend', `<style>${__BILI_INFO_STYLE__}</style>`);

        this.$number.addEventListener('click', e => {
            const { target } = e;
            const csrf = cookie.get('bili_jct');
            if (csrf) {
                if (target instanceof HTMLButtonElement) {
                    if (target.classList.contains('like')) {
                        this.#aid && like(csrf, this.#aid, target.classList.contains('on') ? 2 : 1).then(({ code }) => {
                            code === 0 && target.classList.toggle('on');
                        });
                    } else if (target.classList.contains('heart')) {
                        const { ssid } = target.dataset;
                        if (ssid) {
                            (target.classList.contains('on') ? followDel(csrf, ssid) : followAdd(csrf, ssid)).then(() => {
                                target.classList.toggle('on');
                            });
                        }
                    }
                }
            }
        });
        this.$coinPop.children[1].addEventListener('change', () => {
            const d = new FormData(<HTMLFormElement>this.$coinPop.children[1]);
            this.$mc = +[...d.values()][0];
        });
        this.$coinPop.addEventListener('toggle', e => {
            if (this.$coinPop.matches(":popover-open")) {
                const coin = this.$number.querySelector<HTMLElement>('.coin.on');
                if (coin) {
                    this.$coinPop.hidePopover();
                } else {
                    coinTodayExp().then(d => { this.$exp = d });
                }
            }
        });
        this.$coinPop.lastElementChild!.firstElementChild!.addEventListener('click', () => {
            const coin = this.$number.querySelector<HTMLElement>('.coin');
            const csrf = cookie.get('bili_jct');
            if (csrf && coin && !coin.classList.contains('on')) {
                this.#aid && coinAdd(csrf, this.#aid, <1>this.#mc).then(({ code }) => {
                    code === 0 && coin.classList.toggle('on');
                }).finally(() => {
                    this.$coinPop.hidePopover();
                });
            }
        });
        this.$favPop.addEventListener('toggle', () => {
            if (this.$favPop.matches(":popover-open")) {
                folder(this.#aid).then(d => {
                    d.sort((a, b) => b.favoured - a.favoured);
                    this.#fid_add.clear();
                    this.#fid_add.clear();
                    const fid_def: number[] = [];
                    const node = this.$favPop.children[1];
                    node.innerHTML = d.map(d => {
                        d.favoured && fid_def.push(d.fid);
                        return `<label data-fid="${d.fid}" data-cur="${d.cur_count}" data-max="${d.max_count}"><input type="checkbox"${d.favoured ? ' checked' : ''}>${d.name}${d.state === 3 ? '<i>[私密]</i>' : ''}</label>`;
                    }).join('');
                    node.replaceChildren(...d.map(d => {
                        const label = Element.add('label', { 'data-cur': d.cur_count, 'data-max': d.max_count }, undefined, `<input type="checkbox"${d.favoured ? ' checked' : ''}>${d.name}${d.state === 3 ? '<i>[私密]</i>' : ''}`);
                        label.addEventListener('change', () => {
                            if ((<HTMLInputElement>label.firstElementChild).checked) {
                                fid_def.includes(d.fid) || this.#fid_add.add(d.fid);
                                this.#fid_del.delete(d.fid);
                            } else {
                                fid_def.includes(d.fid) && this.#fid_del.add(d.fid);
                                this.#fid_add.delete(d.fid);
                            }

                            (<HTMLButtonElement>this.$favPop.lastElementChild!.firstElementChild).disabled = !(this.#fid_add.size || this.#fid_del.size)
                        });
                        return label;
                    }));
                });
            }
        });

        this.$favPop.lastElementChild!.firstElementChild!.addEventListener('click', () => {
            const csrf = cookie.get('bili_jct');
            if (csrf && this.#aid) {
                const arr: Promise<number>[] = []
                this.#fid_add.size && arr.push(favAdd(csrf, this.#aid, ...this.#fid_add));
                this.#fid_del.size && arr.push(favDel(csrf, this.#aid, ...this.#fid_del));
                arr.length && Promise.allSettled(arr).finally(() => {
                    this.$favPop.hidePopover();
                    setTimeout(() => {
                        favoured(this.#aid).then(({ favoured }) => { this.fav = Boolean(favoured) });
                    }, 1e3);
                })
            }
        });
    }

    async navigate(router: ROUTER, url: URL | Location) {
        this.#aid = 0;
        this.#cid = 0;
        this.#ssid = 0;
        this.#epid = 0;
        url instanceof Location && (url = new URL(url.href));
        switch (router) {
            case ROUTER.AV: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[2]): {
                        this.#aid = +path[2].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[2]): {
                        this.#aid = +AV.fromBV(path[2]);
                        break;
                    }
                }
                if (this.#aid) {
                    Promise.allSettled([cards({ av: this.#aid }), detail(this.#aid)])
                        .then(([cards, detail]) => {
                            const d = cards.status === "fulfilled" && cards.value;
                            const de = detail.status === "fulfilled" && detail.value;
                            if (d) {
                                const card = d[`av${this.#aid}`];
                                if (de && de.View) {
                                    this.avDetail(de);
                                } else {
                                    this.avCards(card);
                                }
                            }
                        });
                } else {
                    console.error('解析av号出错~');
                }
                break;
            }
            case ROUTER.BANGUMI: {
                const path = url.pathname.split('/');
                switch (true) {
                    case /^ss\d+$/i.test(path[3]): {
                        this.#ssid = +path[3].slice(2);
                        break;
                    }
                    case /^ep\d+$/i.test(path[3]): {
                        this.#epid = +path[3].slice(2);
                        break;
                    }
                }
                if (this.#ssid || this.#epid) {
                    pgcAppSeason(this.#ssid ? { season_id: this.#ssid } : { ep_id: this.#epid })
                        .then(async season => {
                            this.#ssid || (this.#ssid = season.season_id);
                            season.modules.forEach(d => {
                                switch (d.style) {
                                    case "positive":
                                    case "section": {
                                        this.#epid || (this.#epid = d.data.episodes[0]?.ep_id);
                                        if (this.#epid) {
                                            const ep = d.data.episodes.find(d => d.ep_id === this.#epid);
                                            if (ep) {
                                                this.#cid = ep.cid;
                                                this.bangumi(season, ep);
                                            }
                                        }
                                        break;
                                    }
                                }
                            });
                            if (!this.#cid && this.#ssid) {
                                const d = await pgcSection(this.#ssid);
                                const eps = d.main_section.episodes.concat(...d.section.map(d => d.episodes));
                                const ep = this.#epid ? eps.find(d => d.id === this.#epid) : eps[0];
                                if (ep) {
                                    this.bangumi(season, ep);
                                }
                            }
                        });
                } else {
                    console.error('解析Bangumi出错~');
                }
                break;
            }
            case ROUTER.TOVIEW: {
                const path = url.hash.split('/');
                switch (true) {
                    case /^av\d+$/i.test(path[1]): {
                        this.#aid = +path[1].slice(2);
                        break;
                    }
                    case /^bv1[a-z0-9]{9}$/i.test(path[1]): {
                        this.#aid = +AV.fromBV(path[1]);
                        break;
                    }
                }
                toviewWeb().then(toview => {
                    this.#aid || (toview.length && (this.#aid = toview[0].aid));
                    if (this.#aid) {
                        Promise.allSettled([cards({ av: this.#aid }), detail(this.#aid)])
                            .then(([cards, detail]) => {
                                const d = cards.status === "fulfilled" && cards.value;
                                const de = detail.status === "fulfilled" && detail.value;
                                if (d) {
                                    const card = d[`av${this.#aid}`];
                                    if (de && de.View) {
                                        this.avDetail(de);
                                    } else {
                                        this.avCards(card);
                                    }
                                }
                            });
                    } else {
                        console.error('解析稍后再看出错~');
                    }
                })
                break;
            }
            case ROUTER.MEDIALIST: {
                const path = url.pathname.split('/');
                const ml = +path[2].slice(2);
                if (ml) {
                    favResourceList(ml).then(({ medias }) => {
                        this.#aid = Number(url.searchParams.get('aid')) || medias[0].id;
                        if (this.#aid) {
                            Promise.allSettled([cards({ av: this.#aid }), detail(this.#aid)])
                                .then(([cards, detail]) => {
                                    const d = cards.status === "fulfilled" && cards.value;
                                    const de = detail.status === "fulfilled" && detail.value;
                                    if (d) {
                                        const card = d[`av${this.#aid}`];
                                        if (de && de.View) {
                                            this.avDetail(de);
                                        } else {
                                            this.avCards(card);
                                        }
                                    }
                                });
                        } else {
                            console.error('解析播放列表出错~');
                        }
                    })
                } else {
                    console.error('解析播放列表出错~');
                }
            }
        }
    }

    private avCards(card: ICardsOut) {
        this.identify();
        this.#aid = card.aid;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: document.title = this.$title.textContent = this.$title.title = card.title,
            artist: card.owner.name,
            album: card.tname,
            artwork: [
                {
                    src: https(card.pic, true)
                }
            ]
        });
        const tinfo: any = SORT[card.tid];
        this.$tm.innerHTML = `<span>
    <a href="/">主页</a>${tinfo ? tinfo[2] ? ` > <a href="${(<any>SORT)[tinfo[2]][1]}">${(<any>SORT)[tinfo[2]][0]}</a> > <a href="${tinfo[1]}">${tinfo[0]}</a>` : ` > <a href="${tinfo[1]}">${tinfo[0]}</a>` : ''}
</span>
<time>${Format.eTime(card.pubdate)}</time>
<a>稿件投诉</a>`;
        this.$number.innerHTML = `<span title="播放数${card.stat.view}">${svg_icon_played}${Format.carry(card.stat.view)}</span>
<span title="弹幕数${card.stat.danmaku}">${svg_icon_danmaku}${Format.carry(card.stat.danmaku)}</span>
${card.stat.his_rank ? `<span title="本日日排行数据过期后，再纳入本稿件的历史排行数据进行对比得出">${svg_icon_paihang}最高全站日排行${card.stat.his_rank}名</span>` : ''}
<button class="like" title="点赞人数${card.stat.like}">${svg_like_number}点赞 ${Format.carry(card.stat.like)}</button>
<button class="coin" title="投硬币枚数${card.stat.coin}" popovertarget="${this.$coinId}">${svg_coin}硬币 ${Format.carry(card.stat.coin)}</button>
<button class="fav" title="收藏人数${card.stat.favorite}" popovertarget="${this.$favId}">${svg_icon_collection}收藏 ${Format.carry(card.stat.favorite)}</button>`;
        this.$face.href = `//space.bilibili.com/${card.owner.mid}`;
        this.$face.innerHTML = `<img class="face" loading="lazy" src="${https(card.owner.face)}@.webp">`;
        this.$upUser.innerHTML = `<a target="_blank" class="name" href="//space.bilibili.com/${card.owner.mid}">${card.owner.name}</a>
<a target="_blank" class="message" href="//message.bilibili.com/#whisper/mid${card.owner.mid}">${svg_message}发消息</a>`;
        this.$number.insertAdjacentElement('beforeend', this.$coinPop);
        this.$number.insertAdjacentElement('beforeend', this.$favPop);

        this.updateNumber();
    }

    avDetail(data: Awaited<ReturnType<typeof detail>>) {
        this.avCards(<ICardsOut><unknown>data.View);
        this.$upSign.textContent = data.Card.card.sign;
        this.$upNumber.innerHTML = `<span title="投稿数${data.Card.archive_count}">投稿：${Format.carry(data.Card.archive_count)}</span>
<span title="粉丝数${data.Card.follower}">粉丝：${Format.carry(data.Card.follower)}</span>`;
        data.Card.following && (this.$upBtn.textContent = '已关注');
        data.Card.card.pendant.image && (this.$face.insertAdjacentHTML('beforeend', `<img class="pendant" loading="lazy" src="${https(data.Card.card.pendant.image)}@.webp">`));
        data.Card.card.official_verify.desc && (this.$face.insertAdjacentHTML('beforeend', `<i title="${data.Card.card.official_verify.type === 1 ? '企业/团体认证' : '个人认证'}" class="auth ${data.Card.card.official_verify.type === 1 ? 'o-auth' : 'p-auth'}"></i>`));
        data.Card.card.vip.nickname_color && ((<HTMLAnchorElement>this.$upUser.firstElementChild!).style.color = data.Card.card.vip.nickname_color);
        data.View.staff && (this.$upStaff.innerHTML = https(data.View.staff.map(d => `<a target="_blank" href="//space.bilibili.com/${d.mid}"${d.vip.nickname_color ? ` style="color: ${d.vip.nickname_color};"` : ''} data-title="${d.title}"><img loading="lazy" src="${d.face}@.webp">${d.name}</a>`).join('')));
    }

    private async bangumi(data: Awaited<ReturnType<typeof pgcAppSeason>>, ep: IEpisode) {
        this.identify();
        this.#aid = ep.aid;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: document.title = this.$title.textContent = this.$title.title = `${data.title}：${/^\d+$/.test(ep.title) ? `第${ep.title}话` : ep.title} ${ep.long_title}`,
            artist: data.actor.info,
            album: data.title,
            artwork: [
                {
                    src: https(ep.cover, true)
                }
            ]
        });
        this.$tm.innerHTML = `<span>
    <a target="_blank" href="//www.bilibili.com/anime/">番剧</a>
    ${data.areas.length ? `<span>${data.areas.map(d => d.name).join(',')}</span>` : ''}
    <span>${data.new_ep.desc}</span>
    <a target="_blank" href="//www.bilibili.com/video/av${ep.aid}">AV${ep.aid}</a>
</span>`;
        this.$number.innerHTML = `<span title="播放数${data.stat.views}">${svg_icon_played}${Format.carry(data.stat.views)}</span>
<span title="弹幕数${data.stat.danmakus}">${svg_icon_danmaku}${Format.carry(data.stat.danmakus)}</span>
<button class="like" title="点赞人数${data.stat.likes}">${svg_like_number}点赞 ${Format.carry(data.stat.likes)}</button>
<button class="coin" title="投硬币枚数${data.stat.coins}" popovertarget="${this.$coinId}">${svg_coin}硬币 ${Format.carry(data.stat.coins)}</button>
<button class="heart" title="追番人数${data.stat.favorites}" data-ssid="${data.season_id}">${svg_heart}${data.stat.followers}</button>`;
        this.$number.insertAdjacentElement('beforeend', this.$coinPop);

        this.updateNumber(data.season_id);
    }

    private updateNumber(ssid?: number) {
        hasLike(this.#aid).then(d => { this.like = Boolean(d) });
        coins(this.#aid).then(({ multiply }) => { this.coin = Boolean(multiply) });
        if (ssid) {
            status(ssid).then(({ follow }) => { this.heart = Boolean(follow) });
        } else {
            favoured(this.#aid).then(({ favoured }) => { this.fav = Boolean(favoured) });
        }
    }

    private identify = () => {
        this.$upStaff.replaceChildren();
    }
}

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_INFO_STYLE__: string;
}