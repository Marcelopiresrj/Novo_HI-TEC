const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldModal = `<AdminStoreSettingsModal
          isOpen={isStoreSettingsOpen}
          onClose={() => setIsStoreSettingsOpen(false)}
          onSave={(newSettings) => {
            setStoreSettings(newSettings);
          }}
          onShowToast={showToast}
        />`;

const newModal = `<AdminStoreSettingsModal
          isOpen={isStoreSettingsOpen}
          initialSettings={storeSettings}
          onClose={() => setIsStoreSettingsOpen(false)}
          onSave={(newSettings) => {
            setStoreSettings(newSettings);
          }}
          onShowToast={showToast}
        />`;

content = content.replace(oldModal, newModal);
fs.writeFileSync('src/App.tsx', content);
