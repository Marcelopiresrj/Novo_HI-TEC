const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('saveMediaChunks')) {
  content = content.replace(
    /import \{ getFirebaseStoreSettings, getFirebasePosts, saveFirebasePost, deleteFirebasePost \} from '.\/lib\/firebaseStore';/,
    `import { getFirebaseStoreSettings, getFirebasePosts, saveFirebasePost, deleteFirebasePost } from './lib/firebaseStore';\nimport { saveMediaChunks, loadMediaChunks } from './lib/chunkStorage';`
  );
}

// Replace getFirebasePosts call inside useEffect
content = content.replace(/const dbPosts = await getFirebasePosts\(\);\n\s*if \(\!dbPosts \|\| dbPosts\.length === 0\) \{/g, `const dbPosts = await getFirebasePosts();
        
        // Resolve chunked media URLs
        const resolvedPosts = await Promise.all(dbPosts.map(async (post) => {
          if (post.mediaUrl && post.mediaUrl.startsWith('chunked://')) {
            const blobUrl = await loadMediaChunks(post.id);
            if (blobUrl) {
               return { 
                 ...post, 
                 mediaUrl: blobUrl, 
                 thumbnailUrl: post.type === 'photo' ? blobUrl : (post.thumbnailUrl.startsWith('blob:') ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop' : post.thumbnailUrl)
               };
            }
          }
          return post;
        }));
        
        if (!resolvedPosts || resolvedPosts.length === 0) {`);
        
content = content.replace(/const combined = \[\.\.\.dbPosts, \.\.\.INSTAGRAM_POSTS\];/g, `const combined = [...resolvedPosts, ...INSTAGRAM_POSTS];`);

// Replace handleAddPost
content = content.replace(/const handleAddPost = async \([\s\S]*?showToast\('Erro ao salvar no servidor\.'\);\n\s*\}\n\s*\};/g, `const handleAddPost = async (newPosts: InstagramPost | InstagramPost[]) => {
    if (!isAdmin) {
      showToast('Apenas administradores podem publicar mídias.');
      return;
    }
    
    const postsArray = Array.isArray(newPosts) ? newPosts : [newPosts];
    showToast(\`Processando e salvando \${postsArray.length} arquivo(s) no servidor...\`);
    
    const postsToSave: InstagramPost[] = [];
    
    for (let i = 0; i < postsArray.length; i++) {
        const p = postsArray[i];
        let mediaUrl = p.mediaUrl;
        
        if (p.rawFile) {
            try {
               mediaUrl = await saveMediaChunks(p.id, p.rawFile);
            } catch(e) {
               console.error("Failed to chunk file", e);
            }
        }
        
        postsToSave.push({
           ...p,
           mediaUrl,
           rawFile: undefined,
           createdAt: new Date(Date.now() + i * 1000).toISOString()
        });
    }

    setPosts(prev => {
      const updated = [...postsToSave, ...prev];
      const unique = Array.from(new Map(updated.map(p => [p.id, p])).values());
      return unique.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    });

    try {
      await Promise.all(postsToSave.map(p => saveFirebasePost(p)));
      showToast('Upload concluído com sucesso!');
    } catch (err) {
      console.error('Error saving posts to Firebase', err);
      showToast('Erro ao salvar no servidor.');
    }
  };`);

fs.writeFileSync('src/App.tsx', content);
