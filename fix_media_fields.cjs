const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

// The line is:
// views: item.type === 'video' ? '1 visualização' : undefined,
// duration: item.type === 'video' ? '0:15' : undefined,
// badge: badge.trim() || undefined,
// price: price.trim() || undefined,

content = content.replace("views: item.type === 'video' ? '1 visualização' : undefined,", "views: item.type === 'video' ? '1 visualização' : null,");
content = content.replace("duration: item.type === 'video' ? '0:15' : undefined,", "duration: item.type === 'video' ? '0:15' : null,");
content = content.replace("badge: badge.trim() || undefined,", "badge: badge.trim() || null,");
content = content.replace("price: price.trim() || undefined,", "price: price.trim() || null,");

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
