import { addElement } from "../Utils/element";
import { IDisplay } from "./Display";
import { UIComponent } from "./UIComponent";

export class CommentButton extends UIComponent {

    constructor(param: ICommentButton) {
        super(param);
        this.$host = <any>addElement('button', { class: 'as3-danmaku-item' });
        this.$host.classList.add('as3-button');
        this.$host.innerText = param.text.replace(/\/n/g, '\n');
        param.onclick && this.$host.addEventListener('click', param.onclick);
        this.init();
        param.width && (this.width = param.width);
        param.height && (this.height = param.height);
    }
}

export interface ICommentButton extends IDisplay {
    /** 按钮宽度 */
    width?: number;
    /** 按钮高度 */
    height?: number;
    /** 按钮标题 */
    text: string;
    /** 点击处理函数 */
    onclick: (ev: MouseEvent) => void;
} 