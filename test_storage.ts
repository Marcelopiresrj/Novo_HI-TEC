import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { firebaseConfig } from './src/lib/firebaseConfig';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const testRef = ref(storage, 'test.txt');

uploadString(testRef, 'hello world').then(() => {
  console.log('Upload successful');
  process.exit(0);
}).catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});
