import { Html } from "..";
import { add } from "../../../io/com/bilibili/api/x/v2/history/toview/add";
import { del } from "../../../io/com/bilibili/api/x/v2/history/toview/del";
import { toastr } from "../../../toastr";
import { cookie } from "../../../utils/cookie";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import { mainEv, MAIN_EVENT } from "../../event";
import { Gotop } from "../../gotop";
import { ROUTER } from "../../router";
import { Footer } from "../footer";
import { Header } from "../header";
import { Chief } from "./chief";
import { Rank } from "./rank";
import stylesheet from "./index.css" with {type: 'css'};
import { Live } from "./live";
import { Popularize } from "./popularize";
import { REGION } from "../../../io/com/bilibili/api/x/web-interface/dynamic/region";
import { Timeline } from "./timeline";
import { TYPE } from "../../../io/com/bilibili/api/pgc/web/timeline";
import { Region } from "./region";
import { Format } from "../../../utils/fomat";
import { rankRegion } from "../../../io/com/bilibili/api/x/web-interface/ranking/region";
import { list } from "../../../io/com/bilibili/api/pgc/web/rank/list";

/** 主页组件 */
@customElement(undefined, `home-${Date.now()}`)
export class Home extends HTMLElement {

    static avs: Awaited<ReturnType<typeof rankRegion>>['data'] = [];

    static sss: Awaited<ReturnType<typeof list>>['result']['list'] = [];

    #header = new Header();

    #footer = new Footer();

    #host = this.attachShadow({ mode: 'closed' });

    #container = Element.add('div', { appendTo: this.#host, class: 'container' });

    #chief = this.#container.appendChild(new Chief());

    #popularize = this.#container.appendChild(new Popularize());

    #live = this.#container.appendChild(new Live());

    #douga = this.#container.appendChild(new Rank(undefined, undefined, undefined, '-141px -908px'));

    #timeline_bangumi = this.#container.appendChild(new Timeline(TYPE.BANGUMI, '/anime', '番剧', '/anime/timeline', '-141px -140px'));

    #bangumi = this.#container.appendChild(new Rank(REGION.BANGUMI, '/anime', '番剧动态'));

    #timeline_guochuang = this.#container.appendChild(new Timeline(TYPE.GUOCHUANG, '/guochuang', '国创', 'guochuang/timeline', '-140px -1611px'));

    #guochuang = this.#container.appendChild(new Rank(REGION.GUOCHUANG, '/guochuang', '国产原创相关'));

    #music = this.#container.appendChild(new Rank(REGION.MUSCI, '/v/music', '音乐', '-140px -266px'));

    #dance = this.#container.appendChild(new Rank(REGION.DANCE, '/v/dance', '舞蹈', '-141px -461px'));

    #game = this.#container.appendChild(new Rank(REGION.GAME, '/v/game', '游戏', '-141px -203px'));

    #knowledge = this.#container.appendChild(new Rank(REGION.KNOWLEDGE, '/v/knowledge', '知识', '-141px -525px'));

    #tech = this.#container.appendChild(new Rank(REGION.TECHNOLOGY, '/v/tech/', '科技', '-140px -1741px'));

    #life = this.#container.appendChild(new Rank(REGION.LIFE, '/v/life', '生活', '-137px -970px'));

    #kichiku = this.#container.appendChild(new Rank(REGION.KICHIKU, '/v/kichiku', '鬼畜', '-141px -332px'));

    #fashion = this.#container.appendChild(new Rank(REGION.FASHION, '/v/fashion', '时尚', '-141px -718px'));

    #ent = this.#container.appendChild(new Rank(REGION.ENT, '/v/ent', '娱乐', '-141px -1032px'));

    #timeline_movie = this.#container.appendChild(new Region(REGION.MOVIE, TYPE.MOVIE, '/movie', '电影', '-141px -396px'));

    #timeline_tv = this.#container.appendChild(new Region(REGION.TV, TYPE.TV, '/tv', '电视剧', '-141px -845px'));

    #cinephile = this.#container.appendChild(new Rank(REGION.CINEPHILE, '/v/cinephile', '影视', '-140px -1356px'));

    #timeline_jl = this.#container.appendChild(new Region(REGION.DOCUMENTARY, TYPE.DOCUMENTARY, '/documentary', '纪录片', '-140px -1292px'));

    #videoInfo = Element.add('div', { class: 'video-info' });

    #nav = Element.add('form', {
        appendTo: this.#container, innerHTML: `<label><input type="radio" name="tab" value="0">直播</label>
<label><input type="radio" name="tab" value="1">动画</label>
<label><input type="radio" name="tab" value="2">番剧</label>
<label><input type="radio" name="tab" value="3">国创</label>
<label><input type="radio" name="tab" value="4">音乐</label>
<label><input type="radio" name="tab" value="5">舞蹈</label>
<label><input type="radio" name="tab" value="6">游戏</label>
<label><input type="radio" name="tab" value="7">知识</label>
<label><input type="radio" name="tab" value="8">科技</label>
<label><input type="radio" name="tab" value="9">生活</label>
<label><input type="radio" name="tab" value="10">鬼畜</label>
<label><input type="radio" name="tab" value="11">时尚</label>
<label><input type="radio" name="tab" value="12">娱乐</label>
<label><input type="radio" name="tab" value="13">电影</label>
<label><input type="radio" name="tab" value="14">电视剧</label>
<label><input type="radio" name="tab" value="15">影视</label>
<label><input type="radio" name="tab" value="16">纪录片</label>`}
    );

    constructor() {
        super();

        document.documentElement.replaceWith(new Html());

        this.#host.adoptedStyleSheets = [stylesheet];

        this.#live.classList.add('t0');
        this.#douga.classList.add('t1');
        this.#timeline_bangumi.classList.add('t2');
        this.#timeline_guochuang.classList.add('t3');
        this.#music.classList.add('t4');
        this.#dance.classList.add('t5');
        this.#game.classList.add('t6');
        this.#knowledge.classList.add('t7');
        this.#tech.classList.add('t8');
        this.#life.classList.add('t9');
        this.#kichiku.classList.add('t10');
        this.#fashion.classList.add('t11');
        this.#ent.classList.add('t12');
        this.#timeline_movie.classList.add('t13');
        this.#timeline_tv.classList.add('t14');
        this.#cinephile.classList.add('t15');
        this.#timeline_jl.classList.add('t16');

        document.body.append(this.#header, this, this.#footer, new Gotop());

        mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.HOME, new URL(location.href)]);

        this.#container.addEventListener('click', e => {
            const { target } = e;
            if (target instanceof HTMLElement && target.classList.contains('wl')) {
                e.preventDefault();
                const d = target.classList.toggle('d');
                target.title = d ? '移除' : '稍后再看';
                const { aid } = target.dataset;
                const csrf = cookie.get('bili_jct');
                if (aid && csrf) {
                    if (d) {
                        add(csrf, aid)
                            .then(({ code, message }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                                toastr.success(`已添加稍后再看：av${aid}`);
                            })
                            .catch(e => {
                                target.classList.remove('d');
                                target.title = '稍后再看';
                                toastr.error('添加稍后再看出错', e)
                            })
                    } else {
                        del(csrf, aid)
                            .then(({ code, message }) => {
                                if (code !== 0) throw new ReferenceError(message, { cause: { code, message } });
                                toastr.success(`已移除稍后再看：av${aid}`);
                            })
                            .catch(e => {
                                target.classList.add('d');
                                target.title = '移除';
                                toastr.error('移除稍后再看出错', e);
                            })
                    }
                } else {
                    target.classList.remove('d');
                    target.title = '稍后再看';
                }
            }
        });

        this.#container.addEventListener('pointerover', ({ target }) => {
            if (target instanceof HTMLElement) {
                const p = target.closest<HTMLElement>('.vt');
                if (p) {
                    const { aid, ssid } = p.dataset;
                    if (ssid) {
                        const d = Home.sss[<any>ssid];
                        this.#videoInfo.innerHTML = `<div class="v-season">
	<div class="lazy-img" style="background-image: url(${d.cover}@.webp)"></div>
    <div>
        <span>${d.title}</span>
        <span>${d.new_ep.index_show}</span>
        ${d.rating ? `<span>${d.rating}</span>` : ''}
    </div>
</div>
<div class="v-data">
	<span class="play">${Format.carry(d.stat.view)}</span>
	<span class="danmu">${Format.carry(d.stat.danmaku)}</span>
	<span class="star">${Format.carry(d.stat.follow)}</span>
</div>`;
                        const id = crypto.randomUUID();
                        p.style.setProperty('anchor-name', `--${id}`);
                        this.#videoInfo.style.setProperty('position-anchor', `--${id}`);
                        this.#container.appendChild(this.#videoInfo);
                        p.addEventListener('pointerleave', () => {
                            this.#videoInfo.remove();
                        }, { once: true });

                    } else if (aid) {
                        const d = Home.avs[<any>aid];
                        this.#videoInfo.innerHTML = `<div class="v-title">${d.title}</div>
<div class="v-info">
	<span>${d.author}</span>
	<span class="line"></span>
	<span>${d.create}</span>
</div>
<div class="v-preview">
	<div class="lazy-img" style="background-image: url(${d.pic}@.webp)"></div>
	<div class="txt">${d.description}</div>
</div>
<div class="v-data">
	<span class="play">${Format.carry(d.play)}</span>
	<span class="danmu">${Format.carry(d.review)}</span>
	<span class="star">${Format.carry(d.favorites)}</span>
	<span class="coin">${Format.carry(d.coins)}</span>
</div>`;
                        const id = crypto.randomUUID();
                        p.style.setProperty('anchor-name', `--${id}`);
                        this.#videoInfo.style.setProperty('position-anchor', `--${id}`);
                        this.#container.appendChild(this.#videoInfo);
                        p.addEventListener('pointerleave', () => {
                            this.#videoInfo.remove();
                        }, { once: true });
                    }
                }
            }
        });

        this.#nav.addEventListener('change', () => {
            const d = new FormData(this.#nav);
            const i = Number(d.get('tab'));
            if (!Number.isNaN(i)) {
                this.#container.querySelector(`.t${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}