const fs = require('fs');
let content = fs.readFileSync('src/components/AdminStoreSettingsModal.tsx', 'utf-8');

// Replace settings. property accesses with optional chaining
content = content.replace(/settings\./g, '(settings || {}).');

fs.writeFileSync('src/components/AdminStoreSettingsModal.tsx', content);
