const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf-8');

const newRule = `
    match /media_chunks/{chunkId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}`;

content = content.replace(/  \}\n\}/, newRule);

fs.writeFileSync('firestore.rules', content);
