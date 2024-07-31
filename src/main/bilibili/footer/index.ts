import svg_icon_download from "../../../player/assets/svg/icon-download.svg";
import svg_icon_wechat from "../../../player/assets/svg/icon-wechat.svg";
import svg_icon_weibo from "../../../player/assets/svg/icon-weibo.svg";
import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";

/** 底栏 */
@customElement('div')
export class Footer extends HTMLDivElement {

    /**
     * 需要监听变动的属性。
     * 与实例方法`attributeChangedCallback`配合使用。
     * 此字符串序列定义了`attributeChangedCallback`回调时的第一个参数的可能值。
     */
    // static observedAttributes = [];

    /**
     * 在属性更改、添加、移除或替换时调用。
     * 需要与静态属性`observedAttributes`配合使用。
     * 此回调的第一个参数在`observedAttributes`数组中定义。
     */
    // attributeChangedCallback(name: IobservedAttributes, oldValue: string, newValue: string) {}

    /** 初始化标记 */
    // #inited = false;

    /** 每当元素添加到文档中时调用。 */
    // connectedCallback() {}

    /** 每当元素从文档中移除时调用。 */
    // disconnectedCallback() {}

    /** 每当元素被移动到新文档中时调用。 */
    // adoptedCallback() {}

    private $cnt = Element.add('div', { class: 'footer-cnt' }, this);

    private $boston = Element.add('div', { class: 'boston-postcards' }, this.$cnt, `<div>
<a>bilibili</a>
<a href="/blackboard/aboutUs.html">关于我们</a>
<a href="/blackboard/contact.html">联系我们</a>
<a href="/blackboard/join.html">加入我们</a>
<a href="/blackboard/friends-links.html">友情链接</a>
<a href="//account.bilibili.com/account/official/home">bilibili认证</a>
<a href="//ir.bilibili.com/">Investor Relations</a>
</div><div>
<a>传送门</a>
<a href="/blackboard/help.html">帮助中心</a>
<a href="/video/av120040/">高级弹幕</a>
<a href="/blackboard/topic_list.html">活动专题页</a>
<a href="/v/copyright/intro">侵权申诉</a>
<a href="/blackboard/x/act_list/">活动中心</a>
<a href="//t.bilibili.com/topic/name/%E7%94%A8%E6%88%B7%E5%8F%8D%E9%A6%88%E8%AE%BA%E5%9D%9B/feed">用户反馈论坛</a>
<a href="//space.bilibili.com/6823116#/album">壁纸站</a>
<a href="/blackboard/activity-S1jfy69Jz.html">名人堂</a>
<a href="/basc">专车号服务中心</a>
</div><div>
<a></a>
<a href="//app.bilibili.com/" class="icon">${svg_icon_download}APP下载<img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/biliapp_qrcode.png"></a>
<a href="//weibo.com/bilibiliweb" class="icon">${svg_icon_weibo}新浪微博<img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/weibo_qrcode.png"></a>
<a class="icon">${svg_icon_wechat}官方微信<img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/weixin_qrcode.gif"></a>
</div>`);

    private $partner = Element.add('div', { class: 'partner' }, this.$cnt, `<div class="pic-box">
    <img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/partner.png">
    <img loading="lazy" src="//s1.hdslb.com/bfs/static/jinkela/long/images/pic962110.png">
    <div class="jvs-cert"></div>
</div>
<div class="content-box">
    <p>广播电视节目制作经营许可证：<span>（沪）字第1248号</span> | 网络文化经营许可证：<span>沪网文[2016]2296-134号</span> | 信息网络传播视听节目许可证：<span>0910417</span> | 互联网ICP备案：<a href="//www.miitbeian.gov.cn/" target="_blank">沪ICP备13002172号-3</a> 沪ICP证：<span>沪B2-20100043</span> | 违法不良信息举报邮箱：help@bilibili.com | 违法不良信息举报电话：4000233233转3 | <a href="//static.hdslb.com/images/yyzz.png" target="_blank">营业执照</a></p>
    <p><a href="//www.shjbzx.cn" target="_blank"><i class="icons-footer icons-footer-report"></i><span> 上海互联网举报中心</span></a> |<a href="//jbts.mct.gov.cn/" target="_blank">12345政务服务便民热线</a> |<a target="_blank" href="//www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011002002436"><img loading="lazy" src="//static.hdslb.com/images/base/beiantubiao.png" style="vertical-align: top;"> 沪公网安备 31011002002436号 |</a><a href="mailto:userreport@bilibili.com">儿童色情信息举报专区</a> |<a href="//www.shdf.gov.cn/shdf/channels/740.html" target="_blank">扫黄打非举报</a></p>
    <p><a href="//report.12377.cn:13225/toreportinputNormal_anis.do" target="_blank">网上有害信息举报专区：<img loading="lazy" src="//static.hdslb.com/images/12377.png" width="16" height="16" style="vertical-align: sub;"> 中国互联网违法和不良信息举报中心</a></p>
    <p>亲爱的市民朋友，上海警方反诈劝阻电话“962110”系专门针对避免您财产被骗受损而设，请您一旦收到来电，立即接听。</p>
    <p>公司名称：上海宽娱数码科技有限公司 | 公司地址：上海市杨浦区政立路485号 | 电话：021-25099888</p>
</div>`);

    constructor() {
        super();
        this.insertAdjacentHTML('beforeend', `<style>${__BILI_FOOTER_STYLE__}</style>`);
    }
}


//////////////////////////// 全局增强 ////////////////////////////
declare global {
    /** 基于哈希消息认证码的一次性口令的密钥 */
    const __BILI_FOOTER_STYLE__: string;
}