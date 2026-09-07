const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

const effectCode = `
  React.useEffect(() => {
    if (isOpen) {
      setMediaType('video');
      setUploadMode('file');
      setMediaItems([]);
      setFileUrl('');
      setThumbnailUrl('');
      setTitle('');
      setCategory('reels');
      setPrice('');
      setCaption('');
      setBadge('🔥 Novo');
      setError(null);
    }
  }, [isOpen]);
`;

// Insert the effect after the state declarations
const searchString = "const fileInputRef = useRef<HTMLInputElement | null>(null);";
content = content.replace(searchString, searchString + effectCode);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
