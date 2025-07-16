import { build } from 'esbuild';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  external: [
    'pg-native',
    ...Object.keys(packageJson.dependencies || {}),
  ],
  banner: {
    js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
`
  },
  define: {
    'import.meta.dirname': '__dirname',
  },
  loader: {
    '.node': 'file',
  },
  minify: false,
  sourcemap: true,
});

console.log('Server build complete!');