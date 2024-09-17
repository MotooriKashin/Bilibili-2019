import { Danmaku, IDanmaku } from "../..";
import { toastr } from "../../../toastr";
import { Script } from "./Script";
import { Parser } from "./Script/Parser";
import { Scanner } from "./Script/Scanner";
import { VirtualMachine } from "./Script/VirtualMachine";

/** 代码弹幕 */
export class Mode8 {

    /** 解码后的弹幕实例 */
    #vm: VirtualMachine;

    constructor(
        /** 弹幕数据 */
        public $dm: IDanmaku,
        /** 弹幕管理组件 */
        protected $container: Danmaku,
    ) {

        this.#vm = new VirtualMachine(new Script($container));
        this.prase().catch(e => {
            toastr.error('代码弹幕解析出错~', '这通常只会影响该条弹幕本身您可以放心忽略~', e)
            console.error(new SyntaxError('代码弹幕解析出错~', { cause: e }), $dm);
        });
    }

    private async prase() {
        const s = new Scanner(this.$dm.content
            .replace(/(\/n|\\n|\n|\r\n)/g, '\n')
            .replace(/(&amp;)|(&lt;)|(&gt;)|(&apos;)|(&quot;)/g, (a: string) => {
                // 处理误当成xml非法字符的转义字符
                return <string>{
                    '&amp;': '&',
                    '&lt;': '<',
                    '&gt;': '>',
                    '&apos;': '\'',
                    '&quot;': '"'
                }[a]
            }));
        const p = new Parser(s);
        this.#vm.rewind();
        this.#vm.setByteCode(p.parse(this.#vm));
    }

    async execute() {
        this.#vm.execute();
        this.#vm.rewind();
    }
}