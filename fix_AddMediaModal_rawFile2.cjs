const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/whatsappMessage:.*?`,/g, 
  "$& \n      rawFile: (item as any).file,");

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
