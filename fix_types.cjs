const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');

content = content.replace(/whatsappMessage: string;\n  createdAt\?: string;\n\}/g, `whatsappMessage: string;\n  createdAt?: string;\n  rawFile?: File;\n}`);

fs.writeFileSync('src/types.ts', content);
