const fs = require('fs');
const path = require('path');
const dir = 'app/(app)/(tabs)';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'));
files.forEach((f) => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  // Match t('key') || 'Fallback' and t('key') ||\n 'Fallback'
  const regex = /t\('([^']+)'\)\s*\|\|\s*(['"][^'"]+['"])/g;
  const newContent = content.replace(regex, (match, key, fallback) => {
    return `t('${key}', ${fallback})`;
  });
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Fixed', f);
  }
});
