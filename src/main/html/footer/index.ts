import { customElement } from "../../../utils/Decorator/customElement";
import { Element } from "../../../utils/element";
import stylesheet from "./index.css" with {type: 'css'};

/** 底栏模块 */
@customElement(undefined, `footer-${Date.now()}`)
export class Footer extends HTMLElement {

    #host = this.attachShadow({ mode: 'closed' });

    #wrp = Element.add('div', { class: 'footer-wrp', appendTo: this.#host });

    #cnt = Element.add('div', { class: 'footer-cnt', appendTo: this.#wrp });

    #post = Element.add('div', {
        class: 'boston-postcards', appendTo: this.#cnt, innerHTML: `<div><div class="tips">bilibili</div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/aboutUs.html">关于我们</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/contact.html">联系我们</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/join.html">加入我们</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/friends-links.html">友情链接</a></div><div class="cards"><a target="_blank" href="//account.bilibili.com/account/official/home">bilibili认证</a></div><div class="cards"><a target="_blank" href="http://ir.bilibili.com">Investor Relations</a></div></div>
<div><div class="tips">传送门</div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/help.html">帮助中心</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/video/av120040/">高级弹幕</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/topic_list.html">活动专题页</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/v/copyright/intro">侵权申诉</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/x/act_list/">活动中心</a></div><div class="cards"><a target="_blank" href="https://t.bilibili.com/topic/name/%E7%94%A8%E6%88%B7%E5%8F%8D%E9%A6%88%E8%AE%BA%E5%9D%9B/feed">用户反馈论坛</a></div><div class="cards"><a target="_blank" href="//space.bilibili.com/6823116#/album">壁纸站</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/blackboard/activity-S1jfy69Jz.html">名人堂</a></div><div class="cards"><a target="_blank" href="//www.bilibili.com/basc">专车号服务中心</a></div></div>
<div><a target="_blank" href="//app.bilibili.com/"><div class="app"></div><em>客户端下载</em><img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/biliapp_qrcode.png"></a><a target="_blank" href="//weibo.com/bilibiliweb"><div class="weibo"></div><em>新浪微博</em><img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/weibo_qrcode.png"></a><a><div class="weixin"></div><em>官方微信</em><img loading="lazy" src="//s1.hdslb.com/bfs/seed/jinkela/footer-v2/images/weixin_qrcode.gif"></a></div>` });

    #partner = Element.add('div', {
        class: 'partner', appendTo: this.#cnt, innerHTML: `<div class="pic-box">
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
</div>` })
    constructor() {
        super();

        this.#host.adoptedStyleSheets = [stylesheet];
    }
}