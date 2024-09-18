import { Html } from "..";
import { Desc } from "../../desc";
import { MAIN_EVENT, mainEv } from "../../event";
import { Gotop } from "../../gotop";
import { Info } from "../../info";
import { ROUTER } from "../../router";
import { Bofqi } from "../bofqi";
import { CommentBox } from "../comment";
import { Footer } from "../footer";
import { Header } from "../header";

/** 稍后再看页组件 */
export class Toview {

    #header = new Header();

    #info = new Info();

    #bofqi = new Bofqi();

    #desc = new Desc();

    #comment = new CommentBox();

    #footer = new Footer();

    constructor() {
        document.documentElement.replaceWith(new Html());

        document.body.append(this.#header, this.#info, this.#bofqi, this.#desc, this.#comment, this.#footer, new Gotop());

        mainEv.trigger(MAIN_EVENT.NAVIGATE, [ROUTER.TOVIEW, new URL(location.href)]);
    }
}