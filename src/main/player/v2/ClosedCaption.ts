import { VTTCue, WebVTT } from "./WebVTT";

/** Closed Caption of Bilibili */
export class ClosedCaption {

    /** 字幕序列 */
    private cue: CCCue[] = [];

    /** 字幕轴升序 */
    private sort() {
        this.cue.sort((a, b) => a.from > b.from ? 1 : -1);
    }

    /**
     * 添加字幕
     * 
     * @param cue 字幕轴
     */
    addCue(...cue: CCCue[]) {
        this.cue.push(...cue);
    }

    /** 格式化为文件 */
    toJSON() {
        this.sort();
        return JSON.stringify(this.cue, undefined, '\t');
    }

    /** 转化为WebVTT */
    toWebVTT() {
        this.sort();
        const vtt = new WebVTT();
        vtt.addCue(...this.cue.map(d => new VTTCue(d.from, d.to, d.content)));
        return vtt;
    }
}

interface CCCue {
    /** 字幕文本 */
    content: string;
    /** 起始时间 */
    from: number;
    /** 指定行数，从 0 开始 */
    location?: number;
    /** 结束时间 */
    to: number;
}