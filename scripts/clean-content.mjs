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
  cta: ['type', 'title', 'tagline', 'button_text', 'button_url', 'image', 'image_alt', 'theme', 'layout'], // REMOVED 'body' to prevent ghost text movement
  map_section: ['type', 'title', 'subtitle', 'body', 'address', 'phone', 'email', 'map_embed_url', 'map_link_url', 'theme', 'padding']
};

function cleanBlocks(blocks) {
  if (!Array.isArray(blocks)) return blocks;

  const seenContent = new Set();

  return blocks.filter(block => {
    const type = block.type;
    if (!type) {
      console.warn(`Block missing 'type' field, removing:`, block);
      return false; // Remove blocks without a type
    }

    // Deduplication logic: Check for identical body or text content
    const contentKey = block.body || block.text;
    if (contentKey && contentKey.trim().length > 50) { 
      // Normalize: Remove ALL whitespace and non-alphanumeric characters for comparison
      const normalized = contentKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenContent.has(normalized)) {
        console.warn(`Duplicate content found in block [${type}], removing instance.`);
        return false;
      }
      seenContent.add(normalized);
    }

    return true;
  }).map(block => {
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
