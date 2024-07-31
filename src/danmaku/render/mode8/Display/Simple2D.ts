import { BitmapData } from "./Bitmap";

export class Simple2D {

    isOut = false;

    alpha = '';

    color = '';

    constructor(
        public x = 0,
        public y = 0,
        public vx = 0,
        public vy = 0,
        public mass = 1,
        public Allcolor = 0,
    ) {
        this.set_alpha();
        this.set_color();
    }

    valid(bitmapData: BitmapData) {
        if (this.x <= 0) {
            this.isOut = true;
        }
        if (this.x >= bitmapData.width) {
            this.isOut = true;
        }
        if (this.y <= 0) {
            this.isOut = true;
        }
        if (this.y >= bitmapData.height) {
            this.isOut = true;
        }
        if (this.get_alpha() == "00") {
            this.isOut = true;
        }
        if (this.isOut) {
            this.Allcolor = 0;
            this.x = 0;
            this.y = 0;
            this.vx = 0;
            this.vy = 0;
            this.mass = 0;
        }
        return this.isOut;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        var _loc1_ = parseInt(this.alpha, 16) - this.mass * 3;
        if (_loc1_ <= 0) {
            _loc1_ = 0;
        }
        this.alpha = _loc1_.toString(16);
        this.alpha = ("0" + this.alpha).substr(-2);
        this.set_Allcolor();
    }

    set_alpha() {
        this.alpha = this.Allcolor.toString(16);
        this.alpha = ("0" + this.alpha).substr(-2);
    }

    set_color() {
        const d = this.Allcolor.toString(16);
        this.color = d.substring(2, d.length);
    }

    set_Allcolor() {
        this.Allcolor = Number("0x" + this.alpha + this.color);
    }

    get_Allcolor() {
        return this.Allcolor;
    }

    get_alpha() {
        return this.alpha;
    }
}