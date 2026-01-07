# Icons for Tailhook Extension

## Quick Start: Generating PNG Icons

The extension requires PNG icons in three sizes: 16x16, 48x48, and 128x128 pixels.

### Method 1: Using ImageMagick (Recommended)

```bash
# Install ImageMagick if not already installed
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

# Convert SVG to PNG at different sizes
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Method 2: Using Inkscape

```bash
# Install Inkscape
# Ubuntu/Debian: sudo apt-get install inkscape
# macOS: brew install inkscape

# Convert SVG to PNG
inkscape icon.svg --export-filename=icon16.png -w 16 -h 16
inkscape icon.svg --export-filename=icon48.png -w 48 -h 48
inkscape icon.svg --export-filename=icon128.png -w 128 -h 128
```

### Method 3: Using Online Converters

1. Visit https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Set output dimensions (16x16, 48x48, 128x128)
4. Download and rename as `icon16.png`, `icon48.png`, `icon128.png`

### Method 4: Create Custom Icons

You can replace these with your own custom PNG icons. Just make sure they are:
- Named: `icon16.png`, `icon48.png`, `icon128.png`
- Sized: 16x16, 48x48, 128x128 pixels respectively
- Format: PNG with transparency

## Current Status

Currently only `icon.svg` is provided as a template. Run one of the methods above to generate the required PNG files before loading the extension in Chrome.
