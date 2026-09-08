const fs = require('fs');

let content = fs.readFileSync('src/components/HeaderProfile.tsx', 'utf-8');

content = content.replace(
  `<img src="/ps5-side.png" alt="PlayStation 5" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] pointer-events-none select-none" draggable={false} />`,
  `<img src="/ps5.png" alt="PlayStation 5" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] pointer-events-none select-none -rotate-90 scale-125" style={{ transformOrigin: 'center center' }} draggable={false} />`
);

// If it has ps5.png already
content = content.replace(
  `<img src="/ps5.png" alt="PlayStation 5" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] pointer-events-none select-none" draggable={false} />`,
  `<img src="/ps5.png" alt="PlayStation 5" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] pointer-events-none select-none -rotate-90 scale-125" style={{ transformOrigin: 'center center' }} draggable={false} />`
);

fs.writeFileSync('src/components/HeaderProfile.tsx', content);
