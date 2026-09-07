const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

// The line is currently `null` because of the previous replacement. 
content = content.replace("views: item.type === 'video' ? '1 visualização' : null,", "views: item.type === 'video' ? '1 visualização' : undefined,");
content = content.replace("duration: item.type === 'video' ? '0:15' : null,", "duration: item.type === 'video' ? '0:15' : undefined,");
content = content.replace("badge: badge.trim() || null,", "badge: badge.trim() || undefined,");
content = content.replace("price: price.trim() || null,", "price: price.trim() || undefined,");

const oldCode = `    const newPosts = itemsToSubmit.map((item, idx) => ({
      id: \`post-\${Date.now()}-\${idx}\`,
      type: item.type,
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      mediaUrl: item.url,
      thumbnailUrl: item.thumbnail,
      likes: '1',
      views: item.type === 'video' ? '1 visualização' : undefined,
      duration: item.type === 'video' ? '0:15' : undefined,
      caption: caption.trim() || \`Confira essa novidade na Hi-Tech Eletrônicos!\`,
      badge: badge.trim() || undefined,
      price: price.trim() || undefined,
      instagramUrl: INSTAGRAM_URL,
      whatsappMessage: \`Olá Hi-Tech! Vi a publicação "\${title.trim()}" no BioSite e gostaria de mais informações!\`,
      rawFile: (item as any).file,
    }));`;

const newCode = `    const newPosts = itemsToSubmit.map((item, idx) => {
      const p = {
        id: \`post-\${Date.now()}-\${idx}\`,
        type: item.type,
        title: title.trim(),
        category,
        categoryLabel: categoryLabels[category],
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

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/components/AddMediaModal.tsx', content);
