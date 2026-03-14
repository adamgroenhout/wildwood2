import fs from 'fs';
import path from 'path';

const CONTENT_DIR = 'src/content/pages';

// Map of valid fields for each block type from config.yml
const BLOCK_SCHEMA = {
  hero: ['type', 'hero_title', 'hero_subtitle', 'hero_image', 'hero_alt', 'cta_text', 'cta_url', 'theme', 'alignment', 'specialties'],
  text: ['type', 'title', 'subtitle', 'body', 'button_text', 'button_url', 'theme', 'alignment', 'padding'],
  image_text: ['type', 'title', 'subtitle', 'body', 'image', 'image_alt', 'image_position', 'link_text', 'link_url', 'theme', 'padding'],
  accordion: ['type', 'title', 'subtitle', 'body', 'items', 'button_text', 'button_url', 'theme', 'layout', 'padding'],
  grid: ['type', 'title', 'subtitle', 'items', 'button_text', 'button_url', 'columns', 'style', 'theme', 'padding'],
  cta: ['type', 'title', 'tagline', 'body', 'button_text', 'button_url', 'image', 'image_alt', 'theme', 'layout'],
  map: ['type'] // Map block is minimal in config
};

function cleanBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks;

  return blocks.map(block => {
    const type = block.type;
    const validFields = BLOCK_SCHEMA[type];

    if (!validFields) {
      console.warn(`Unknown block type: ${type}`);
      return block; // Return as is if unknown
    }

    const cleanedBlock = {};
    validFields.forEach(field => {
      if (block.hasOwnProperty(field)) {
        cleanedBlock[field] = block[field];
      }
    });

    // Special handling for nested lists if needed, 
    // but the top-level filtering usually solves the "ghost text" issue
    
    return cleanedBlock;
  });
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (data.blocks) {
      const originalCount = JSON.stringify(data.blocks).length;
      data.blocks = cleanBlocks(data.blocks);
      const newCount = JSON.stringify(data.blocks).length;

      if (originalCount !== newCount) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Cleaned: ${filePath} (${originalCount - newCount} characters removed)`);
      } else {
        console.log(`No ghost data found in: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));
files.forEach(file => {
  processFile(path.join(CONTENT_DIR, file));
});
