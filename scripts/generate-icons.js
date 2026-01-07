#!/usr/bin/env node

/**
 * Icon Generator for Tailhook Chrome Extension
 * Converts SVG icon to required PNG sizes (16x16, 48x48, 128x128)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICON_SIZES = [16, 48, 128];
const SVG_PATH = path.join(__dirname, '../icons/icon.svg');
const ICONS_DIR = path.join(__dirname, '../icons');

async function generateIcons() {
  console.log('🪝 Tailhook Icon Generator\n');

  // Check if SVG exists
  if (!fs.existsSync(SVG_PATH)) {
    console.error('❌ Error: icon.svg not found at', SVG_PATH);
    process.exit(1);
  }

  console.log('✓ Found icon.svg');
  console.log('\nGenerating PNG icons...\n');

  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(SVG_PATH);

    // Generate each size
    for (const size of ICON_SIZES) {
      const outputPath = path.join(ICONS_DIR, `icon${size}.png`);

      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated icon${size}.png (${size}x${size})`);
    }

    console.log('\n✅ All icons generated successfully!');
    console.log('\nYou can now load the extension in Chrome:');
    console.log('  1. Open chrome://extensions/');
    console.log('  2. Enable "Developer mode"');
    console.log('  3. Click "Load unpacked"');
    console.log('  4. Select the tailhook directory\n');

  } catch (error) {
    console.error('\n❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
