const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/const handleFile = \(file: File\) => \{[\s\S]*?onClose\(\);\n  \};/g, `  const handleFiles = (files: FileList | File[]) => {
    setError(null);
    const newItems: {url: string, type: 'video'|'photo', thumbnail: string}[] = [];

    for (let i = 0; i < files.length; i++) {
       const file = files[i];
       const isVideo = file.type.startsWith('video/');
       const isImage = file.type.startsWith('image/');
       if (!isVideo && !isImage) continue;

       const objectUrl = URL.createObjectURL(file);
       newItems.push({
         url: objectUrl,
         type: isVideo ? 'video' : 'photo',
         thumbnail: isImage ? objectUrl : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop'
       });
    }

    if (newItems.length === 0) {
      setError('Por favor selecione arquivos de vídeo (MP4) ou imagem (JPG, PNG).');
      return;
    }
    setMediaItems(newItems);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Por favor, informe o título da postagem.');
      return;
    }

    const itemsToSubmit = uploadMode === 'url' 
      ? (fileUrl.trim() ? [{ url: fileUrl.trim(), type: mediaType, thumbnail: thumbnailUrl.trim() || fileUrl.trim() }] : [])
      : mediaItems;

    if (itemsToSubmit.length === 0) {
      setError('Por favor, envie ao menos um arquivo ou informe uma URL válida.');
      return;
    }

    const categoryLabels = {
      reels: 'Reels / Vídeo',
      smartphones: 'Smartphones 📱',
      acessorios: 'Acessórios 🎧',
      assistencia: 'Assistência 🛠️',
    };

    const newPosts = itemsToSubmit.map((item, idx) => ({
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
    }));

    onAddPost(newPosts as any);
    onShowToast(\`\${newPosts.length} \${newPosts.length > 1 ? 'mídias adicionadas' : 'mídia adicionada'} com sucesso!\`);
    onClose();
  };`);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
