import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export async function saveMediaChunks(postId: string, file: File): Promise<string> {
  // If it's a small file, just return base64
  if (file.size < 800 * 1024) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  // Large file: chunk it
  const chunkSize = 800 * 1024; // 800 KB
  const totalChunks = Math.ceil(file.size / chunkSize);
  const buffer = await file.arrayBuffer();

  for (let i = 0; i < totalChunks; i++) {
    const chunk = buffer.slice(i * chunkSize, (i + 1) * chunkSize);
    const bytes = new Uint8Array(chunk);
    let binary = '';
    for (let j = 0; j < bytes.byteLength; j++) {
      binary += String.fromCharCode(bytes[j]);
    }
    const base64 = window.btoa(binary);

    const chunkDocRef = doc(db, 'media_chunks', `${postId}_chunk_${i}`);
    await setDoc(chunkDocRef, {
      postId,
      index: i,
      total: totalChunks,
      type: file.type,
      data: base64
    });
  }

  return `chunked://${postId}`;
}

export async function loadMediaChunks(postId: string): Promise<string | null> {
  try {
    const q = query(collection(db, 'media_chunks'), where('postId', '==', postId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;

    const chunks = snapshot.docs.map(d => d.data());
    chunks.sort((a, b) => a.index - b.index);

    const type = chunks[0].type;
    const byteArrays = chunks.map(chunk => {
      const binaryString = window.atob(chunk.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    });

    const blob = new Blob(byteArrays, { type });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("Failed to load chunks", err);
    return null;
  }
}
