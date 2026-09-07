const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadString, getDownloadURL } = require('firebase/storage');
global.XMLHttpRequest = require('xhr2'); // might be needed, or we can use node-fetch

const firebaseConfig = {  "projectId": "gen-lang-client-0289411556",  "appId": "1:679156091918:web:83436ed3f0b24a51b0405f",  "apiKey": "AIzaSyCOHyJrA9Psmgc_eWBcLDhRXu05085W3fI",  "authDomain": "gen-lang-client-0289411556.firebaseapp.com",  "firestoreDatabaseId": "ai-studio-hitecheletrnicos-8a50b10c-5821-41c8-934b-fdd404b8c918",  "storageBucket": "gen-lang-client-0289411556.firebasestorage.app",  "messagingSenderId": "679156091918"};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function test() {
  try {
    const r = ref(storage, 'test.txt');
    await uploadString(r, 'hello world');
    const url = await getDownloadURL(r);
    console.log("Success! URL:", url);
  } catch (e) {
    console.error("Storage Error:", e.message);
  }
  process.exit(0);
}
test();
