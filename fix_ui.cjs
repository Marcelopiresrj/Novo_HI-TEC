const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/\{uploadMode === 'file' \? \([\s\S]*?<div className="space-y-4">/g, `{uploadMode === 'file' ? (
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
                  }}
                  className="hidden"
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={\`border-2 border-dashed rounded-2xl p-4 text-center transition-all \${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : mediaItems.length > 0
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-white/10 hover:border-white/20 bg-white/5 cursor-pointer'
                  }\`}
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
                           <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 group">
                             {item.type === 'video' ? (
                               <video src={item.url} className="w-full h-full object-cover" />
                             ) : (
                               <img src={item.url} alt="preview" className="w-full h-full object-cover" />
                             )}
                             <button 
                               type="button"
                               className="remove-btn absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-500 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
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
                      <p className="text-xs text-emerald-400 font-semibold">
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
              <div className="space-y-4">`);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
