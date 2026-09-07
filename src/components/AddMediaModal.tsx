import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Video, Image as ImageIcon, Sparkles, AlertCircle, Play } from 'lucide-react';
import { InstagramPost } from '../types';
import { INSTAGRAM_URL } from '../data/instagramData';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: InstagramPost | InstagramPost[]) => void;
  onShowToast: (msg: string) => void;
}

export const AddMediaModal: React.FC<AddMediaModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  onShowToast,
}) => {
  const [mediaType, setMediaType] = useState<'video' | 'photo'>('video');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [mediaItems, setMediaItems] = useState<{url: string, type: 'video'|'photo', thumbnail: string}[]>([]);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<'reels' | 'smartphones' | 'acessorios' | 'assistencia'>('reels');
  const [price, setPrice] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [badge, setBadge] = useState<string>('🔥 Novo');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
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


  if (!isOpen) return null;

    const handleFiles = (files: FileList | File[]) => {
    setError(null);
    setMediaItems(prev => {
      const newItems = [];
      let currentVideos = prev.filter(p => p.type === 'video').length;
      let currentPhotos = prev.filter(p => p.type === 'photo').length;
      
      for (let i = 0; i < files.length; i++) {
         const file = files[i];
         
         
         
         
                  let isVideo = file.type.startsWith('video/') || (file.name && file.name.match(/\.(mp4|mov|webm|avi|mkv)$/i) !== null);
         let isImage = file.type.startsWith('image/') || (file.name && file.name.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i) !== null);
         
         // Se o sistema do celular não detectar o tipo, forçamos o tipo que o usuário escolheu no botão
         if (!isVideo && !isImage) {
            if (mediaType === 'video') isVideo = true;
            else isImage = true;
         }
         
         if (isVideo) {
           if (currentVideos >= 5) {
             setError('Limite de 5 vídeos atingido.');
             continue;
           }
           currentVideos++;
         }
         
         if (isImage) {
           if (currentPhotos >= 10) {
             setError('Limite de 10 fotos atingido.');
             continue;
           }
           currentPhotos++;
         }
         
         const objectUrl = URL.createObjectURL(file);
         newItems.push({
           url: objectUrl,
           type: isVideo ? 'video' : 'photo',
           thumbnail: isImage ? objectUrl : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
           file: file // Save the file object for base64 conversion if needed
         });
      }
      
      if (newItems.length === 0 && !error) {
        setError('Por favor selecione arquivos de vídeo (MP4) ou imagem (JPG, PNG).');
        return prev;
      }
      
      return [...prev, ...newItems];
    });
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
      id: `post-${Date.now()}-${idx}`,
      type: item.type,
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category],
      mediaUrl: item.url,
      thumbnailUrl: item.thumbnail,
      likes: '1',
      views: item.type === 'video' ? '1 visualização' : undefined,
      duration: item.type === 'video' ? '0:15' : undefined,
      caption: caption.trim() || `Confira essa novidade na Hi-Tech Eletrônicos!`,
      badge: badge.trim() || undefined,
      price: price.trim() || undefined,
      instagramUrl: INSTAGRAM_URL,
      whatsappMessage: `Olá Hi-Tech! Vi a publicação "${title.trim()}" no BioSite e gostaria de mais informações!`, 
      rawFile: (item as any).file,
    }));

    onAddPost(newPosts as any);
    onShowToast(`${newPosts.length} ${newPosts.length > 1 ? 'mídias adicionadas' : 'mídia adicionada'} com sucesso!`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        id="add-media-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          id="add-media-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#0F172A] border border-[#1E293B] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white font-['Outfit']">
                  Adicionar Vídeo ou Foto
                </h3>
                <p className="text-xs text-slate-400">
                  Faça upload do seu arquivo para exibir no carrossel
                </p>
              </div>
            </div>

            <button
              id="close-add-media-btn"
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Media Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  mediaType === 'video'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Vídeo / Reels</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  mediaType === 'photo'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-600/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/5'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Foto do Produto</span>
              </button>
            </div>

            {/* Upload Mode: File vs URL */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">Origem da mídia:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    uploadMode === 'file'
                      ? 'bg-white/15 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Upload do Arquivo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    uploadMode === 'url'
                      ? 'bg-white/15 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Link / URL
                </button>
              </div>
            </div>

            {/* Drop Zone or URL Input */}
            {uploadMode === 'file' ? (
              <div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFiles(e.target.files);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : mediaItems.length > 0
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-white/10 hover:border-white/20 bg-white/5 cursor-pointer'
                  }`}
                  onClick={(e) => {
                     // Only trigger click if we aren't clicking a remove button
                     if ((e.target as HTMLElement).closest('.remove-btn')) return;
                     fileInputRef.current?.click();
                  }}
                >
                  {mediaItems.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {mediaItems.map((item, idx) => (
                           <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 group cursor-default">
                             {item.type === 'video' ? (
                               <video src={item.url} className="w-full h-full object-cover" />
                             ) : (
                               <img src={item.url} alt="preview" className="w-full h-full object-cover" />
                             )}
                             <button 
                               type="button"
                               className="remove-btn absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-500 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                               onClick={(e) => {
                                  e.stopPropagation();
                                  setMediaItems(prev => prev.filter((_, i) => i !== idx));
                               }}
                             >
                               <X className="w-3 h-3" />
                             </button>
                             {item.type === 'video' && (
                               <div className="absolute bottom-1 right-1 bg-black/60 rounded px-1 flex items-center">
                                 <Video className="w-3 h-3 text-white" />
                               </div>
                             )}
                           </div>
                        ))}
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold cursor-pointer">
                        ✓ {mediaItems.length} arquivo(s) selecionado(s). Clique para adicionar mais.
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-white">
                        Arraste vídeos/fotos ou clique aqui
                      </p>
                      <p className="text-[10px] text-slate-400">
                        MP4, WebM, JPG, PNG (Max: 5 vídeos, 10 fotos)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">
                  URL da Mídia (Vídeo MP4 ou Imagem JPG/PNG)
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/meu-video.mp4"
                  value={fileUrl}
                  onChange={(e) => {
                    setFileUrl(e.target.value);
                    if (mediaType === 'photo') setThumbnailUrl(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {/* Post Title */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">
                Título do Produto ou Post *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: iPhone 16 Pro Max Titânio ou Capinhas Novas"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Category & Badge */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="reels">Vídeos / Reels</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="acessorios">Acessórios</option>
                  <option value="assistencia">Assistência</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">
                  Etiqueta / Badge
                </label>
                <input
                  type="text"
                  placeholder="Ex: 🔥 Lançamento ou 12x"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Price / Offer */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">
                Preço ou Condição Especial (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: R$ 4.990 ou Em até 12x no Cartão"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Caption */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold block">
                Legenda / Descrição
              </label>
              <textarea
                rows={2}
                placeholder="Descreva o produto, benefícios, garantia e pronta entrega..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#1E293B]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="submit-new-media-btn"
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-[#0B0F17] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-[#0B0F17]" />
                <span>Salvar Post</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
