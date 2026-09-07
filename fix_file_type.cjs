const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(
  "let isVideo = file.type.startsWith('video/') || (file.name && file.name.match(/\\.(mp4|mov|webm|avi|mkv)$/i) !== null);",
  "let isVideo = (file.type && file.type.startsWith('video/')) || (file.name && file.name.match(/\\.(mp4|mov|webm|avi|mkv)$/i) !== null);"
);

content = content.replace(
  "let isImage = file.type.startsWith('image/') || (file.name && file.name.match(/\\.(jpg|jpeg|png|gif|webp|heic)$/i) !== null);",
  "let isImage = (file.type && file.type.startsWith('image/')) || (file.name && file.name.match(/\\.(jpg|jpeg|png|gif|webp|heic)$/i) !== null);"
);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
