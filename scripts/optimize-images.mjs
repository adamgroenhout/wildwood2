import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const IMAGES_DIR = 'src/assets/images';
const MAX_WIDTH = 2000;
const QUALITY = 80;

async function optimize() {
  const files = await fs.readdir(IMAGES_DIR, { recursive: true });
  const imageFiles = files.filter(f => /\.(jpe?g|png|tiff|avif)$/i.test(f));

  console.log(`Found ${imageFiles.length} images to optimize.`);

  for (const file of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = inputPath.replace(/\.(jpe?g|png|tiff|avif)$/i, '.webp');

    try {
      const metadata = await sharp(inputPath).metadata();
      
      let pipeline = sharp(inputPath);
      
      if (metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH);
      }

      await pipeline
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const oldSize = (await fs.stat(inputPath)).size;
      const newSize = (await fs.stat(outputPath)).size;
      
      console.log(`Optimized: ${file} (${(oldSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024 / 1024).toFixed(2)}MB)`);
      
      // DO NOT delete the original file - Astro needs the source to build its own optimized versions
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  console.log('Optimization complete.');
}

optimize();
