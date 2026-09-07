const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

// Change handleFiles signature to convert to array first thing
content = content.replace(
  "const handleFiles = (files: FileList | File[]) => {",
  "const handleFiles = (rawFiles: FileList | File[]) => {\n    const files = Array.from(rawFiles);"
);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
