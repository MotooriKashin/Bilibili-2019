import { nav } from "../../../io/com/bilibili/api/x/web-interface/nav";
import { exit } from "../../../io/com/bilibili/passport/login/exit/v2";
import { toastr } from "../../../toastr";
import { cookie } from "../../../utils/cookie";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";

/** 头像 */
@customElement('a')
export class Avatar extends HTMLAnchorElement {

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
    connectedCallback() {
        this.insertAdjacentElement('afterend', this.#wrap);
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.#wrap.remove();
    }

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    #wrap = Element.add('div', { class: 'avatar-wrap' });

    constructor() {
        super();

        this.classList.add('avatar');
        this.innerHTML = `<img class="avatar-face" loading="lazy" src="//static.hdslb.com/images/akari.jpg">`;
        this.href = '//space.bilibili.com';
        this.target = '_black';

        this.#wrap.addEventListener('click', ({ target }) => {
            if (target instanceof HTMLButtonElement && target.classList.contains('logout')) {
                const toast = toastr.warn('即将退出登录！');
                toast.$delay = 0;
                const bili_jct = cookie.get('bili_jct');
                if (bili_jct) {
                    exit(bili_jct)
                        .then(({ code, message, data }) => {
                            if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                            toast.$type = 'success';
                            toast.appendText('退出登录成功~', '3 秒后即将刷新页面...');
                            setTimeout(() => {
                                location.replace(data.redirectUrl || location.href);
                            }, 3e3);
                        })
                        .catch(e => {
                            toast.$type = "error";
                            toast.appendText('退出登录失败', e);
                            console.error(e);
                        })
                        .finally(() => {
                            toast.$delay = 4;
                        })
                }
            }
        });

        nav()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                if (data.isLogin) {
                    this.classList.add('d');
                    this.innerHTML = `<img class="avatar-face" loading="lazy" src="${data.face}">${data.pendant.image ? `<img class="avatar-pendant" loading="lazy" src="${data.pendant.image}">` : ''}`;
                    this.#wrap.innerHTML = `<div class="header-uname"${data.vip.nickname_color ? ` style="color: ${data.vip.nickname_color}"` : ''}>${data.uname}</div>
<div class="btns-profile">
	<a class="coin" href="//account.bilibili.com/site/coin" target="_blank" title="硬币">${data.money}</a>
	<a class="b-coin" href="//pay.bilibili.com/bb_balance.html" target="_blank" title="B币">${data.wallet.bcoin_balance}</a>
	<a class="bindphone${data.email_verified ? ' verified' : ''}" href="//passport.bilibili.com/account/security#/bindphone" target="_blank"></a>
	<a class="bindmail${data.mobile_verified ? ' verified' : ''}" href="//passport.bilibili.com/account/security#/bindmail" target="_blank"></a>
</div>
<div class="grade">
	<span>等级</span>
	<progress max="${data.level_info.current_min}" value="${data.level_info.current_exp}" class="lv${data.level_info.current_level || 0}"></progress>
	<label>${data.level_info.current_exp}/${data.level_info.current_min}</label>
</div>
<div class="member-menu">
	<a href="//account.bilibili.com/account/home" target="_blank" class="account">个人中心</a>
	<a href="//member.bilibili.com/v2#/upload-manager/article" target="_blank" class="member">投稿管理</a>
	<a href="//pay.bilibili.com/" target="_blank" class="wallet">B币钱包</a>
	<a href="//link.bilibili.com/p/center/index" target="_blank" class="live">直播中心</a>
	<a href="//show.bilibili.com/orderlist" target="_blank" class="bml">订单中心</a>
	<a href="//www.bilibili.com/v/cheese/mine" target="_blank" class="cheese">我的课程</a>
</div>
<div class="member-bottom"><button class="logout">退出</button></div>`;
                }
            }).catch(e => {
                console.error(e);
            });
    }
}