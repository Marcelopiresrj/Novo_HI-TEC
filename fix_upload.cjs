const fs = require('fs');

let content = fs.readFileSync('src/components/AddMediaModal.tsx', 'utf-8');

// 1. Add cameraInputRef
content = content.replace(
  `  const fileInputRef = useRef<HTMLInputElement | null>(null);`,
  `  const fileInputRef = useRef<HTMLInputElement | null>(null);\n  const cameraInputRef = useRef<HTMLInputElement | null>(null);`
);

// 2. Add the camera input right after the file input
content = content.replace(
  `                <input
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
                />`,
  `                <input
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
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="video/*,image/*"
                  capture="environment"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFiles(e.target.files);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />`
);

// 3. Update the dropzone area text and buttons for empty state
content = content.replace(
  `                  onClick={(e) => {
                     // Only trigger click if we aren't clicking a remove button
                     if ((e.target as HTMLElement).closest('.remove-btn')) return;
                     fileInputRef.current?.click();
                  }}
                >
                  {mediaItems.length > 0 ? (`,
  `                  onClick={(e) => {
                     // Only trigger click if we aren't clicking a remove button or a specific action button
                     if ((e.target as HTMLElement).closest('.remove-btn') || (e.target as HTMLElement).closest('.action-btn')) return;
                     fileInputRef.current?.click();
                  }}
                >
                  {mediaItems.length > 0 ? (`
);

content = content.replace(
  `                  ) : (
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
                  )}`,
  `                  ) : (
                    <div className="py-4 space-y-3">
                      <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-2 w-full max-w-[200px] mx-auto">
                        <button
                          type="button"
                          className="action-btn w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-3.5 h-3.5" /> Galeria / Arquivos
                        </button>
                        <button
                          type="button"
                          className="action-btn w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-xs font-semibold text-cyan-300 transition-colors flex items-center justify-center gap-2"
                          onClick={() => cameraInputRef.current?.click()}
                        >
                          <Video className="w-3.5 h-3.5" /> Câmera (Celular)
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 pt-2">
                        MP4, WebM, JPG, PNG (Max: 5 vídeos, 10 fotos)
                      </p>
                    </div>
                  )}`
);

fs.writeFileSync('src/components/AddMediaModal.tsx', content);
