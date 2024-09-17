import { Html } from "..";
import { mainEv, MAIN_EVENT } from "../../event";
import { Gotop } from "../../gotop";
import { Info } from "../../info";
import { ROUTER } from "../../router";
import { Bofqi } from "../bofqi";
import { CommentBox } from "../comment";
import { Footer } from "../footer";
import { Header } from "../header";
import { Detail } from "./detail";

/** Bangumi页组件 */
export class Bangumi {

    #header = new Header();

    #info = new Info();

    #bofqi = new Bofqi();

    #detail = new Detail();

    #comment = new CommentBox();

    #footer = new Footer();

    constructor() {
        document.documentElement.replaceWith(new Html());

        document.body.append(this.#header, this.#info, this.#bofqi, this.#detail, this.#comment, this.#footer, new Gotop());

        mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.BANGUMI, new URL(location.href)]);
    }
}