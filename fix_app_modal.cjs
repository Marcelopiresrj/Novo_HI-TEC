const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  '<AdminStoreSettingsModal\\s*\\n\\s*isOpen=\\{isStoreSettingsOpen\\}',
  '<AdminStoreSettingsModal\\n          isOpen={isStoreSettingsOpen}\\n          initialSettings={storeSettings}'
);

fs.writeFileSync('src/App.tsx', content);
