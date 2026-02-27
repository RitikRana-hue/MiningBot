// Simple script to create placeholder PNG icons
// You should replace these with your actual logo/icons

const fs = require('fs');
const path = require('path');

const sizes = [192, 512];

const createPlaceholderIcon = (size) => {
    // Create a simple SVG that can be converted to PNG
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.25}" fill="#10b981"/>
  <path d="M${size * 0.5} ${size * 0.25}L${size * 0.75} ${size * 0.5}L${size * 0.5} ${size * 0.75}L${size * 0.25} ${size * 0.5}L${size * 0.5} ${size * 0.25}Z" fill="white" stroke="white" stroke-width="${size * 0.03}" stroke-linejoin="round"/>
  <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.09}" fill="#10b981"/>
  <path d="M${size * 0.5} ${size * 0.31}V${size * 0.41}M${size * 0.5} ${size * 0.59}V${size * 0.69}M${size * 0.59} ${size * 0.5}H${size * 0.69}M${size * 0.31} ${size * 0.5}H${size * 0.41}" stroke="white" stroke-width="${size * 0.03}" stroke-linecap="round"/>
</svg>`;

    fs.writeFileSync(
        path.join(__dirname, 'public', `icon-${size}.svg`),
        svg
    );

    console.log(`✓ Created icon-${size}.svg`);
};

console.log('Generating placeholder icons...');
sizes.forEach(createPlaceholderIcon);
console.log('\n⚠️  Note: These are placeholder icons. Replace them with your actual logo for production.');
console.log('   You can use tools like https://realfavicongenerator.net/ to generate proper icons.\n');
