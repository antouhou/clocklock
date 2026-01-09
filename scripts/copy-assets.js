import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const filesToCopy = [
  { src: 'src/manifest.json', dest: 'dist/manifest.json' },
  { src: 'src/assets/icon-16.svg', dest: 'dist/assets/icon-16.svg' },
  { src: 'src/assets/icon-32.svg', dest: 'dist/assets/icon-32.svg' },
  { src: 'src/assets/icon-48.svg', dest: 'dist/assets/icon-48.svg' },
  { src: 'src/assets/icon-128.svg', dest: 'dist/assets/icon-128.svg' },
];

for (const file of filesToCopy) {
  const srcPath = join(root, file.src);
  const destPath = join(root, file.dest);
  
  const destDir = dirname(destPath);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }
  
  copyFileSync(srcPath, destPath);
  console.log(`Copied ${file.src} -> ${file.dest}`);
}
