const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf-8');

content = content.replace(/data\.mediaUrl is string && data\.mediaUrl\.size\(\) <= 1000/g, "data.mediaUrl is string && data.mediaUrl.size() <= 2000000");
content = content.replace(/data\.thumbnailUrl is string && data\.thumbnailUrl\.size\(\) <= 1000/g, "data.thumbnailUrl is string && data.thumbnailUrl.size() <= 2000000");

fs.writeFileSync('firestore.rules', content);
