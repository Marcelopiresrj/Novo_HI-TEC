const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const globalXhr = require('xhr2');
global.XMLHttpRequest = globalXhr;

const firebaseConfig = {
  "projectId": "gen-lang-client-0289411556",
  "appId": "1:679156091918:web:83436ed3f0b24a51b0405f",
  "apiKey": "AIzaSyCOHyJrA9Psmgc_eWBcLDhRXu05085W3fI",
  "authDomain": "gen-lang-client-0289411556.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-hitecheletrnicos-8a50b10c-5821-41c8-934b-fdd404b8c918",
  "storageBucket": "gen-lang-client-0289411556.firebasestorage.app",
  "messagingSenderId": "679156091918"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  try {
    const snapshot = await getDocs(collection(db, 'posts'));
    console.log("Total posts in DB:", snapshot.size);
    snapshot.docs.forEach(d => {
      const data = d.data();
      console.log("- ", data.title, data.createdAt);
    });
  } catch (e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
check();
