# 代码贡献指南
这是一个[Google Chrome](https://www.google.com/chrome/)的[manifest V3](https://developer.chrome.com/docs/extensions/mv3/manifest/)扩展项目，恢复 2019 年 12 月 09 日前的部分[B站](https://www.bilibili.com/)页面，来满足我们这些念旧的人的需求。  
该项目使用 TypeScript 语言实现逻辑，使用HTML和CSS复刻页面，使用[esbuild](https://esbuild.github.io/)输出未打包的扩展程序。  
无须考虑任何兼容性，请尽情享用各种最新的前端标准。

### 开发环境
1. 环境依赖【版本要求一律最新】
   - [Node.js](https://nodejs.org/)
   - [Visual Studio Code](https://code.visualstudio.com/)
2. Fork 项目后, 克隆至本地
3. 安装依赖
```
npm update
```

### 开发流程
4. 调试
   - 执行 npm `build` 命令输出未打包的扩展程序到`dist`目录
   - 打开 Chrome [管理扩展程序](chrome://extensions/)页面打开右上角的【开发者模式】
   - 点击【加载已解压的扩展程序】按钮加载`dist`目录
   - 访问对应的B站页面查看效果
   - 修改代码重新打包后，须在【管理扩展程序】页面点击扩展的【重新加载】图标并刷新对应的B站页面
5. 提交 commit
6. 发起 PR (合并请求)

### 一点执念
- 不建议引入任何前端框架
- 不建议轻易引入 npm 依赖，除非实在无法自己实现
- 建议紧随最新的前端标准，只要当前 Google Chrome Stable 版本支持