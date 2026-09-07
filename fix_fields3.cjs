const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

const regex = /const newPosts = itemsToSubmit\.map\(\(item, idx\) => \(\{[\s\S]*?rawFile: \(item as any\)\.file,\s*\}\)\);/m;

const replacement = `const newPosts = itemsToSubmit.map((item, idx) => {
      const p: any = {
        id: \`post-\${Date.now()}-\${idx}\`,
        type: item.type,
        title: title.trim(),
        category,
        categoryLabel: categoryLabels[category as keyof typeof categoryLabels],
        mediaUrl: item.url,
        thumbnailUrl: item.thumbnail,
        likes: '1',
        caption: caption.trim() || \`Confira essa novidade na Hi-Tech Eletrônicos!\`,
        instagramUrl: INSTAGRAM_URL,
        whatsappMessage: \`Olá Hi-Tech! Vi a publicação "\${title.trim()}" no BioSite e gostaria de mais informações!\`,
        rawFile: (item as any).file,
      };
      if (item.type === 'video') {
        p.views = '1 visualização';
        p.duration = '0:15';
      }
      if (badge.trim()) p.badge = badge.trim();
      if (price.trim()) p.price = price.trim();
      return p;
    });`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/AddMediaModal.tsx', content);
