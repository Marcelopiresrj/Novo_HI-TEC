const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('import { compressImage }')) {
  content = content.replace(
    `import { uploadMediaToSupabase } from './lib/supabaseStore';`,
    `import { uploadMediaToSupabase } from './lib/supabaseStore';\nimport { compressImage } from './utils/imageUtils';`
  );
  
  // also handle the case where it's imported differently
  content = content.replace(
    `import { getSupabaseStoreSettings, getSupabasePosts, saveSupabasePost, deleteSupabasePost, uploadMediaToSupabase } from './lib/supabaseStore';`,
    `import { getSupabaseStoreSettings, getSupabasePosts, saveSupabasePost, deleteSupabasePost, uploadMediaToSupabase } from './lib/supabaseStore';\nimport { compressImage } from './utils/imageUtils';`
  );
}

content = content.replace(
  `            if (p.rawFile) {
                mediaUrl = await uploadMediaToSupabase(p.id, p.rawFile);
            }`,
  `            if (p.rawFile) {
                let fileToUpload = p.rawFile;
                // Only compress images, not videos
                if (p.type === 'photo' && fileToUpload.type.startsWith('image/')) {
                  try {
                    fileToUpload = await compressImage(fileToUpload, 1920, 1080, 0.8);
                  } catch (e) {
                    console.error('Error compressing image:', e);
                  }
                }
                mediaUrl = await uploadMediaToSupabase(p.id, fileToUpload);
            }`
);

fs.writeFileSync('src/App.tsx', content);
