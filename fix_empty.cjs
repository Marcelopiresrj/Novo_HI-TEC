const fs = require('fs');

// Desktop
let desk = fs.readFileSync('src/components/DesktopInstagramPanel.tsx', 'utf-8');
const deskMapRegex = /\{filteredPosts\.map\(\(post, idx\) => \{/;
if (!desk.includes("Nenhuma mídia")) {
  desk = desk.replace(deskMapRegex, `
        {filteredPosts.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-3">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-white font-semibold mb-1">Nenhuma mídia encontrada</h3>
            <p className="text-sm text-slate-400">As fotos e vídeos que você postar aparecerão aqui.</p>
          </div>
        )}
        {filteredPosts.map((post, idx) => {`);
  // Import Camera
  desk = desk.replace(/import { Play, Heart, MessageCircle, ExternalLink, Image as ImageIcon, Plus, Lock, Settings } from 'lucide-react';/, "import { Play, Heart, MessageCircle, ExternalLink, Image as ImageIcon, Plus, Lock, Settings, Camera } from 'lucide-react';");
  fs.writeFileSync('src/components/DesktopInstagramPanel.tsx', desk);
}

// Mobile
let mob = fs.readFileSync('src/components/InstagramFeedSection.tsx', 'utf-8');
const mobMapRegex = /\{filteredPosts\.map\(\(post, idx\) => \{/;
if (!mob.includes("Nenhuma mídia")) {
  mob = mob.replace(mobMapRegex, `
        {filteredPosts.length === 0 && (
          <div className="w-full py-8 flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-2">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold text-sm">Nenhuma mídia encontrada</h3>
            <p className="text-xs text-slate-400">Seus posts aparecerão aqui.</p>
          </div>
        )}
        {filteredPosts.map((post, idx) => {`);
  mob = mob.replace(/import { Play, Heart, MessageCircle, ExternalLink, Image as ImageIcon, ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';/, "import { Play, Heart, MessageCircle, ExternalLink, Image as ImageIcon, ChevronRight, ChevronLeft, Plus, Trash2, Camera } from 'lucide-react';");
  fs.writeFileSync('src/components/InstagramFeedSection.tsx', mob);
}

