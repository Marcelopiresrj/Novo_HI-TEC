const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldCode = `            const postToSave = {
               ...p,
               mediaUrl,
               thumbnailUrl: finalThumbnailUrl,
               rawFile: undefined
            };
            
            await saveFirebasePost(postToSave);`;

const newCode = `            const postToSave = {
               ...p,
               mediaUrl,
               thumbnailUrl: finalThumbnailUrl
            };
            delete postToSave.rawFile;
            
            await saveFirebasePost(postToSave);`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', content);
