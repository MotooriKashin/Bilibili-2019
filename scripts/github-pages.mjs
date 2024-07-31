import { build } from "esbuild";

const style = await build({
    entryPoints: [
        'src/player/style/index.css'
    ],
    bundle: true,
    minify: true,
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
        'src/docs/index.ts'
    ],
    bundle: true,
    minify: true,
    outdir: 'src/docs/',
    outbase: "src/docs/",
    format: 'iife',
    // 内嵌源映射以便于调试
    treeShaking: true,
    charset: 'utf8',
    loader: {
        '.svg': 'text',
    },
    define: {
        /** 基于哈希消息认证码的一次性口令的密钥 */
        __TOTP_KEY__: `'${crypto.randomUUID()}'`,
        /** 播放器样式文件 */
        __BOFQI_STYLE__: `'${style.outputFiles[0].text.replaceAll('\n', '\\n')}'`,
    },
    supported: {
        // 装饰器暂未得到任何浏览器支持
        decorators: false,
    }
});