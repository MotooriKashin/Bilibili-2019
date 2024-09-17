import { Header } from ".";
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