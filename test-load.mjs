import { pathToFileURL } from 'url';
import { createRequire } from 'module';
const req = createRequire(process.cwd() + '/');
const utilsDir = process.cwd() + '/node_modules/.pnpm/@iconify+utils@2.1.23/node_modules/@iconify/utils';
const fsPath = req.resolve('@iconify/utils/lib/loader/fs.mjs', { paths: [utilsDir] });
const { loadCollectionFromFS } = await import(pathToFileURL(fsPath).href);

console.log('cwd =', process.cwd());
const set = await loadCollectionFromFS('ph', false, undefined, process.cwd());
console.log('loadCollectionFromFS result:', set ? `OK (${Object.keys(set.icons).length} icons)` : 'FAILED → undefined');
