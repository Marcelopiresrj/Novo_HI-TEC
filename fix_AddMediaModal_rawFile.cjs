const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/whatsappMessage: \`Olá Hi-Tech! Vi a publicação "\\\$\\{title\.trim\(\)\\}" no BioSite e gostaria de mais informações!\`,/g, 
  "whatsappMessage: `Olá Hi-Tech! Vi a publicação \\\"${title.trim()}\\\" no BioSite e gostaria de mais informações!`,\n      rawFile: (item as any).file,");

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
