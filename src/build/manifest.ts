import pkg from 'fs-extra';
import manifest from "../manifest.json" with {type: 'json'}

Reflect.deleteProperty(manifest, '$schema'); // 移除 $schema 键

const { writeJson } = pkg;
await writeJson('./dist/manifest.json', manifest, { spaces: '\t' });