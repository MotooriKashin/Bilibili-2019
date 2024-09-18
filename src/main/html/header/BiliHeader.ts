import { Header } from ".";
import { Element } from "../../../utils/element";
import { ProxyHook } from "../../../utils/hook/Proxy";

export class BiliHeader {

    constructor() {

        ProxyHook.property(self, 'BiliHeader', class {
            $header = new Header();
            constructor({ config }: IBiliHeader) {
                if (config.headerType === 'mini') {
                    this.$header.classList.add('mini');
                } else {
                    this.$header.$resource_id = 142;
                }
            }
            init(el: HTMLElement) {
                // 兼容处理：部分页面使用顶栏脚本提供的UserStatus对象判定登录状态
                Element.add('script', { appendTo: document.head, attribute: { src: '//s1.hdslb.com/bfs/seed/jinkela/header/header.js' } });
                return el.replaceWith(this.$header);
            }
        });
    }
}

interface IBiliHeader {
    components: unknown;
    config: {
        disableChannelEntry?: boolean;
        disableSticky?: boolean;
        forceVersion?: number;
        headerType: 'mini' | 'medium';
        theme?: 'light';
        tokenSupport?: boolean;
    }
}