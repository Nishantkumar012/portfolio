import { createRequire } from 'module';
import { pathToFileURL } from 'url';
const req = createRequire(process.cwd() + '/');
const mllyPath = req.resolve('mlly', { paths: [process.cwd() + '/node_modules/.pnpm/@iconify+utils@2.1.23/node_modules/@iconify/utils'] });
const { resolvePath } = await import(pathToFileURL(mllyPath).href);

const cwd = process.cwd();
console.log('cwd:', cwd);
try {
  const p = await resolvePath('@iconify-json/ph/icons.json', { url: cwd });
  console.log('plain cwd ->', p);
} catch (e) {
  console.log('plain cwd FAILED:', String(e.message).split('\n')[0]);
}
try {
  const p = await resolvePath('@iconify-json/ph/icons.json', { url: pathToFileURL(cwd + '/').href });
  console.log('file url ->', p);
} catch (e) {
  console.log('file url FAILED:', String(e.message).split('\n')[0]);
}
