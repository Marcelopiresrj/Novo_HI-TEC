const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/postsToSave\.push\(\{[\s\S]*?rawFile: undefined,\n\s*createdAt: new Date\(Date.now\(\) \+ i \* 1000\)\.toISOString\(\)\n\s*\}\);/g, `
        let finalThumbnailUrl = p.thumbnailUrl;
        if (p.type === 'photo') {
           finalThumbnailUrl = mediaUrl; // Both will be base64 or chunked://
        } else {
           finalThumbnailUrl = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop';
        }

        postsToSave.push({
           ...p,
           mediaUrl,
           thumbnailUrl: finalThumbnailUrl,
           rawFile: undefined,
           createdAt: new Date(Date.now() + i * 1000).toISOString()
        });`);

fs.writeFileSync('src/App.tsx', content);
