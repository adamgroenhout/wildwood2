import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_IMAGE = 'src/assets/images/gemini_generated_image_83a33y83a33y83a3.png';
const OUTPUT_IMAGE = 'public/og-image.png';
const WIDTH = 1200;
const HEIGHT = 630;

async function generateOGImage() {
  console.log('Generating Open Graph image...');

  if (!fs.existsSync(INPUT_IMAGE)) {
    console.error(`Input image not found: ${INPUT_IMAGE}`);
    process.exit(1);
  }

  // Create an SVG overlay for the text
  // We use a simple SVG because sharp is excellent at compositing them
  const svgOverlay = `
    <svg width="${WIDTH}" height="${HEIGHT}">
      <style>
        .title { fill: #F9F7F0; font-family: serif; font-size: 80px; font-weight: bold; }
        .subtitle { fill: #F9F7F0; font-family: sans-serif; font-size: 32px; letter-spacing: 4px; text-transform: uppercase; opacity: 0.9; }
        .cta-bg { fill: #B17048; rx: 8; }
        .cta-text { fill: #F9F7F0; font-family: sans-serif; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
      </style>
      
      <!-- Dark overlay for better text contrast -->
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="rgba(0,0,0,0.35)" />
      
      <!-- Center Text -->
      <text x="50%" y="45%" text-anchor="middle" class="title">Wildwood Psychotherapy</text>
      <text x="50%" y="55%" text-anchor="middle" class="subtitle">EMDR &amp; Trauma Therapy • Leesburg, VA</text>
      
      <!-- CTA "Button" -->
      <rect x="400" y="420" width="400" height="60" class="cta-bg" />
      <text x="50%" y="458" text-anchor="middle" class="cta-text">Schedule a Consultation</text>
    </svg>
  `;

  try {
    await sharp(INPUT_IMAGE)
      .resize(WIDTH, HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(OUTPUT_IMAGE);

    console.log(`Successfully generated: ${OUTPUT_IMAGE}`);
  } catch (error) {
    console.error('Error generating OG image:', error);
  }
}

generateOGImage();
