const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname);
const directoriesToSearch = ['app', 'src'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const fontWeightRegex = /fontWeight\s*:\s*['"]?([0-9a-zA-Z]+)['"]?,?/g;
  let match;
  let modifications = [];

  while ((match = fontWeightRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const weightValue = match[1];
    const startIndex = match.index;
    const endIndex = fontWeightRegex.lastIndex;

    const beforeStr = content.substring(Math.max(0, startIndex - 200), startIndex);
    const afterStr = content.substring(endIndex, Math.min(content.length, endIndex + 200));

    const blockRegex = /fontFamily\s*:/;
    const hasFontFamilyNearby = blockRegex.test(beforeStr) || blockRegex.test(afterStr);

    modifications.push({ startIndex, endIndex, fullMatch, weightValue, hasFontFamilyNearby });
  }

  if (modifications.length === 0) return;

  // Process backwards
  modifications.reverse();

  let addedImport = false;

  for (const mod of modifications) {
    if (mod.hasFontFamilyNearby) {
      content = content.substring(0, mod.startIndex) + content.substring(mod.endIndex);
    } else {
      let fontFamilyProp = 'FontFamily.bold';
      if (mod.weightValue === '500') fontFamilyProp = 'FontFamily.medium';
      else if (mod.weightValue === '600') fontFamilyProp = 'FontFamily.semiBold';
      else if (mod.weightValue === '800' || mod.weightValue === '900')
        fontFamilyProp = 'FontFamily.extraBold';
      else if (mod.weightValue === 'normal' || mod.weightValue === '400')
        fontFamilyProp = 'FontFamily.regular';

      const replacement = `fontFamily: ${fontFamilyProp},`;
      content =
        content.substring(0, mod.startIndex) + replacement + content.substring(mod.endIndex);

      if (!addedImport && !content.includes('FontFamily')) {
        const fileDir = path.dirname(filePath);
        const themeDir = path.resolve(baseDir, 'src/theme');
        let relPath = path.relative(fileDir, themeDir).replace(/\\/g, '/');
        if (!relPath.startsWith('.')) relPath = './' + relPath;

        const importStatement = `\nimport { FontFamily } from '${relPath}';\n`;
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfImport = content.indexOf('\n', lastImportIndex);
          content =
            content.substring(0, endOfImport + 1) +
            importStatement +
            content.substring(endOfImport + 1);
        } else {
          content = importStatement + content;
        }
        addedImport = true;
      }
    }
  }

  if (content !== originalContent) {
    console.log(`Updated ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

directoriesToSearch.forEach((d) => {
  const fullPath = path.join(baseDir, d);
  if (fs.existsSync(fullPath)) walkDir(fullPath);
});
