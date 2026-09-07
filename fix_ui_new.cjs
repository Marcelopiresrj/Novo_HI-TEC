const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

const targetStr = `
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={\`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all \${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : fileUrl
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }\`}
                >
                  {fileUrl ? (
                    <div className="space-y-2">
                      <div className="w-full max-h-40 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                        {mediaType === 'video' ? (
                          <video
                            src={fileUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="max-h-36 object-contain"
                          />
                        ) : (
                          <img
                            src={fileUrl}
                            alt="Preview"
                            className="max-h-36 object-contain"
                          />
                        )}
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold">
                        ✓ Arquivo carregado! Clique para trocar
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-white">
                        Arraste e solte seu vídeo ou foto aqui
                      </p>
                      <p className="text-[11px] text-slate-400">
                        ou clique para selecionar do seu aparelho
                      </p>
                    </div>
                  )}
                </div>
`;

const replacementStr = `
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
`;

// Also clean up the warning block that the user disliked
const warningStr = `
                <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-400">Atenção:</strong> Arquivos enviados por aqui ficam salvos apenas no seu dispositivo (temporariamente). Para que todos os seus clientes consigam ver as mídias permanentemente, prefira usar a opção <strong className="text-white">"Link / URL"</strong>.
                  </p>
                </div>
`;

// Remove whitespaces to avoid mismatch
function collapseSpaces(str) {
  return str.replace(/\s+/g, ' ');
}

let modified = content;
if (collapseSpaces(modified).includes(collapseSpaces(warningStr))) {
  // It's a bit tricky to replace exact strings with whitespace variations, so let's use regex
  modified = modified.replace(/<div className="mb-3 p-3 bg-amber-500\/10[^>]*>[\s\S]*?<\/div>/, '');
}

// Let's just rewrite the entire `uploadMode === 'file' ? (...) : (...)` block with regex
// Because regex over large blocks of JSX can fail, we will use a more robust script

fs.writeFileSync('src/components/AddMediaModal.tsx', modified);
