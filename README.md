<div align="center">
    <img src="src/player/assets/image/panel.gif" alt="logo">

# Bilibili 2019
恢复 2019 年 12 月 09 日前的部分[B站](https://www.bilibili.com/)页面，为了那些念旧的人

</div>

---
这是一个[Google Chrome](https://www.google.com/chrome/)的[manifest V3](https://developer.chrome.com/docs/extensions/mv3/manifest/)扩展项目，恢复 2019 年 12 月 09 日前的部分[B站](https://www.bilibili.com/)页面，尤其是那个小电视播放器。  
项目前身是[Bilibili-Old](https://github.com/MotooriKashin/Bilibili-Old)油猴脚本，在B站原始页面的基础上修修补补了四年多，奈何实在老旧，难以为继，于是有了推倒重来的念头。加上[manifest V3](https://developer.chrome.com/docs/extensions/mv3/manifest/)标准的推行，油猴脚本前途未卜，索性转为扩展项目。  
由于 HTML + js + css 都不在复用，从零开始手搓，肯定做不到完全复刻当年的模样，请多见谅！

---
# 功能
各种页面正在慢慢搭建中……  
- 播放器
   + 视频
      - [x] DASH
      - [x] flv
      - [x] 本地视频文件
   + 弹幕
      - [x] 普通弹幕（mode1/4/5/6）
      - [x] 高级弹幕（mode7）
      - [x] 代码弹幕（mode8）
      - [x] BAS弹幕（mode9）
      - [x] 本地弹幕文件
   + 字幕
      - [x] 在线 CC 字幕
      - [x] 本地 vtt 文件
- 评论
   + [x] 翻页
- 页面
   + [x] B站主页
   + [x] av
   + [x] Bangumi

---
# 安装
- 欢迎在安装之前访问核心[播放器页面](https://motoorikashin.github.io/Bilibili-2019/)体验一下旧版播放器  
- 若要安装，则要求使用最新的[Google Chrome](https://www.google.com/chrome/)浏览器（当前要求核心版本 125 以上，以后只会更高，恕不另行通知，且暂时无暇理会任何兼容性需求）。
   1. 在[RELEASE](https://github.com/MotooriKashin/Bilibili-2019/releases)页面下载最新的版本
   2. 解压到本地磁盘任意目录
   3. 打开 Chrome [管理扩展程序](chrome://extensions/)页面打开右上角的【开发者模式】
   4. 点击【加载已解压的扩展程序】按钮加载刚解压出的文件所在目录
   5. 更新版本请重复上述步骤

另外，也可以克隆项目到本地手动构建，参看[代码贡献指南](.github/contributing.md)

# 维护
欢迎念旧的人一起搭建记忆中的Bilibili，这里有一份简易的[代码贡献指南](.github/contributing.md)供参考

---
# 开源
[MIT License](LICENSE)
