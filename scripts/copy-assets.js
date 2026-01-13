import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const filesToCopy = [
  { src: 'src/manifest.json', dest: 'dist/manifest.json' },
  {
    src: 'src/assets/clocklock_logo_solid_16.png',
    dest: 'dist/assets/clocklock_logo_solid_16.png',
  },
  {
    src: 'src/assets/clocklock_logo_solid_32.png',
    dest: 'dist/assets/clocklock_logo_solid_32.png',
  },
  {
    src: 'src/assets/clocklock_logo_solid_48.png',
    dest: 'dist/assets/clocklock_logo_solid_48.png',
  },
  {
    src: 'src/assets/clocklock_logo_solid_128.png',
    dest: 'dist/assets/clocklock_logo_solid_128.png',
  },
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
