const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const globalXhr = require('xhr2');
global.XMLHttpRequest = globalXhr;

const firebaseConfig = {
  projectId: "gen-lang-client-0289411556",
  firestoreDatabaseId: "ai-studio-hitecheletrnicos-8a50b10c-5821-41c8-934b-fdd404b8c918"
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
