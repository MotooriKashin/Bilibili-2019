import { relationModify } from "../../../io/com/bilibili/api/x/relation/modify";
import { card } from "../../../io/com/bilibili/api/x/web-interface/card";
import svg_men from "../../../player/assets/svg/men.svg";
import svg_women from "../../../player/assets/svg/women.svg";
import { cookie } from "../../../utils/cookie";
import { customElement } from "../../../utils/Decorator/customElement";
import { Format } from "../../../utils/fomat";
import { https } from "../../../utils/https";
import { LEVEL } from "../comment/icon-level";

/** 评论区 */
@customElement(undefined, `id-card-${crypto.randomUUID()}`)
export class IdCard extends HTMLElement {

    #host = this.attachShadow({ mode: 'closed' });

    private $img = this.#host.appendChild(document.createElement('div'));

    private $info = this.#host.appendChild(document.createElement('div'));

    private $action = this.#host.appendChild(document.createElement('div'));

    private $follow = this.$action.appendChild(document.createElement('button'));

    private $wisp = this.$action.appendChild(document.createElement('button'));

    constructor() {
        super();
        this.$img.insertAdjacentHTML('beforebegin', `<style>${__BILI_ID_CARD_STYLE__}</style>`);
        this.popover = 'auto';
        this.$img.classList.add('idc-theme-img');
        this.$info.classList.add('idc-info');
        this.$action.classList.add('idc-action');
        this.$follow.textContent = '关注';
        this.$wisp.textContent = '发消息';

        document.addEventListener('pointerover', ({ target }) => {
            if (target instanceof HTMLAnchorElement && !this.contains(target) && target.href) {
                const href = new URL(target.href, location.origin);
                if (href.hostname === 'space.bilibili.com') {
                    const path = href.pathname.split('/');
                    if (!path[2] && /^\d+/.test(path[1])) {
                        const id = crypto.randomUUID();
                        target.style.setProperty('anchor-name', `--${id}`);
                        this.style.setProperty('position-anchor', `--${id}`);
                        this.onMouseover(path[1]);
                        target.addEventListener('pointerleave', () => {
                            this.hidePopover();
                        }, { once: true });
                    }
                }
            }
        });
        this.$wisp.addEventListener('click', () => {
            const { mid } = this.$wisp.dataset;
            mid && self.open(`//message.bilibili.com/#/whisper/mid${mid}`);
        });
        this.$follow.addEventListener('click', () => {
            const { mid } = this.$follow.dataset;
            const csrf = cookie.get('bili_jct');
            if (csrf && mid) {
                const act = this.$follow.textContent?.includes('已关注') ? 2 : 1;
                relationModify(csrf, mid, act).then(d => {
                    if (d === 0) {
                        this.$follow.textContent = act === 1 ? '已关注' : '关注';
                        card.noCatch(mid);
                    }
                })
            }
        })
    }

    private onMouseover = (
        mid: string,
    ) => {
        card(mid).then(({ space, card, like_num, following }) => {
            svg_men;
            space.l_img && (this.$img.style.backgroundImage = https(`url(${space.l_img}@.webp)`));
            this.$info.innerHTML = https(`<a href="//space.bilibili.com/${card.mid}" target="_blank" class="up-cover-components">
    <div class="avatar${card.official_verify.type === 0 ? ' personal' : card.official_verify.type === 1 ? ' business' : card.vip.avatar_subscript === 1 ? ' big-vip' : card.vip.avatar_subscript === 2 ? ' small-vip' : ''}">
        <img loading="lazy" src="${card.face}" class="avatar-face">
        ${card.pendant.image ? `<img loading="lazy" src="${card.pendant.image}" class="avatar-pendant">` : ''}
    </div>
</a>
<div class="idc-content">
    <div class="idc-name">
        <a href="//space.bilibili.com/${card.mid}" target="_blank" class="idc-username"${card.vip.nickname_color ? ` style="color: ${card.vip.nickname_color}"` : ''}>${card.name}</a>
        ${card.sex === "男" ? svg_men : card.sex === "女" ? svg_women : ''}
        <img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/commentpc/static/img/ic_user level_${card.is_senior_member ? LEVEL.at(-1) : LEVEL[card.level_info.current_level]}.svg">
        ${card.vip.status && card.vip.label.img_label_uri_hans_static ? `<img loading="lazy" src="${card.vip.label.img_label_uri_hans_static}">` : ''}
    </div>
    <div class="idc-meta"><span title="关注 ${card.friend}">关注 ${Format.carry(card.friend)}</span><span title=">粉丝 ${card.fans}">粉丝 ${Format.carry(card.fans)}</span><span title="获赞 ${like_num}">获赞 ${Format.carry(like_num)}</span></div>
    ${card.official_verify.desc ? `<div class="idc-auth-description">${card.official_verify.desc}</div>` : ''}
    ${card.sign ? `<div>${card.sign}</div>` : ''}
</div>`);
            this.$follow.dataset.mid = mid;
            this.$wisp.dataset.mid = mid;
            this.$follow.textContent = following ? '已关注' : '关注';
            this.showPopover();
        })
    }
}

document.body.appendChild(new IdCard());

//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_ID_CARD_STYLE__: string;
}