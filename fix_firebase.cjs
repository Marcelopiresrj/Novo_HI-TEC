const fs = require('fs');
let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

content = content.replace(
  "import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';",
  "import { getFirestore, initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';"
);

content = content.replace(
  "export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);",
  "export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId);"
);

fs.writeFileSync('src/lib/firebase.ts', content);
