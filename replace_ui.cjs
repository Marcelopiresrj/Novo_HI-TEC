const fs = require('fs');
let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

content = content.replace(/<input\s+ref=\{fileInputRef\}\s+type="file"\s+accept="video\/\*,image\/\*"\s+onChange=\{[\s\S]*?className="hidden"\s+\/>/g, `<input
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
                />`);

content = content.replace(/className=\{\`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all \$\{\n\s*isDragging\n\s*\? 'border-cyan-400 bg-cyan-500\/10'\n\s*: fileUrl\n\s*\? 'border-emerald-500\/40 bg-emerald-500\/5'\n\s*: 'border-white\/10 hover:border-white\/20 hover:bg-white\/5'\n\s*\}\`\}\n\s*>\n\s*\{fileUrl \? \([\s\S]*?Clique para trocar\n\s*<\/p>\n\s*<\/div>\n\s*\) : \(/g, `className={\`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all \${
                      isDragging
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : mediaItems.length > 0
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }\`}
                  >
                    {mediaItems.length > 0 ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          {mediaItems[0].type === 'video' ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                        </div>
                        {mediaItems.length > 0 && (
                          <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-white/10 relative">
                            {mediaItems[0].type === 'video' ? (
                              <>
                                <video src={mediaItems[0].url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <Play className="w-6 h-6 text-white" />
                                </div>
                              </>
                            ) : (
                              <img src={mediaItems[0].url} alt="Preview" className="w-full h-full object-cover" />
                            )}
                            {mediaItems.length > 1 && (
                                <div className="absolute top-1 right-1 bg-black/70 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white">
                                  +{mediaItems.length - 1}
                                </div>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-emerald-400 font-semibold">
                          ✓ {mediaItems.length} {mediaItems.length > 1 ? 'arquivos carregados' : 'arquivo carregado'}! Clique para trocar
                        </p>
                      </div>
                    ) : (`);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
