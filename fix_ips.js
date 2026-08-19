const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/services');

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('10.0.2.2')) {
    let newContent = content;

    // Add import if not present
    if (!newContent.includes('expo-constants')) {
      newContent = "import Constants from 'expo-constants';\n" + newContent;
    }

    // Define localhost dynamic variable
    if (!newContent.includes('const localhost =')) {
      newContent = newContent.replace(
        /(const API_BASE_URL = .*?;)/,
        "const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';\n$1",
      );
    }

    // For chatService.ts, it doesn't use API_BASE_URL, it has inline fetch
    if (!newContent.includes('const localhost =')) {
      newContent = newContent.replace(
        /(const response = await fetch\()/,
        "const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';\n      $1",
      );
    }

    // Replace 10.0.2.2 with ${localhost} and use template literals
    newContent = newContent.replace(/http:\/\/10\.0\.2\.2/g, 'http://${localhost}');
    newContent = newContent.replace(/'http:\/\/\$\{localhost\}(.*?)'/g, '`http://${localhost}$1`');

    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed:', file);
  }
});
