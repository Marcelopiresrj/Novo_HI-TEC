const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const postsToSave: InstagramPost\[\] = \[\];\s*for \(let i = 0; i < postsArray\.length; i\+\+\) \{[\s\S]*?showToast\('Erro ao salvar no servidor\.'\);\n\s*\}/;

const replacement = `const postsToSave: InstagramPost[] = [];
    
    // 1. Optimistic Update (Show instantly in UI with local blob URLs)
    const optimisticPosts = postsArray.map((p, i) => ({
       ...p,
       createdAt: new Date(Date.now() + i * 1000).toISOString()
    }));
    
    setPosts(prev => {
      const updated = [...optimisticPosts, ...prev];
      const unique = Array.from(new Map(updated.map(p => [p.id, p])).values());
      return unique.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    });

    // 2. Background Upload
    try {
        for (let i = 0; i < optimisticPosts.length; i++) {
            const p = optimisticPosts[i];
            let mediaUrl = p.mediaUrl;
            
            if (p.rawFile) {
                try {
                   mediaUrl = await saveMediaChunks(p.id, p.rawFile);
                } catch(e) {
                   console.error("Failed to chunk file", e);
                }
            }
            
            let finalThumbnailUrl = p.thumbnailUrl;
            if (p.type === 'photo') {
               finalThumbnailUrl = mediaUrl; 
            } else if (!finalThumbnailUrl || finalThumbnailUrl.startsWith('blob:')) {
               finalThumbnailUrl = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop';
            }

            const postToSave = {
               ...p,
               mediaUrl,
               thumbnailUrl: finalThumbnailUrl,
               rawFile: undefined
            };
            
            await saveFirebasePost(postToSave);
        }
        showToast('Upload concluído com sucesso!');
    } catch (err) {
        console.error('Error saving posts to Firebase', err);
        showToast('Erro ao salvar no servidor.');
    }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
