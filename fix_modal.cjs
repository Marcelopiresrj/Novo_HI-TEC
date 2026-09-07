const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/const handleFiles = \([\s\S]*?setMediaItems\(newItems\);\n  \};/g, `const handleFiles = (files: FileList | File[]) => {
    setError(null);
    setMediaItems(prev => {
      const newItems = [];
      let currentVideos = prev.filter(p => p.type === 'video').length;
      let currentPhotos = prev.filter(p => p.type === 'photo').length;
      
      for (let i = 0; i < files.length; i++) {
         const file = files[i];
         const isVideo = file.type.startsWith('video/');
         const isImage = file.type.startsWith('image/');
         
         if (!isVideo && !isImage) continue;
         
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
         newItems.push({
           url: objectUrl,
           type: isVideo ? 'video' : 'photo',
           thumbnail: isImage ? objectUrl : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
           file: file // Save the file object for base64 conversion if needed
         });
      }
      
      if (newItems.length === 0 && !error) {
        setError('Por favor selecione arquivos de vídeo (MP4) ou imagem (JPG, PNG).');
        return prev;
      }
      
      return [...prev, ...newItems];
    });
  };`);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
