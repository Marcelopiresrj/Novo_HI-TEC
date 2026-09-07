const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/getFirebasePosts\(\)\.then\(fetchedPosts => \{[\s\S]*?\}\);/g, `getFirebasePosts().then(async fetchedPosts => {
      // Resolve chunked media URLs
      const resolvedPosts = await Promise.all(fetchedPosts.map(async (post) => {
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

      // Mesclar posts do Firebase com posts originais predefinidos
      const allPosts = [...resolvedPosts, ...INSTAGRAM_POSTS];
      
      const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());
      setPosts(uniquePosts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }));
    });`);

fs.writeFileSync('src/App.tsx', content);
