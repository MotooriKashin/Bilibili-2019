import { build } from "esbuild";

const style = await build({
    entryPoints: [
        'src/player/style/index.css',
        'src/main/bilibili/html/style/index.css',
        'src/main/bilibili/player/style/index.css',
        'src/main/bilibili/header/style/index.css',
        'src/main/bilibili/footer/style/index.css',
        'src/main/bilibili/comment/style/index.css',
        'src/main/bilibili/info/style/index.css',
        'src/main/bilibili/desc/style/index.css',
        'src/main/bilibili/home/style/index.css',
    ],
    bundle: true,
    minify: true,
    outdir: 'dist',
    outbase: "src",
    format: 'iife',
    // 内嵌源映射以便于调试
    sourcemap: 'inline',
    treeShaking: true,
    charset: 'utf8',
    loader: {
        '.woff': 'dataurl',
        '.gif': 'dataurl',
        '.png': 'dataurl',
    },
    write: false,
});

// 编译代码文件
await build({
    entryPoints: [
        'src/sw/index.ts',
        'src/main/index.ts',
        'src/main/WebRTC.ts',
        'src/main/bilibili/space/index.ts',
        'src/main/bilibili/live/index.ts',
    ],
    bundle: true,
    minify: true,
    outdir: 'dist',
    outbase: "src",
    format: 'iife',
    // 内嵌源映射以便于调试
    sourcemap: 'inline',
    treeShaking: true,
    charset: 'utf8',
    loader: {
        '.svg': 'text',
        '.css': 'text',
    },
    define: {
        /** 基于哈希消息认证码的一次性口令的密钥 */
        __TOTP_KEY__: `'${crypto.randomUUID()}'`,
        /** 播放器样式文件 */
        __BOFQI_STYLE__: `'${style.outputFiles[0].text.replaceAll('\n', '\\n')}'`,
        __HTML_STYLE__: `'${style.outputFiles[1].text.replaceAll('\n', '\\n')}'`,
        __BILI_PLAYER_STYLE__: `'${style.outputFiles[2].text.replaceAll('\n', '\\n')}'`,
        __BILI_HEADER_STYLE__: `'${style.outputFiles[3].text.replaceAll('\n', '\\n')}'`,
        __BILI_FOOTER_STYLE__: `'${style.outputFiles[4].text.replaceAll('\n', '\\n')}'`,
        __BILI_COMMENT_STYLE__: `'${style.outputFiles[5].text.replaceAll('\n', '\\n')}'`,
        __BILI_INFO_STYLE__: `'${style.outputFiles[6].text.replaceAll('\n', '\\n')}'`,
        __BILI_DESC_STYLE__: `'${style.outputFiles[7].text.replaceAll('\n', '\\n')}'`,
        __BILI_HOME_STYLE__: `'${style.outputFiles[8].text.replaceAll('\n', '\\n')}'`,
    },
    supported: {
        // 装饰器暂未得到任何浏览器支持
        decorators: false,
    }
});
