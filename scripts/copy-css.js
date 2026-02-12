const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

// Read index.html
let html = fs.readFileSync(indexPath, 'utf-8');

// Find the CSS file (it has a hash in the name)
const files = fs.readdirSync(distDir);
const cssFile = files.find(f => f.startsWith('renderer-') && f.endsWith('.css'));

if (cssFile) {
  // Check if CSS link already exists
  if (!html.includes(`<link rel="stylesheet" href="./${cssFile}">`)) {
    // Remove old CSS links
    html = html.replace(/<link rel="stylesheet"[^>]*>/g, '');
    // Add new CSS link in head
    html = html.replace('</head>', `    <link rel="stylesheet" href="./${cssFile}">\n</head>`);

    // Write updated index.html
    fs.writeFileSync(indexPath, html);
    console.log('CSS file updated in index.html:', cssFile);
  } else {
    console.log('CSS file already linked:', cssFile);
  }
} else {
  console.warn('No CSS file found in dist directory');
}
