const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/const isVideo = file\.type\.startsWith\('video\/'\);\n\s*const isImage = file\.type\.startsWith\('image\/'\);/g, `
         const isVideo = file.type.startsWith('video/') || file.name.match(/\\.(mp4|mov|webm|avi|mkv)$/i) !== null;
         const isImage = file.type.startsWith('image/') || file.name.match(/\\.(jpg|jpeg|png|gif|webp)$/i) !== null;`);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
