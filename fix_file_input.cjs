const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/handleFiles\(e\.target\.files\);\s*\}/g, "handleFiles(e.target.files);\n                    }\n                    e.target.value = '';");

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
