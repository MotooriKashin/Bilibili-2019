import { Html } from "..";
import { AV } from "../../../utils/av";
import { Desc } from "../../desc";
import { MAIN_EVENT, mainEv } from "../../event";
import { Gotop } from "../../gotop";
import { Info } from "../../info";
import { ROUTER } from "../../router";
import { Bofqi } from "../bofqi";
import { CommentBox } from "../comment";
import { Footer } from "../footer";
import { Header } from "../header";

/** AV页组件 */
export class Av {

    #header = new Header();

    #info = new Info();

    #bofqi = new Bofqi();

    #desc = new Desc();

    #comment = new CommentBox();

    #footer = new Footer();

    constructor() {
        document.documentElement.replaceWith(new Html());

        document.body.append(this.#header, this.#info, this.#bofqi, this.#desc, this.#comment, this.#footer, new Gotop());

        mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.AV, new URL(location.href)]);

        const url = new URL(location.href);
        if (/bv/i.test(url.pathname)) {
            url.pathname = AV.fromStr(url.pathname);
            history.replaceState(undefined, '', url);
        }
    }
}