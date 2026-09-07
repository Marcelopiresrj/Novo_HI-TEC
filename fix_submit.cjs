const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/price: price\.trim\(\) \|\| undefined,\n\s*instagramUrl: INSTAGRAM_URL,\n\s*whatsappMessage: \`Olá Hi-Tech! Vi a publicação "\\\$\{title.trim\(\)\}" no BioSite e gostaria de mais informações!\`,\n\s*\}\)\);/g, `price: price.trim() || undefined,
      instagramUrl: INSTAGRAM_URL,
      whatsappMessage: \`Olá Hi-Tech! Vi a publicação "\${title.trim()}" no BioSite e gostaria de mais informações!\`,
      rawFile: (item as any).file,
    }));`);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
