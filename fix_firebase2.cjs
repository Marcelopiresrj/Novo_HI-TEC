const fs = require('fs');
let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

// Remove testConnection
content = content.replace(/\/\/ Connection test[\s\S]*testConnection\(\);/, '');

fs.writeFileSync('src/lib/firebase.ts', content);
