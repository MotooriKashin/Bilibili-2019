import { copy, emptyDir } from "fs-extra";

// 清空目标文件夹
await emptyDir("./dist");

// 拷贝资源文件
await Promise.all([
    import('./esbuild.ts'),
    import('./manifest.ts'),
    copy('./src/_locales', './dist/_locales'),
    copy('./src/assets', './dist/assets'),
    copy('./src/sidebar', './dist/sidebar', { filter: e => e.endsWith('.ts') || e.endsWith('.css') ? false : true }),
    copy('./src/options', './dist/options', { filter: e => e.endsWith('.ts') || e.endsWith('.css') ? false : true }),
]);