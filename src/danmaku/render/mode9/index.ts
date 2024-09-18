import { Danmaku, IDanmaku } from "../..";
import { customElement } from "../../../utils/Decorator/customElement";
import { AV } from "../../../utils/av";
import { Format } from "../../../utils/fomat";

/** 高级弹幕 */
@customElement('div')
export class Mode9 extends HTMLDivElement {
    /** 用于计算大小的画布 */
    static measureCanvas: CanvasRenderingContext2D;

    static extend(child: any, parent: any) {
        const cp: any = {};
        for (const k in child) {
            if (child.hasOwnProperty(k)) {
                cp[k] = child[k];
            }
        }
        for (const k in parent) {
            if (parent.hasOwnProperty(k)) {
                cp[k] = parent[k];
            }
        }

        return cp;
    }

    static pretreatDanmaku(dm: IDanmakuBAS) {
        /*
          * tidy up animations
          * def2set = { defname: [animations] }
          */
        dm.def2set = {};
        for (let i = 0; i < dm.defs!.length; i++) {
            const name = dm.defs![i].name;
            let index = 0;
            dm.def2set[name] = [];

            for (let j = 0; j < dm.sets!.length; j++) {
                switch (dm.sets![j].type) {
                    case 'Serial': // 串联
                        let delay = 0;
                        for (let k = 0; k < dm.sets![j].items!.length; k++) {
                            if (dm.sets![j].items![k].targetName === name) {
                                dm.def2set[name].push({
                                    name: `bas-${dm.idStr}-${name}-${index}`,
                                    valueStart: this.getValueStart(k, index, dm.def2set[name]),
                                    valueEnd: this.extend(
                                        this.getValueStart(k, index, dm.def2set[name]),
                                        dm.sets![j].items![k].attrs,
                                    ),
                                    easing:
                                        dm.sets![j].items![k].defaultEasing || 'linear',
                                    duration: dm.sets![j].items![k].duration!,
                                    delay: delay,
                                    group: j,
                                });
                                index++;
                            }
                            delay += dm.sets![j].items![k].duration!;
                        }
                        break;
                    case 'Parallel': // 语句组
                        for (let k = 0; k < dm.sets![j].items!.length; k++) {
                            if (dm.sets![j].items![k].targetName === name) {
                                dm.def2set[name].push({
                                    name: `bas-${dm.idStr}-${name}-${index}`,
                                    valueEnd: this.extend(
                                        this.getValueStart(k, index, dm.def2set[name]),
                                        dm.sets![j].items![k].attrs,
                                    ),
                                    easing:
                                        dm.sets![j].items![k].defaultEasing || 'linear',
                                    duration: dm.sets![j].items![k].duration!,
                                    delay: 0,
                                    group: j,
                                });
                                index++;
                            }
                        }
                        break;
                    case 'Unit': // 并联
                        if ((<ISet>dm.sets![j]).targetName === name) {
                            dm.def2set[name].push({
                                name: `bas-${dm.idStr}-${name}-${index}`,
                                valueEnd: (<ISet>dm.sets![j]).attrs!,
                                easing: (<ISet>dm.sets![j]).defaultEasing || 'linear',
                                duration: (<ISet>dm.sets![j]).duration!,
                                delay: 0,
                                group: j,
                            });
                            index++;
                        }
                }
            }
        }

        // 空动画，用来计算存活时间
        for (const name in dm.def2set) {
            if ({}.hasOwnProperty.call(dm.def2set, name)) {
                const defs = dm.defs!.filter((item) => item.name === name)[0];
                if (defs.attrs!.duration) {
                    dm.def2set[name].push({
                        name: `bas-${dm.idStr}-${name}-duration`,
                        valueEnd: {},
                        easing: 'linear',
                        duration: defs.attrs!.duration,
                        delay: 0,
                        group: -1,
                    });
                } else if (dm.def2set[name].length === 0) {
                    dm.def2set[name].push({
                        name: `bas-${dm.idStr}-${name}-0`,
                        valueEnd: {},
                        easing: 'linear',
                        duration: 4,
                        delay: 0,
                        group: -1,
                    });
                }
            }
        }

        dm.duration = 0;
        for (const name in dm.def2set) {
            if ({}.hasOwnProperty.call(dm.def2set, name)) {
                // 解决属性冲突
                dm.setsIntervals = <any>{}; // 保存每个属性动画的时间段
                let d2sLength = dm.def2set[name].length;
                for (let i = 0; i < d2sLength; i++) {
                    if (dm.def2set[name][i]) {
                        // 动画运行时间区间
                        const time = [
                            parseFloat(dm.def2set[name][i].delay!.toFixed(10)),
                            parseFloat((dm.def2set[name][i].delay! + dm.def2set[name][i].duration!).toFixed(10)),
                            dm.def2set[name][i].group,
                        ];
                        // 遍历元素所有变化属性
                        for (let attr in dm.def2set[name][i].valueEnd) {
                            if (dm.def2set[name][i].valueEnd.hasOwnProperty(attr)) {
                                if (['x', 'y', 'rotateX', 'rotateY', 'rotateZ', 'scale'].indexOf(attr) !== -1) {
                                    attr = 'transform';
                                }
                                if (dm.setsIntervals[<'scale'>attr]) {
                                    // 遍历该属性变化时间段
                                    let length = dm.setsIntervals[<'scale'>attr].length;
                                    for (let j = 0; j < length; j++) {
                                        if (dm.setsIntervals[<'scale'>attr][j]) {
                                            const currentGroup = dm.setsIntervals[<'scale'>attr][j][2];
                                            // 出现冲突
                                            if (
                                                dm.def2set[name][i].group !== currentGroup &&
                                                ((dm.setsIntervals[<'scale'>attr][j][0] > time[0]! &&
                                                    dm.setsIntervals[<'scale'>attr][j][0] < time[1]!) ||
                                                    (dm.setsIntervals[<'scale'>attr][j][1] > time[0]! &&
                                                        dm.setsIntervals[<'scale'>attr][j][1] < time[1]!) ||
                                                    (dm.setsIntervals[<'scale'>attr][j][0] <= time[0]! &&
                                                        dm.setsIntervals[<'scale'>attr][j][1] >= time[1]! &&
                                                        !(
                                                            dm.setsIntervals[<'scale'>attr][j][0] ===
                                                            dm.setsIntervals[<'scale'>attr][j][1]
                                                        ))) &&
                                                !(time[0] === time[1])
                                            ) {
                                                console.warn(
                                                    `BAS: attribute conflict, name: ${name} attr: ${attr} time: ${time} ${dm.setsIntervals[<'scale'>attr][j]}`,
                                                );
                                                dm.setsIntervals[<'scale'>attr] = dm.setsIntervals[<'scale'>attr].filter(
                                                    (item: (number | string)[]) => item[2] !== currentGroup,
                                                );
                                                dm.def2set[name] = dm.def2set[name].filter(
                                                    (item) => item.group !== currentGroup,
                                                ); // 清除同组动画

                                                j -= length - dm.setsIntervals[<'scale'>attr].length; // length 已改变，更新循环
                                                length = dm.setsIntervals[<'scale'>attr].length;

                                                i -= d2sLength - dm.def2set[name].length;
                                                d2sLength = dm.def2set[name].length;
                                            }
                                        }
                                    }
                                    dm.setsIntervals[<'scale'>attr].push(time);
                                } else {
                                    dm.setsIntervals[<'scale'>attr] = [time];
                                }
                            }
                        }
                    }
                }

                // 计算 duration
                for (let i = 0; i < dm.def2set[name].length; i++) {
                    const dura = dm.def2set[name][i].delay! + dm.def2set[name][i].duration!;
                    if (dura > dm.duration) {
                        dm.duration = dura;
                    }
                }
            }
        }
    }

    static getValueStart(groupIndex: number, setIndex: number, d2f: IAnimation[]): any {
        if (groupIndex >= 1 && setIndex >= 1) {
            if (d2f[setIndex - 1].valueEnd && Object.keys(d2f[setIndex - 1].valueEnd).length) {
                return d2f[setIndex - 1].valueEnd;
            } else {
                return this.getValueStart(groupIndex - 1, setIndex - 1, d2f);
            }
        }
    }

    /** 每当元素添加到文档中时调用。 */
    connectedCallback() {
        this.$dm.on = true;
    }

    /** 每当元素从文档中移除时调用。 */
    disconnectedCallback() {
        this.$dm.on = false;
    }

    private get xProportion() {
        return this.$container.$width / 100;
    };

    private get yProportion() {
        return this.$container.$height / 100;
    };

    private defs: IDef[];

    private sets: ISet[];

    /** 动画对应的结束时间 */
    private endProgress: Record<string, number> = {};

    /** 弹幕延时 */
    private startTime = 0;

    /** 样式 */
    private $style = document.createElement('style');

    constructor(
        /** 弹幕数据 */
        public $dm: IDanmakuBAS,
        /** 弹幕管理组件 */
        protected $container: Danmaku,
    ) {
        super();

        Mode9.pretreatDanmaku($dm);
        this.defs = $dm.defs;
        this.sets = $dm.sets;
    }

    /** 预处理百分比数据 */
    private percentObj2Num(dm: IDanmakuBAS) {
        // defs
        for (const def of dm.defs) {
            this.setNum(def.attrs);
        }
        // sets
        for (const set of dm.sets) {
            if (set.items) {
                for (const item of set.items) {
                    item.attrs && this.setNum(item.attrs);
                }
            } else {
                set.attrs && this.setNum(set.attrs);
            }
        }
        // def2set
        for (const ds in dm.def2set) {
            if (dm.def2set.hasOwnProperty(ds)) {
                for (const d of dm.def2set[ds]) {
                    this.setNum(d.valueEnd);
                    d.valueStart && this.setNum(d.valueStart);
                }
            }
        }
    }

    /** 百分比转真实值 */
    private setNum(attrs: IDefAttrs) {
        for (const item in attrs) {
            if (attrs.hasOwnProperty(item)) {
                let obj;
                if ((<IPercentNum>attrs[<'scale'>item])?.numType) {
                    obj = attrs[<'scale'>item];
                } else if ((<IPercentNum>attrs[<'scale'>item])?.value && (<IPercentNum>attrs[<'scale'>item])?.numType) {
                    obj = (<IPercentNum>attrs[<'scale'>item]).value
                } else {
                    continue;
                }
                if ((<IPercentNum>obj).numType === 'number') {
                    switch (item) {
                        case 'x': {
                            obj = (<IPercentNum>obj).value / this.xProportion;
                            break;
                        }
                        case 'y': {
                            obj = (<IPercentNum>obj).value / this.yProportion;
                            break;
                        }
                        default: {
                            obj = (<IPercentNum>obj).value;
                            break;
                        }
                    }
                } else if ((<IPercentNum>obj).numType === 'percent') {
                    switch (item) {
                        case 'fontSize': {
                            obj = (<IPercentNum>obj).value * this.xProportion;
                            break;
                        }
                        case 'width': {
                            obj = (<IPercentNum>obj).value * this.xProportion;
                            break;
                        }
                        case 'height': {
                            obj = (<IPercentNum>obj).value * this.yProportion;
                            break;
                        }
                        default: {
                            obj = (<IPercentNum>obj).value;
                            break;
                        }
                    }
                }
                if ((<IPercentNum>attrs[<'scale'>item]).numType) {
                    (<IPercentNum>attrs[<'scale'>item]) = <IPercentNum>obj;
                } else if ((<IPercentNum>attrs[<'scale'>item]).value && (<IPercentNum>attrs[<'scale'>item]).numType) {
                    (<IPercentNum>attrs[<'scale'>item]).value = <number>obj;
                }
            }
        }
    }

    private init() {
        this.innerHTML = this.itemsTemplate();
        this.classList.add('bas-danmaku-item-wrap');
        this.animationTemplate();

        for (const def of this.defs) {
            const { name } = def;
            this.endProgress[name] = 0;
            this.transience(name);
        }

        this.addEventListener('animationend', this.animationCallback);

        for (const def of this.defs) {
            if (def.attrs.target) {
                this.querySelector<HTMLElement>(`.bas-danmaku-item--${def.name}`)?.addEventListener('click', () => {
                    switch (def.attrs.target?.objType) {
                        case 'av': {
                            self.open(`//www.bilibili.com/video/av${def.attrs.target.bvid ? AV.fromStr(def.attrs.target.bvid) : def.attrs.target.av}/?p=${def.attrs.target.page || 1}${def.attrs.target.time ? `&t=${def.attrs.target.time / 1000}` : ''}`);
                            break;
                        }
                        case 'bangumi': {
                            self.open(`//www.bilibili.com/bangumi/play/ss${def.attrs.target.seasonId}${def.attrs.target.time ? `?t=${def.attrs.target.time / 1000}` : ''}#${def.attrs.target.episodeId}`);
                            break;
                        }
                        case 'seek': {
                            this.$container.$seek(def.attrs.target.time! / 1000);
                            break;
                        }
                    }
                });
            }
        }

        this.$container.$host.appendChild(this);
    }

    /** 动画回调处理函数 */
    private animationCallback = (e: AnimationEvent) => {
        const name = e.animationName.split('-')[2];
        if (this.endProgress[name]) {
            this.endProgress[name]++;
        } else {
            this.endProgress[name] = 1;
        }

        this.transience(name);

        if (this.endProgress[name] === this.$dm.def2set[name].length || e.animationName.split('-')[3] === 'duration') {
            (<HTMLElement>e.target)?.remove();
            if (!this.querySelectorAll('.bas-danmaku-item').length) {
                this.remove();
                this.$style.remove();
            }
        }
    }

    /** 弹幕节点构造 */
    private itemsTemplate() {
        return this.defs.reduce((s, d) => {
            if (!d.attrs.parent) {
                s += this.itemsTemplateOne(d);
            }
            return s;
        }, '');
    }

    /** 子节点构造 */
    private itemsTemplateOne(def: IDef, xProportion = this.xProportion, yProportion = this.yProportion) {
        const item = def.attrs;
        const animations = this.$dm.def2set[def.name];
        let styleOut = `animation-name: ${this.split(animations, 'name')}; animation-duration: ${this.split(animations, 'duration')}; animation-timing-function: ${this.split(animations, 'easing')}; animation-delay: ${this.split(animations, 'delay')};`;
        for (const i in item) {
            if (item.hasOwnProperty(i)) {
                styleOut += this.getStyleOut(i, <number>item[<'scale'>i]);
            }
        }
        let styleIn = '';
        switch (def.type) {
            case "DefText": {
                let rotate = '';
                if (item.rotateX || item.rotateY || item.rotateZ) {
                    rotate = ` rotateX(${item.rotateX || 0}deg) rotateY(${item.rotateY || 0}deg) rotateZ(${item.rotateZ || 0}deg)`;
                }
                styleOut += `transform:translate(${<number>item.x * xProportion}px, ${<number>item.y * yProportion}px)${rotate} scale(${item.scale});`
                styleIn = this.getStyleIn(item);

                // child
                let child = '';
                for (const d of this.defs) {
                    if (d.attrs.parent === def.name) {
                        this.defSize(def);
                        child += this.itemsTemplateOne(
                            d,
                            def.attrs.width! / 100,
                            def.attrs.height! / 100,
                        );
                    }
                }

                return `<div class="bas-danmaku-item bas-danmaku-item-text bas-danmaku-item--${def.name}" style="${styleOut}"><div class="bas-danmaku-item-inner" style="${styleIn}">${item.content}${child}</div></div>`;
            }
            case "DefButton": {
                styleOut += `transform:translate(${<number>item.x * xProportion}px, ${<number>item.y * yProportion}px) scale(${item.scale});color:${Format.rgba(item.textColor!, <number>item.textAlpha,)};background-color:${Format.rgba(item.fillColor!, <number>item.fillAlpha)};`;
                styleIn = this.getStyleIn(item);

                return `<div class="bas-danmaku-item bas-danmaku-item-button bas-danmaku-item--${def.name}" style="${styleOut}"><div class="bas-danmaku-item-inner" style="${styleIn}">${item.text}</div></div>`;
            }
            case "DefPath": {
                styleOut += `transform:translate(${<number>item.x * xProportion}px, ${<number>item.y * yProportion}px);`;
                styleIn = this.getStyleIn(item);
                let svgAttributes;
                if (item.viewBox) {
                    if (item.width || item.height) {
                        svgAttributes = `viewBox="${item.viewBox}" ${item.width ? `width="${item.width * (<number>item.scale || 1)}"` : ''} ${item.height ? `height="${item.height * (<number>item.scale || 1)}"` : ''}`;
                    } else {
                        svgAttributes = `viewBox="${item.viewBox}" width="${parseInt(item.viewBox.split(' ')[2], 10) * (<number>item.scale || 1)}"`;
                    }
                } else if (item.scale) {
                    svgAttributes = `style="transform:scale(${item.scale});transform-origin: 0 0;overflow:visible;"`;
                }

                const pathAttributes = `fill="${Format.rgba(item.fillColor!, <number>item.fillAlpha,)}" stroke="${Format.rgba(item.borderColor!, <number>item.borderAlpha)}" stroke-width="${item.borderWidth}" d="${item.d}"`;

                return `<div class="bas-danmaku-item bas-danmaku-item-path bas-danmaku-item--${def.name}" style="${styleOut}"><div class="bas-danmaku-item-inner" style="${styleIn}"><svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" ${svgAttributes}><path ${pathAttributes}></svg></div></div>`;
            }
        }
    }

    /** 动画字符构造 */
    private split(animations: IAnimation[], type: string) {
        return animations.reduce((s, d, i) => {
            switch (type) {
                case 'duration': {
                    s += d[type] + 'ms';
                    break;
                }
                case 'delay': {
                    s += d[type] + this.startTime + 'ms';
                    break;
                }
                default: {
                    s += d[<'delay'>type];
                    break;
                }
            }
            if (i !== animations.length - 1) {
                s += ',';
            }
            return s;
        }, '');
    }

    /** 结束样式构造 */
    private getStyleOut(name: string, value: number) {
        switch (name) {
            case 'alpha':
                return `opacity:${value};`;
            case 'color':
                return `color:${Format.hexColor(value)};`;
            case 'zIndex':
                return `z-index:${value};`;
            default:
                return '';
        }
    }

    /** 初始样式构造 */
    private getStyleIn(item: IDefAttrs) {
        let styleIn = '';
        let transform = '';
        if (item.strokeWidth && item.strokeColor) {
            styleIn += `-webkit-text-stroke:${item.strokeWidth}px ${Format.hexColor(item.strokeColor)};`;
        }
        if (item.hasOwnProperty('fontFamily')) {
            styleIn += `font-family:&quot;${item.fontFamily!.split(',').join('&quot;,&quot;')}&quot;,sans-serif;`;
        }
        if (item.hasOwnProperty('textShadow')) {
            styleIn += `text-shadow:${item.textShadow
                ? 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px'
                : 'none'
                };`;
        }
        if (item.hasOwnProperty('bold')) {
            styleIn += `font-weight:${item.bold ? 'bold' : 'normal'};`;
        }
        if (item.hasOwnProperty('fontSize')) {
            if (<number>item.fontSize >= 12) {
                styleIn += `font-size:${item.fontSize}px;`;
            } else {
                styleIn += 'font-size:12px;';
                transform += `scale(${<number>item.fontSize / 12}) `;
            }
        }
        if (item.hasOwnProperty('anchorX') && item.hasOwnProperty('anchorY')) {
            transform += `translate(${-item.anchorX! * 100}%,${-item.anchorY! * 100}%)`;
        }
        if (transform) {
            styleIn += `transform:${transform};`;
        }
        return styleIn;
    }

    /** 计算弹幕大小 */
    private defSize(def: IDef) {
        if (!def.attrs.height || !def.attrs.width) {
            Mode9.measureCanvas || (Mode9.measureCanvas = document.createElement('canvas').getContext('2d')!);
            Mode9.measureCanvas.font = `${def.attrs.bold ? 'bold ' : ''} ${def.attrs.fontSize}px ${def.attrs.fontFamily}`;
            def.attrs.width = Mode9.measureCanvas.measureText(def.attrs.content!).width;
            def.attrs.height = <number>def.attrs.fontSize;
        }
    }

    /** 动画样式构造 */
    private animationTemplate() {
        this.$style.textContent = `${this.defs.reduce((s, d) => {
            const animations = this.$dm.def2set[d.name];

            for (const a of animations) {
                if (!d.attrs.parent) {
                    s += this.keyframesTemplate(d, a.name, a.valueStart, a.valueEnd);
                } else {
                    const parent = this.findParent(d.attrs.parent);
                    if (parent) {
                        this.defSize(parent);
                        s += this.keyframesTemplate(d, a.name, a.valueStart, a.valueEnd, parent.attrs.width! / 100, parent.attrs.height! / 100);
                    }
                }
            }
            return s;
        }, '')}`;
        this.appendChild(this.$style);
    }

    /** keyframes构造 */
    private keyframesTemplate(
        def: IDef,
        name: string,
        valueStart?: IDefAttrs,
        valueEnd?: IDefAttrs,
        xProportion = this.xProportion,
        yProportion = this.yProportion,
    ) {
        let styleStart = '';
        let styleEnd = '';

        // 对 transform 单独处理
        if ((valueStart && (valueStart.x !== undefined || valueStart.y !== undefined || valueStart.rotateX !== undefined || valueStart.rotateY !== undefined || valueStart.rotateZ !== undefined || valueStart.scale !== undefined)) || (valueEnd && (valueEnd.x !== undefined || valueEnd.y !== undefined || valueEnd.rotateX !== undefined || valueEnd.rotateY !== undefined || valueEnd.rotateZ !== undefined || valueEnd.scale !== undefined))) {
            const fixEndUndefined = (name: string) => {
                if (valueEnd && valueEnd[<'scale'>name] !== undefined) {
                    return <number>valueEnd[<'scale'>name];
                } else if (valueStart && valueStart[<'scale'>name] !== undefined) {
                    return <number>valueStart[<'scale'>name];
                } else if (def.attrs[<'scale'>name]) {
                    return <number>def.attrs[<'scale'>name];
                } else {
                    return 0;
                }
            };
            const endX = fixEndUndefined('x') * xProportion;
            const endY = fixEndUndefined('y') * yProportion;
            const endRotateX = fixEndUndefined('rotateX');
            const endRotateY = fixEndUndefined('rotateY');
            const endRotateZ = fixEndUndefined('rotateZ');
            const endScale = def['type'] === 'DefPath' ? 1 : fixEndUndefined('scale');

            const fixStartUndefined = (name: string) => {
                if (valueStart && typeof valueStart[<'scale'>name] !== 'undefined') {
                    return <number>valueStart[<'scale'>name];
                } else if (typeof def.attrs[<'scale'>name] !== 'undefined') {
                    return <number>def.attrs[<'scale'>name]
                } else {
                    return 0;
                }
            };
            const startX = fixStartUndefined('x') * xProportion;
            const startY = fixStartUndefined('y') * yProportion;
            const startRotateX = fixStartUndefined('rotateX');
            const startRotateY = fixStartUndefined('rotateY');
            const startRotateZ = fixStartUndefined('rotateZ');
            const startScale = def['type'] === 'DefPath' ? 1 : fixStartUndefined('scale');

            switch (def.type) {
                case 'DefText':
                    styleStart += `transform:translate(${startX}px, ${startY}px) rotateX(${startRotateX}deg) rotateY(${startRotateY}deg) rotateZ(${startRotateZ}deg) scale(${startScale});`;
                    styleEnd += `transform:translate(${endX}px, ${endY}px) rotateX(${endRotateX}deg) rotateY(${endRotateY}deg) rotateZ(${endRotateZ}deg) scale(${endScale});`;
                    break;
                case 'DefButton':
                case 'DefPath':
                    styleStart += `transform:translate(${startX}px, ${startY}px);`;
                    styleEnd += `transform:translate(${endX}px, ${endY}px);`;
                    break;
            }
        }

        // 其他渐变属性
        for (const i in valueStart) {
            if (valueStart.hasOwnProperty(i)) {
                styleStart += this.getStyleOut(i, <number>valueStart[<'scale'>i]);
            }
        }
        for (const i in valueEnd) {
            if (valueEnd.hasOwnProperty(i)) {
                styleEnd += this.getStyleOut(i, <number>valueEnd[<'scale'>i]);
            }
        }
        if (!styleEnd) {
            // hack for animationend event not firing after the end of empty animation in Edge
            styleEnd = 'line-height:1;';
        }
        if (styleStart) {
            return `
@keyframes ${name} {
    0% { ${styleStart} }
    100% { ${styleEnd} }
}`;
        } else {
            return `
@keyframes ${name} {
    100% { ${styleEnd} }
}`;
        }
    }

    /** 获取父节点 */
    private findParent(name: string) {
        for (const def of this.defs) {
            if (def.name === name) {
                return def;
            }
        }
    }

    /** 瞬变属性 */
    private transience(defName: string) {
        const index = this.endProgress[defName];
        const def2set = this.$dm.def2set[defName][index];

        if (def2set?.valueEnd) {
            if (def2set.valueEnd.content) {
                this.querySelector(`.bas-danmaku-item--${defName} .bas-danmaku-item-inner`)!.innerHTML = def2set.valueEnd.content;
            }
            if (def2set.valueEnd.text) {
                this.querySelector(`.bas-danmaku-item--${defName} .bas-danmaku-item-inner`)!.innerHTML = def2set.valueEnd.text;
            }
            if (def2set.valueEnd.fontSize) {
                const fontSize = def2set.valueEnd.fontSize;
                if (<number>fontSize >= 12) {
                    (<HTMLElement>(this.querySelector(`.bas-danmaku-item--${defName} .bas-danmaku-item-inner`))).style.fontSize = `${fontSize}px`;
                } else {
                    (<HTMLElement>(this.querySelector(`.bas-danmaku-item--${defName} .bas-danmaku-item-inner`))).style.fontSize = '12px';
                    (<HTMLElement>(this.querySelector(`.bas-danmaku-item--${defName} .bas-danmaku-item-inner`))).style.transform = `scale(${<number>fontSize / 12})`;
                }
            }
        }
    }

    async execute(delay: number) {
        this.startTime = delay;
        this.percentObj2Num(this.$dm);
        this.init();
    }
}

export interface IDanmakuBAS extends IDanmaku {
    // 以下为BAS弹幕专用
    duration: number;
    def2set: Record<string, IAnimation[]>;
    defs: IDef[];
    sets: ISet[];
    setsIntervals: Record<keyof IDefAttrs, number[][]>;
}

/** 通用属性 */
interface ICommon {
    x?: IPercentNum | number;
    y?: IPercentNum | number;
    zIndex?: IPercentNum | number;
    scale?: IPercentNum | number;
    duration?: number;
}

/** 文本属性 */
interface IText extends ICommon {
    content?: string;
    alpha?: IPercentNum | number;
    color?: number;
    anchorX?: IPercentNum | number;
    anchorY?: IPercentNum | number;
    fontSize?: IPercentNum | number;
    fontFamily?: string;
    bold?: IPercentNum | number;
    textShadow?: IPercentNum | number;
    strokeWidth?: IPercentNum | number;
    strokeColor?: number;
    rotateX?: IPercentNum | number;
    rotateY?: IPercentNum | number;
    rotateZ?: IPercentNum | number;
    parent?: string;
}

/** 按钮属性 */
interface IButton extends ICommon {
    text?: string;
    fontSize?: IPercentNum | number;
    textColor?: number;
    textAlpha?: IPercentNum | number;
    fillColor?: number;
    fillAlpha?: IPercentNum | number;
    target?: IButtonTarget;
}

/** 按钮回调 */
interface IButtonTarget {
    objType: 'av' | 'bangumi' | 'seek';
    time?: number;
    page?: number;
    av?: number;
    bvid?: string;
    seasonId?: number;
    episodeId?: number;
}

interface IPath extends ICommon {
    d?: string;
    viewBox?: string;
    borderColor?: number;
    borderAlpha?: IPercentNum | number;
    borderWidth?: IPercentNum | number;
    fillColor?: number;
    fillAlpha?: IPercentNum | number;
}

export interface IDefAttrs extends IText, IButton, IPath {
    width?: number;
    height?: number;
}

/** 弹幕事件 */
export enum DanmakuEvent {

    /** 添加弹幕，注意参数为新增弹幕 */
    DANMAKU_ADD,

    /** 发送弹幕 */
    DANMAKU_SEND,
}


/** 弹幕事件对应的数据类型 */
export interface IDanmakuEvent {
    0: IDanmaku[];
    1: IDanmaku;
}

export interface IAnimation {
    delay: number;
    duration: number;
    easing: string;
    group: number;
    name: string;
    valueStart?: IDefAttrs;
    valueEnd: IDefAttrs;
}

export interface IPercentNum {
    numType: 'number' | 'percent';
    value: number;
}

export interface IDef {
    attrs: IDefAttrs;
    name: string;
    obj_type: string;
    type: 'DefText' | 'DefButton' | 'DefPath';
    _reg_order: number;
}

export interface ISet {
    type: 'Serial' | 'Parallel' | 'Unit';
    items?: ISet[];
    attrs?: IDefAttrs;
    defaultEasing?: string;
    default_easing?: string;
    duration?: number;
    targetName?: string;
    target_name?: string;
}
