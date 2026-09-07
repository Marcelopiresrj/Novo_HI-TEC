const fs = require('fs');
let content = fs.readFileSync('src/components/InstagramFeedSection.tsx', 'utf-8');

const regex = /\{onOpenAddMedia && \([\s\S]*?<\/button>\s*\)\}/;
content = content.replace(regex, '');

fs.writeFileSync('src/components/InstagramFeedSection.tsx', content);
