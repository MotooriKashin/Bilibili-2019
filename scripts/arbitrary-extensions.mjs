/**
 * @file 生成非代码文件的定义文件
 */
import fs from 'fs/promises';

/** 非代码文件所在路径 */
const paths = [
    'src/player/assets/svg',
];

for (const path of paths) {
    fs.readdir(path).then(d => {
        d.forEach(d => {
            switch (true) {
                case d.endsWith('svg'):
                case d.endsWith('css'):
                case d.endsWith('html'): {
                    const arr = d.split('.');
                    const ext = arr.pop();
                    const name = arr.join('.');
                    const name_r = name.replace(/-/g, '_');
                    fs.writeFile(`${path}/${name}.d.${ext}.ts`, `declare const ${ext}_${name_r}: string;
export default ${ext}_${name_r};`);
                    break;
                }
            }
        })
    })
}