const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

// Add import for generateVideoThumbnail
if (!content.includes('generateVideoThumbnail')) {
  content = content.replace(
    "import { INSTAGRAM_URL } from '../data/instagramData';",
    "import { INSTAGRAM_URL } from '../data/instagramData';\nimport { generateVideoThumbnail } from '../utils/videoUtils';"
  );
}

const oldHandleFiles = /const handleFiles = \(rawFiles: FileList \| File\[\]\) => \{[\s\S]*?return \[\.\.\.prev, \.\.\.newItems\];\n    \}\);\n  \};/;

const newHandleFiles = `const handleFiles = async (rawFiles: FileList | File[]) => {
    const files = Array.from(rawFiles);
    setError(null);
    
    // Pegar o estado atual para verificação de limites
    let currentVideos = mediaItems.filter(p => p.type === 'video').length;
    let currentPhotos = mediaItems.filter(p => p.type === 'photo').length;
    
    const newItems = [];
    
    for (let i = 0; i < files.length; i++) {
       const file = files[i];
       
       let isVideo = (file.type && file.type.startsWith('video/')) || (file.name && file.name.match(/\\.(mp4|mov|webm|avi|mkv)$/i) !== null);
       let isImage = (file.type && file.type.startsWith('image/')) || (file.name && file.name.match(/\\.(jpg|jpeg|png|gif|webp|heic)$/i) !== null);
       
       if (!isVideo && !isImage) {
          if (mediaType === 'video') isVideo = true;
          else isImage = true;
       }
       
       if (isVideo) {
         if (currentVideos >= 5) {
           setError('Limite de 5 vídeos atingido.');
           continue;
         }
         currentVideos++;
       }
       
       if (isImage) {
         if (currentPhotos >= 10) {
           setError('Limite de 10 fotos atingido.');
           continue;
         }
         currentPhotos++;
       }
       
       const objectUrl = URL.createObjectURL(file);
       let thumbnail = objectUrl;
       
       if (isVideo) {
         try {
           const generatedThumb = await generateVideoThumbnail(file);
           if (generatedThumb) {
             thumbnail = generatedThumb;
           } else {
             thumbnail = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop';
           }
         } catch (e) {
           thumbnail = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop';
         }
       }
       
       newItems.push({
         url: objectUrl,
         type: isVideo ? 'video' : 'photo',
         thumbnail: thumbnail,
         file: file
       });
    }
    
    if (newItems.length === 0 && !error) {
      setError('Por favor selecione arquivos de vídeo (MP4) ou imagem (JPG, PNG).');
      return;
    }
    
    setMediaItems(prev => [...prev, ...newItems]);
  };`;

content = content.replace(oldHandleFiles, newHandleFiles);
fs.writeFileSync('src/components/AddMediaModal.tsx', content);
