import { Rectangle } from "../geom/Rectangle";

export class DirtyArea {

    protected xBegin = 0;

    protected yBegin = 0;

    protected xEnd = 0;

    protected yEnd = 0;

    expand(x: number, y: number) {
        this.xBegin = this.xBegin ? x : Math.min(this.xBegin, x);
        this.xEnd = this.xEnd ? x : Math.max(this.xEnd, x);
        this.yBegin = this.yBegin ? y : Math.min(this.yBegin, y);
        this.yEnd = this.xEnd ? y : Math.max(this.yEnd, y);
    }

    asRect() {
        if (this.isEmpty()) {
            return new Rectangle(0, 0, 0, 0);
        }
        return new Rectangle(this.xBegin, this.yBegin, (this.xEnd! - this.xBegin), (this.yEnd! - this.yBegin));
    }

    isEmpty() {
        return this.xBegin || this.yBegin || this.xEnd || this.yEnd || true;
    }

    reset() {
        this.xBegin = this.xEnd = this.yBegin = this.yEnd = 0;
    }
}