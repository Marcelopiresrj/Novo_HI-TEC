const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

const oldCheck = /const isVideo = file\.type\.startsWith\('video\/'\) \|\| file\.name\.match\(\/\\\\\.(\[mp4\|mov\|webm\|avi\|mkv\]\+)\$\/i\) !== null;\s*const isImage = file\.type\.startsWith\('image\/'\) \|\| file\.name\.match\(\/\\\\\.(\[jpg\|jpeg\|png\|gif\|webp\]\+)\$\/i\) !== null;\s*if \(!isVideo && !isImage\) continue;/g;

const betterCheck = `         let isVideo = file.type.startsWith('video/') || (file.name && file.name.match(/\\.(mp4|mov|webm|avi|mkv)$/i) !== null);
         let isImage = file.type.startsWith('image/') || (file.name && file.name.match(/\\.(jpg|jpeg|png|gif|webp|heic)$/i) !== null);
         
         // Se o sistema do celular não detectar o tipo, forçamos o tipo que o usuário escolheu no botão
         if (!isVideo && !isImage) {
            if (mediaType === 'video') isVideo = true;
            else isImage = true;
         }`;

// Since the regex might be hard to match due to newlines, let's use string replace:
content = content.replace("const isVideo = file.type.startsWith('video/') || file.name.match(/\\.(mp4|mov|webm|avi|mkv)$/i) !== null;", "");
content = content.replace("const isImage = file.type.startsWith('image/') || file.name.match(/\\.(jpg|jpeg|png|gif|webp)$/i) !== null;", "");
content = content.replace("if (!isVideo && !isImage) continue;", betterCheck);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
