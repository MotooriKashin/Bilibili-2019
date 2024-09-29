import { customElement } from "../../utils/Decorator/customElement";
import { Element } from "../../utils/element";
import QRCode from "easyqrcodejs";
import stylesheet from "./index.css" with {type: 'css'};
import { auth_code } from "../../io/com/bilibili/passport/x/passport-tv-login/qrcode/auth_code";
import { toastr } from "../../toastr";
import { poll } from "../../io/com/bilibili/passport/x/passport-tv-login/qrcode/poll";

/** APP 扫码登录 */
@customElement(undefined, `access-key-${Date.now()}`)
export class AccessKey extends HTMLElement {

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
        appendTo: this.#host, class: 'container', innerHTML: `<div class="buttom">
    <div>未注册过哔哩哔哩的手机号，我们将自动帮你注册账号</div>
    <div>登录或完成注册即代表你同意 <a target="_blank" href="//www.bilibili.com/protocal/licence.html"> 用户协议 </a>和 <a target="_blank" href="//www.bilibili.com/blackboard/privacy-pc.html"> 隐私政策 </a></div>
</div>` });

    #body = Element.add('div', { class: 'wrap', insertTo: { target: this.#container, where: 'afterbegin' } });

    #left = Element.add('div', { appendTo: this.#body, class: 'left', innerHTML: '<header>扫描二维码登录</header>' });

    #line = Element.add('div', { appendTo: this.#body, class: 'line' });

    #right = Element.add('div', {
        appendTo: this.#body, class: 'right', innerHTML: `<header>警告</header>
<p>此功能模拟APP端登录过程来获取身份鉴权</p>
<p>有了APP鉴权，才能实现一些网页端原本无法实现的操作。这肯定伴随着一定的风险，尤其是您想实现的操作可能会将该鉴权泄露给第三方时。所以</p>
<b>如非必要，切莫授权</b>
<p>该鉴权有什么用？问就是没用，建议点击空白处退出→_→</p>
<i>鉴权都有有效期，怀疑鉴权失效时请重新扫码授权即可~</i>` });

    #codePanel = Element.add('div', { appendTo: this.#left, class: 'panel' });

    #codeTip = Element.add('footer', { appendTo: this.#left, innerHTML: '<div>请使用<a href="//app.bilibili.com/" target="_blank" >哔哩哔哩客户端</a></div><div>扫码登录或扫码下载APP</div>' });

    #qrcode = Element.add('div', { appendTo: this.#codePanel, class: 'qrcode' });

    #qrTip = Element.add('img', { appendTo: this.#codePanel, class: 'qrtip', attribute: { src: '//s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/qr-tips.51ff2bcf.png' } });

    #timeout = Element.add('div', { appendTo: this.#codePanel, class: ['progress', 'to'], innerHTML: '<div></div><div>二维码已过期</div><div>请点击刷新</div>' });

    #scaned = Element.add('div', { appendTo: this.#codePanel, class: ['progress', 'sd'], innerHTML: '<div></div><div>扫码成功</div><div>请在手机登录</div>' });

    #QRCode?: QRCode;

    #timer?: ReturnType<typeof setInterval>;

    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];

        this.popover = 'auto';

        this.addEventListener('toggle', () => {
            if (this.matches(':popover-open')) {
                this.auth_code();
            } else {
                clearInterval(this.#timer);
            }
        });
        this.#timeout.addEventListener('click', this.auth_code);
    }

    auth_code = () => {
        clearInterval(this.#timer);
        auth_code()
            .then(({ code, message, data }) => {
                if (code !== 0) throw new ReferenceError(message, { cause: { code, message, data } });
                const { url, auth_code } = data;
                this.#QRCode ? this.#QRCode.makeCode(url) : (this.#QRCode = new QRCode(this.#qrcode, { text: url, correctLevel: QRCode.CorrectLevel.H }));
                this.poll(auth_code);
                this.#timeout.classList.remove('d');
                this.#scaned.classList.remove('d');
            })
            .catch(e => {
                toastr.error('获取登录二维码出错', e);
                console.error(e);
            })
    }

    poll(auth_code: string) {
        this.#timer = setInterval(() => {
            poll(auth_code)
                .then(({ code, message, data }) => {
                    switch (code) {
                        case 0: {
                            clearInterval(this.#timer);
                            const { access_token, expires_in } = data;
                            const timeout = Date.now() + expires_in * 1000;
                            localStorage.setItem('access_key', access_token);
                            localStorage.setItem('access_key_expires_in', <any>timeout);
                            toastr.success('获取移动端鉴权成功', `有效期至：${new Date(timeout).toLocaleString()}`)
                            break;
                        }
                        case 86038: {
                            this.#timeout.classList.add('d');
                            clearInterval(this.#timer);
                            break;
                        }
                        case 86039: {
                            break;
                        }
                        case 86090: {
                            this.#scaned.classList.add('d');
                            break;
                        }
                        default: {
                            throw new ReferenceError(message, { cause: { code, message, data } });
                        }
                    }
                })
                .catch(e => {
                    toastr.error('二维码状态错误', e);
                    console.error(e);
                })
        }, 2e3);
    }

    showPopover() {
        document.body.contains(this) || document.body.appendChild(this);
        super.showPopover();
    }
}