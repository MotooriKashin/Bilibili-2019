import { build } from "esbuild";
import type { PluginBuild } from "esbuild";

const cssConstructStylesheetPlugin = {
    name: 'css imports',
    setup(pluginBuild: PluginBuild) {
        pluginBuild.onLoad({ filter: /\.css$/ }, async args => {
            if (args.with.type === 'css') {
                // 编译 CSS 样式文件
                const result = await build({
                    bundle: true,
                    entryPoints: [args.path],
                    minify: pluginBuild.initialOptions.minify,
                    charset: 'utf8',
                    loader: {
                        '.png': 'base64',
                        '.gif': 'base64',
                        '.svg': 'base64',
                    },
                    write: false,
                });
                const contents = `
        const styles = new CSSStyleSheet();
        styles.replaceSync(\`${result.outputFiles[0].text}\`);
        export default styles;`;
                return { contents, loader: 'js' };
            }
        });
    }
}

// 编译资源文件
await build({
    entryPoints: [
        'src/sidebar/index.ts',
        'src/options/index.ts',
        'src/main/index.ts',
    ],
    outdir: 'dist',
    outbase: "src",
    bundle: true,
    minify: true,
    format: 'iife',
    sourcemap: true,
    treeShaking: true,
    charset: 'utf8',
    supported: {
        decorators: false, // 装饰器暂未得到任何浏览器支持
    },
    plugins: [cssConstructStylesheetPlugin],
    define: {
        __TOTP_KEY__: `'${crypto.randomUUID()}'`, // 基于哈希消息认证码的一次性口令的密钥
    },
    loader: {
        '.svg': 'text',
    },
});