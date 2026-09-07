const fs = require('fs');
let content = fs.readFileSync('src/lib/chunkStorage.ts', 'utf-8');

// Change the small file limit
content = content.replace(/if \(file\.size < 800 \* 1024\)/g, "if (file.size < 400 * 1024)");
// Change the chunk size
content = content.replace(/const chunkSize = 800 \* 1024;/g, "const chunkSize = 500 * 1024;");

fs.writeFileSync('src/lib/chunkStorage.ts', content);
