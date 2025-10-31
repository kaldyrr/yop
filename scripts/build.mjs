import { rm, mkdir, cp, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);
const out = new URL('../build/', import.meta.url);

async function main() {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  // Copy core files
  await cp(new URL('../index.html', import.meta.url), new URL('./index.html', out));
  await cp(new URL('../manifest.json', import.meta.url), new URL('./manifest.json', out));
  await cp(new URL('../robots.txt', import.meta.url), new URL('./robots.txt', out));
  await cp(new URL('../sitemap.xml', import.meta.url), new URL('./sitemap.xml', out));
  await writeFile(new URL('./.nojekyll', out), '');

  // Copy directories
  await cp(new URL('../assets/', import.meta.url), new URL('./assets/', out), { recursive: true });
  await mkdir(new URL('./js/', out), { recursive: true });
  await cp(new URL('../js/yopta.js', import.meta.url), new URL('./js/yopta.js', out));
  await cp(new URL('../yopta/', import.meta.url), new URL('./yopta/', out), { recursive: true });

  // Generate YoptaScript from JS source for main widget
  try {
    const runtime = await readFile(new URL('../js/yopta.js', import.meta.url), 'utf8');
    // Eval runtime in Node context to get globalThis.yopta
    // eslint-disable-next-line no-eval
    eval(runtime);
    if (typeof globalThis.yopta !== 'function') throw new Error('yopta runtime not loaded');
    const src = await readFile(new URL('../yopta/main-src.js', import.meta.url), 'utf8');
    const ys = globalThis.yopta(src, 'js');
    await writeFile(new URL('../yopta/main.yopta', import.meta.url), ys, 'utf8');
    await writeFile(new URL('./yopta/main.yopta', out), ys, 'utf8');
  } catch (e) {
    console.warn('Yopta conversion failed, keeping existing main.yopta:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
