import { header, ISplitLayer } from "../../../io/com/bilibili/api/x/web-show/page/header";
import svg_mobile from "../../../player/assets/svg/mobile.svg";
import svg_tv from "../../../player/assets/svg/tv.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
import navGif from '../assets/nav-gift.json';
import channelList from '../assets/channel-list.json';
import { online } from "../../../io/com/bilibili/api/x/web-interface/online";
import svg_icon_paihang from "../../../player/assets/svg/icon-paihang.svg";
import svg_search from "../../../player/assets/svg/search.svg";
import { searchDefault } from "../../../io/com/bilibili/api/x/web-interface/search/default";
import { searchSuggest } from "../../../io/com/bilibili/search/s/main/suggest";
import { cookie } from "../../../utils/cookie";
import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import svg_account from "../../../player/assets/svg/account.svg";
import svg_member from "../../../player/assets/svg/member.svg";
import svg_wallet from "../../../player/assets/svg/wallet.svg";
import svg_live_center from "../../../player/assets/svg/live-center.svg";
import svg_bml from "../../../player/assets/svg/bml.svg";
import svg_cheese from "../../../player/assets/svg/cheese.svg";
import { exit } from "../../../io/com/bilibili/passport/login/exit/v2";
import { unread } from "../../../io/com/bilibili/api/x/msgfeed/unread";
import { dynamic_new, IDynamicNewCard, IDynamicNewCards, IDynamicArticle } from "../../../io/com/bilibili/vc/api/dynamic_svr/v1/dynamic_svr/dynamic_new";
import { dynamic_num } from "../../../io/com/bilibili/vc/api/dynamic_svr/v1/dynamic_svr/dynamic_num";
import { AV } from "../../../utils/av";
import { toviewWeb } from "../../../io/com/bilibili/api/x/v2/history/toview/web";
import { medialistRecent } from "../../../io/com/bilibili/api/medialist/gateway/coll/resource/recent";
import { history } from "../../../io/com/bilibili/api/x/v2/history";

/** 顶栏 */
@customElement('div')
export class Header extends HTMLDivElement {

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

    private $banner = Element.add('div', { class: 'head-banner' }, this);

    private $nav = Element.add('div', { class: 'nav-menu' }, this);

    private $wrapper = Element.add('div', { class: 'bili-wrapper nav-wrapper' }, this.$nav);

    private $left = Element.add('div', { class: 'nav-side' }, this.$wrapper, `<a href="//www.bilibili.com" class="nav-item home">${svg_tv}主站</a>
<a href="//www.bilibili.com/audio/home/" class="nav-item">音频</a>
<a href="//game.bilibili.com" class="nav-item">游戏中心</a>
<a href="//live.bilibili.com" class="nav-item">直播</a>
<a href="//show.bilibili.com/platform/home.html" class="nav-item">会员购</a>
<a href="//manga.bilibili.com" class="nav-item">漫画</a>
<a href="//app.bilibili.com" class="nav-item mobile">${svg_mobile}下载APP</a>`);

    private $right = Element.add('div', { class: 'nav-side' }, this.$wrapper, `<a target="_blank" href="//space.bilibili.com" class="nav-item profile-info"><img class="face" loading="lazy" src="//static.hdslb.com/images/akari.jpg"></a>
<a target="_blank" href="//account.bilibili.com/account/big" class="nav-item">大会员</a>
<a target="_blank" href="//message.bilibili.com" class="nav-item message">消息</a>
<a target="_blank" href="//t.bilibili.com" class="nav-item dynamic">动态</a>
<a target="_blank" href="//www.bilibili.com/watchlater/#/list" class="nav-item watchlater">稍后再看</a>
<a target="_blank" href="//space.bilibili.com" class="nav-item fav">收藏</a>
<a target="_blank" href="//www.bilibili.com/account/history" class="nav-item history">历史</a>
<a target="_blank" href="//member.bilibili.com/v2#/upload/video/frame" class="nav-item up-load">投稿</a>`);

    private $primary = Element.add('div', { class: 'bili-wrapper primary-wrapper' }, this);

    private $menu = Element.add('a', { class: 'nav-primary' }, this.$primary);

    private $gift = Element.add('a', { class: 'nav-gif' }, this.$primary);

    private $content = Element.add('div', { class: 'search' }, this, `<a href="//www.bilibili.com/ranking" target="_blank" class="link-ranking">${svg_icon_paihang}排行榜</a>`);

    private $form = Element.add('form', { class: 'searchform' }, this.$content);

    private $search = Element.add('input', { class: 'search-keyword', type: 'search' }, this.$form);

    private $submit = Element.add('button', { class: 'search-submit', type: 'submit' }, this.$form, svg_search);

    private $datalist = Element.add('ul', { class: 'search-datalist' }, this.$content);

    private $profileWrap = Element.add('div', { class: 'profile-wrap' }, this.$right);

    private $messageWrap = Element.add('div', { class: 'message-wrap' }, this.$right, `<a href="//message.bilibili.com/#/reply" target="_blank">回复我的</a>
<a href="//message.bilibili.com/#/at" target="_blank">@我的</a>
<a href="//message.bilibili.com/#/love" target="_blank">收到的赞</a>
<a href="//message.bilibili.com/#/system" target="_blank">系统通知</a>
<a href="//message.bilibili.com/#/whisper" target="_blank">我的消息</a>`);

    private $dynamicWrap = Element.add('div', { class: 'dynamic-wrap' }, this.$right, `<a target="_blank" href="//t.bilibili.com" class="read-more">查看全部</a>`);

    private $dynamicList = Element.add('ul', { class: 'dyn_list' }, this.$dynamicWrap, undefined, true);

    private $dynamicForm = Element.add('form', { class: 'dyn_menu' }, this.$dynamicWrap, undefined, true);

    private $watchlaterWrap = Element.add('div', { class: 'watchlater-wrap' }, this.$right, `<div class="btn"><a target="_blank" href="//www.bilibili.com/watchlater/#/">播放全部</a><a target="_blank" href="//www.bilibili.com/watchlater/#/list">查看全部</a></div>`);

    private $watchlaterList = Element.add('div', { class: 'watchlater-list' }, this.$watchlaterWrap, undefined, true);

    private $favWrap = Element.add('div', { class: 'fav-wrap' }, this.$right, `<a target="_blank" href="//space.bilibili.com/favlist" class="read-more">查看更多</a>`);

    private $favList = Element.add('div', { class: 'fav-list' }, this.$favWrap, undefined, true);

    private $historyWrap = Element.add('div', { class: 'history-wrap' }, this.$right, `<a target="_blank" href="//www.bilibili.com/account/history" class="read-more">查看更多</a>`);

    private $historyList = Element.add('div', { class: 'history-list' }, this.$historyWrap, undefined, true);

    private $upLoadWrap = Element.add('div', { class: 'up-load-wrap' }, this.$right, `<a class="i-art" href="//member.bilibili.com/v2#/upload/text/apply" target="_blank">专栏投稿</a>
<a class="i-ap" href="//member.bilibili.com/v2#/upload/audio/" target="_blank">音频投稿</a>
<a class="i-vp" href="//member.bilibili.com/v2#/upload/video/frame" target="_blank">视频投稿</a>
<a class="i-vm" href="//member.bilibili.com/v2#/upload-manager/article" target="_blank">投稿管理</a>`);

    #defaultSubmit?: string;

    #abortSignal?: AbortController;

    #composition = true;

    #isLogin = false;

    #mid = 0;

    set resource_id(v: number) {
        // 获取banner横幅
        header(v).then(d => {
            this.$banner.style.backgroundImage = `url(${https(d.pic)}@.webp)`;
            try {
                const animatedBannerConfig: ISplitLayer = JSON.parse(d.split_layer);
                for (const { resources, scale, rotate, translate, blur, opacity } of animatedBannerConfig.layers) {
                    const div = Element.add('div', { class: 'layer' }, this.$banner);
                    for (const { id, src } of resources) {
                        const $scale = (scale?.initial || 0) + (scale?.offset || 0);
                        const $rotate = (rotate?.initial || 0) + (rotate?.offset || 0);
                        const $translate = [((translate?.initial?.[0] || 0) + (translate?.offset?.[0] || 0)) * ($scale || 1), (translate?.initial?.[1] || 0) + (translate?.offset?.[1] || 0) * ($scale || 1)];
                        const $blur = blur?.wrap === 'alternate' ? Math.abs((blur.initial || 0) + (blur.offset || 0)) : Math.max(0, (blur?.initial || 0) + (blur?.offset || 0));
                        const x = (opacity?.initial === undefined ? 1 : opacity.initial) + (opacity?.offset || 0);
                        let y = Math.abs(x % 1);
                        if (Math.abs(x % 2) >= 1) {
                            y = 1 - y;
                        }
                        if (/\.(webm|mp4)$/.test(src)) {
                            const video = Element.add('video', { src, id }, div);
                            video.muted = true;
                            video.autoplay = true;
                            video.loop = true;
                            video.playsInline = true;

                            $rotate && (video.style.rotate = $rotate + 'deg');
                            ($translate[0] || $translate[1]) && (video.style.translate = `calc(100cqb / 155 * (${$translate[0]})) calc(100cqb / 155 * (${$translate[1]}))`);
                            ($blur < 1e-4) || (video.style.filter = `blur(${$blur}px)`);
                            video.style.opacity = opacity?.wrap === 'alternate' ? <any>y : <any>Math.max(0, Math.min(1, x));
                        } else {
                            const img = Element.add('img', { src, id }, div);
                            $rotate && (img.style.rotate = $rotate + 'deg');
                            // ($translate[0] || $translate[1]) && (img.style.translate = `calc(100cqb / 155 * (${$translate[0]})) calc(100cqb / 155 * (${$translate[1]}))`);
                            ($blur < 1e-4) || (img.style.filter = `blur(${$blur}px)`);
                            img.style.opacity = opacity?.wrap === 'alternate' ? <any>y : <any>Math.max(0, Math.min(1, x));
                        }
                    }
                }
            } catch {
                console.error('animated_banner_config parse error');
            }
        });
        // 随机推荐动图
        const gif = Format.subArray(navGif);
        this.$gift.href = gif.links[0];
        this.$gift.innerHTML = `<img loading="lazy" src=${gif.icon}>`;
        this.$gift.title = gif.title;
        // 获取各分区在线人数
        online().then(online => {
            Array.from(this.$menu.querySelectorAll('.nav-item')).forEach(d => {
                const tid = (<HTMLElement>d).dataset.tid;
                if (tid && online[<any>tid]) {
                    (<HTMLElement>d).dataset.online = online[<any>tid] > 999 ? '999+' : <any>online[<any>tid];
                }
            })
        })
    }

    constructor() {
        super();
        this.insertAdjacentHTML('beforeend', `<style>${__BILI_HEADER_STYLE__}</style>`);

        const id = crypto.randomUUID();
        this.$search.setAttribute('list', id);
        this.$datalist.id = id;
        this.$dynamicForm.innerHTML = `<label><input type="radio" name=${id} value="0" checked>视频</label><label><input type="radio" name=${id} value="1">直播</label><label><input type="radio" name=${id} value="2">专栏</label>`;

        channelList.forEach(d => {
            const a = Element.add('a', { class: 'nav-item' }, this.$menu);
            a.href = d.url;
            a.text = d.name;
            a.dataset.online = '...';
            if (d.position) {
                a.classList.add('position');
                a.style.setProperty('--background-position', `${d.position[0]}px ${d.position[1]}px`);
            }
            d.tid && (a.dataset.tid = <any>d.tid);
            d.sub && a.insertAdjacentHTML('beforeend', `<div class="sub-item">${d.sub.map(d => `<a href="${d.url}">${d.name}</a>`).join('')}</div>`);
        });
        searchDefault().then(d => {
            this.$search.placeholder = d.show_name || d.name;
            this.#defaultSubmit = d.url;
        });
        nav().then(d => {
            // 请求用户数据
            if (d.isLogin) {
                this.#isLogin = d.isLogin;
                this.#mid = d.mid;

                // 请求新消息信息
                unread().then(({ reply, at, like, sys_msg }) => {
                    const all = reply + at + like + sys_msg;
                    reply && ((<HTMLElement>this.$messageWrap.children[0]).dataset.num = reply > 99 ? '99+' : <any>reply);
                    at && ((<HTMLElement>this.$messageWrap.children[1]).dataset.num = at > 99 ? '99+' : <any>at);
                    like && ((<HTMLElement>this.$messageWrap.children[2]).dataset.num = like > 99 ? '99+' : <any>like);
                    sys_msg && ((<HTMLElement>this.$messageWrap.children[3]).dataset.num = sys_msg > 99 ? '99+' : <any>sys_msg);
                    all && ((<HTMLElement>this.$right.querySelector('.nav-item.message')).dataset.num = all > 99 ? '99+' : <any>all);
                });
                // 请求新动态信息
                const id = localStorage.getItem(`bp_t_offset_${d.mid}`);
                dynamic_num(d.mid, id || '0', 8, 64, 512).then(d => {
                    d && ((<HTMLElement>this.$right.querySelector('.nav-item.dynamic')).dataset.num = d > 99 ? '99+' : <any>d);
                });

                // 绘制用户面板
                (<HTMLImageElement>this.$right.firstElementChild!.firstElementChild).src = `${d.face}@.webp`;
                d.pendant.image && (<HTMLAnchorElement>this.$right.firstElementChild).insertAdjacentHTML('beforeend', `<img class="pendant" loading="lazy" src="${d.pendant.image}@.webp">`);
                d.officialVerify.desc ? (<HTMLAnchorElement>this.$right.firstElementChild).insertAdjacentHTML('beforeend', `<i title="${d.officialVerify.type === 1 ? '企业/团体认证' : '个人认证'}" class="auth ${d.officialVerify.type === 1 ? 'o-auth' : 'p-auth'}"></i>`) : (d.vip.status && (<HTMLAnchorElement>this.$right.firstElementChild).insertAdjacentHTML('beforeend', `<i title="${d.vip.label.text}" class="auth vip"></i>`));
                this.$profileWrap.innerHTML = `<div class="uname">${d.uname}</div>
<div class="vip-type"${d.vip.status ? ` style="color: ${d.vip.label.text_color};background-color: ${d.vip.label.bg_color};"` : ''}>${d.vip.label.text}</div>
<div class="btns-profile">
    <a class="coin" href="//account.bilibili.com/site/coin" target="_blank" title="硬币">${d.money}</a>
    <a class="bcoin" href="//pay.bilibili.com/bb_balance.html" target="_blank" title="B币">${d.wallet.bcoin_balance}</a>
    <a class="email${d.email_verified ? ' verified' : ''}" href="//passport.bilibili.com/account/security#/bindmail" target="_blank"${d.email_verified ? ' title="已绑定"' : ''}></a>
    <a class="phone${d.mobile_verified ? ' verified' : ''}" href="//passport.bilibili.com/account/security#/bindphone" target="_blank"${d.mobile_verified ? ' title="已绑定"' : ''}></a>
</div>
<div class="grade">
	<span>等级</span>
	<a href="//account.bilibili.com/account/record?type=exp" target="_blank">
		<div class="bar">
			<div class="lt">${d.level_info.current_level}${d.is_senior_member ? '+' : ''}</div>
			<div class="rate" style="inline-size: ${Math.floor(d.level_info.current_exp / (+d.level_info.next_exp || d.level_info.current_exp) * 100)}%;"></div>
			<div class="num">
				<div>${d.level_info.current_exp}<span>/${d.level_info.next_exp}</span></div>
			</div>
		</div>
	</a>
</div>
<div class="member-menu">
    <a href="//account.bilibili.com/account/home" target="_blank">${svg_account}个人中心</a>
    <a href="//member.bilibili.com/v2#/upload-manager/article" target="_blank">${svg_member}投稿管理</a>
    <a href="//pay.bilibili.com/" target="_blank">${svg_wallet}B币钱包</a>
    <a href="//link.bilibili.com/p/center/index" target="_blank">${svg_live_center}直播中心</a>
    <a href="//show.bilibili.com/orderlist" target="_blank">${svg_bml}订单中心</a>
    <a href="//www.bilibili.com/v/cheese/mine" target="_blank">${svg_cheese}我的课程</a>
</div>
<div class="member-bottom"><button class="exit">退出</button></div>`;
            }
        })
        this.$form.addEventListener('compositionstart', () => {
            this.#composition = false;
        });
        this.$form.addEventListener('compositionend', () => {
            this.#composition = true;
            this.onInput();
        });
        this.$form.addEventListener('input', this.onInput);
        this.$datalist.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLLIElement) {
                this.$search.value = target.textContent!;
                this.$submit.click();
            }
        });
        this.$form.addEventListener('submit', () => {
            if (this.$search.value) {
                self.open(`//search.bilibili.com/all?keyword=${this.$search.value}`);
            } else if (this.#defaultSubmit) {
                self.open(this.#defaultSubmit);
            } else {
                self.open('//search.bilibili.com');
            }
        });
        this.$profileWrap.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLButtonElement && target.classList.contains('exit')) {
                const bili_jct = cookie.get('bili_jct');
                if (this.#isLogin && bili_jct) {
                    exit(bili_jct).then(d => { location.replace(d) });
                }
            }
        });
        new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    this.dynamic_video();
                    (<HTMLElement>this.$right.querySelector('.nav-item.dynamic')).removeAttribute('data-num');
                    break;
                }
            }
        }).observe(this.$dynamicWrap);
        this.$dynamicForm.addEventListener('change', () => {
            const d = new FormData(this.$dynamicForm);
            const i = +[...d.values()][0];
            switch (i) {
                case 0: {
                    this.dynamic_video();
                    break;
                }
                case 2: {
                    this.dynamic_article();
                    break;
                }
                default: {
                    this.$dynamicList.replaceChildren();
                }
            }
        });
        new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    this.#mid && toviewWeb(6).then(d => {
                        this.$watchlaterList.innerHTML = d.map(d => `<a href="//www.bilibili.com/watchlater/#/av${d.aid}" target="_blank" title="${d.title}">${d.title}</a>`).join('');
                    })
                    break;
                }
            }
        }).observe(this.$watchlaterWrap);
        new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    this.#mid && medialistRecent().then(d => {
                        this.$favList.innerHTML = d.map(d => `<a href="//www.bilibili.com/watchlater/#/av${d.id}" target="_blank" title="${d.title}">${d.title}</a>`).join('');
                    })
                    break;
                }
            }
        }).observe(this.$favWrap);
        new IntersectionObserver((entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    if (this.#mid) {
                        const t = new Date();
                        const now = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
                        const pasts: string[] = [];
                        history().then(d => {
                            this.$historyList.innerHTML = d.map(d => {
                                const past = this.past(now - d.view_at * 1e3);
                                const label = pasts.includes(past);
                                label || pasts.push(past);
                                return `${label ? '' : `<div class="timeline"><span>${past}</span></div>`}<a href="//www.bilibili.com/video/av${d.aid}${d.progress > 0 ? `?t=${d.progress}` : ''}" target="_blank"><div class="title" title="${d.title}">${d.title}</div><div class="state"><span class="progress">${d.progress ? d.progress > 0 ? Math.floor(d.progress / d.duration * 100) : '100' : '1'}%</span><i class="device ${2 === d.device ? "pc" : 1 === d.device || 3 === d.device || 5 === d.device || 7 === d.device ? "phone" : 4 === d.device || 6 === d.device ? "pad" : 33 === d.device ? "tv" : "unknown"}"></i></div></a>`
                            }).join('');
                        })
                    }
                    break;
                }
            }
        }).observe(this.$historyWrap);
    }

    private onInput = () => {
        if (this.#composition) {
            if (this.$search.value) {
                this.#abortSignal?.abort();
                this.#abortSignal = new AbortController();
                searchSuggest(
                    this.$search.value,
                    cookie.get('DedeUserID') || '0',
                    this.#abortSignal.signal,
                ).then(d => {
                    this.$datalist.innerHTML = d.map(d => `<li>${d.term}</li>`).join('');
                })
            } else {
                this.$datalist.replaceChildren();
            }
        }
    }

    private dynamic_video() {
        this.#mid && dynamic_new(this.#mid || 0, 8, 512).then(d => {
            localStorage.setItem(`bp_t_offset_${this.#mid}`, <any>d.max_dynamic_id);
            this.$dynamicList.innerHTML = https(d.cards.map(d => {
                const card: IDynamicNewCard = JSON.parse(d.card);
                return `<li><a href="//www.bilibili.com/video/av${card.aid}" class="cover" target="_blank"><img loading="lazy" src="${card.pic}@.webp"></a><a href="//space.bilibili.com/${card.owner.mid}" class="up" target="_blank" data-action="${d.display.usr_action_txt || '投稿了'}">${card.owner.name}</a><a href="//www.bilibili.com/video/av${card.aid}" class="title" target="_blank" title="${card.title}">${card.title}</a></li>`;
            }).join(''));
        });
    }

    private dynamic_article() {
        this.#mid && dynamic_new(this.#mid || 0, 64).then(d => {
            localStorage.setItem(`bp_t_offset_${this.#mid}`, <any>d.max_dynamic_id);
            this.$dynamicList.innerHTML = https(d.cards.map(d => {
                const card: IDynamicArticle = JSON.parse(d.card);
                return `<li class="article"><a href="//www.bilibili.com/read/cv${card.id}" class="cover" target="_blank"><img loading="lazy" src="${card.image_urls[0]}@.webp"></a><a href="//space.bilibili.com/${card.author.mid}" class="up" target="_blank" data-action="${d.display.usr_action_txt || '投稿了'}">${card.author.name}</a><a href="//www.bilibili.com/read/cv${card.id}" class="title" target="_blank" title="${card.title}">${card.title}</a></li>`;
            }).join(''));
        });
    }

    private past(tsp: number) {
        return tsp <= 0 ? "今日" : tsp > 0 && tsp <= 864e5 ? "昨日" : tsp > 864e5 && tsp <= 6048e5 ? "近1周" : tsp > 6048e5 && tsp <= 2592e6 ? "1周前" : tsp > 2592e6 && tsp <= 7776e6 ? "1个月前" : "last";
    }
}

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_HEADER_STYLE__: string;
}