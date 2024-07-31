import { IDisplay } from "./Display";
import { Sprite } from "./Sprite";

export class CommentCanvas extends Sprite {

    constructor(param: IDisplay) {
        super(param);
        this.init();
    }
}