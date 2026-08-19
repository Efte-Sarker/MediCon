const fs = require('fs');
const path = require('path');

const directoriesToSearch = ['app', 'src'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Find all fontWeight declarations
  const fontWeightRegex = /fontWeight\s*:\s*['"]?(\w+)['"]?,?/g;

  let match;
  let modifications = [];

  while ((match = fontWeightRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const weightValue = match[1];
    const startIndex = match.index;
    const endIndex = fontWeightRegex.lastIndex;

    // Look around for fontFamily
    // Grab the block (roughly between the preceding { and succeeding })
    const beforeStr = content.substring(Math.max(0, startIndex - 200), startIndex);
    const afterStr = content.substring(endIndex, Math.min(content.length, endIndex + 200));

    const blockRegex = /fontFamily\s*:\s*FontFamily\.\w+/;
    const hasFontFamilyNearby = blockRegex.test(beforeStr) || blockRegex.test(afterStr);

    modifications.push({
      startIndex,
      endIndex,
      fullMatch,
      weightValue,
      hasFontFamilyNearby,
    });
  }

  if (modifications.length === 0) return;

  let offset = 0;
  let addedImport = false;

  for (const mod of modifications) {
    const actualStart = mod.startIndex + offset;
    const actualEnd = mod.endIndex + offset;

    if (mod.hasFontFamilyNearby) {
      // Just delete the fontWeight line. (Also try to remove preceding whitespace)
      // For simplicity, just replace with empty string
      content = content.substring(0, actualStart) + content.substring(actualEnd);
      offset -= mod.fullMatch.length;
    } else {
      // Replace with appropriate FontFamily
      let fontFamilyProp = 'FontFamily.bold';
      if (mod.weightValue === '500') fontFamilyProp = 'FontFamily.medium';
      else if (mod.weightValue === '600') fontFamilyProp = 'FontFamily.semiBold';
      else if (mod.weightValue === '800' || mod.weightValue === '900')
        fontFamilyProp = 'FontFamily.extraBold';

      const replacement = `fontFamily: ${fontFamilyProp},`;
      content = content.substring(0, actualStart) + replacement + content.substring(actualEnd);
      offset += replacement.length - mod.fullMatch.length;

      // Ensure FontFamily is imported if not already
      if (!addedImport && !content.includes('FontFamily')) {
        // Find where to inject import
        // Determine relative path to src/theme
        const fileDir = path.dirname(filePath);
        const themeDir = path.resolve(__dirname, 'src/theme');
        let relPath = path.relative(fileDir, themeDir).replace(/\\/g, '/');
        if (!relPath.startsWith('.')) relPath = './' + relPath;

        const importStatement = `\nimport { FontFamily } from '${relPath}';\n`;
        // Inject after last import
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfImport = content.indexOf('\n', lastImportIndex);
          content =
            content.substring(0, endOfImport + 1) +
            importStatement +
            content.substring(endOfImport + 1);
          offset += importStatement.length;
        } else {
          content = importStatement + content;
          offset += importStatement.length;
        }
        addedImport = true;
      }
    }
  }

  // Clean up any empty lines left behind by deleted fontWeights
  content = content.replace(/\n\s*\n/g, '\n');

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
  const fullPath = path.join(__dirname, d);
  if (fs.existsSync(fullPath)) walkDir(fullPath);
});
