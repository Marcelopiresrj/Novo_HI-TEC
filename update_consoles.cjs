const fs = require('fs');

let content = fs.readFileSync('src/components/HeaderProfile.tsx', 'utf-8');

content = content.replace(
  `        <motion.div 
          initial={{ opacity: 0, x: -20, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] z-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] pointer-events-none"
        >
           <img src="/ps5.png" alt="PlayStation 5" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
        </motion.div>`,
  `        <motion.div 
          initial={{ opacity: 0, x: -20, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          drag
          dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
          dragElastic={0.4}
          whileDrag={{ scale: 1.15, rotate: 10, cursor: "grabbing" }}
          whileHover={{ scale: 1.05, cursor: "grab" }}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] z-20 drop-shadow-[0_10px_30px_rgba(0,242,254,0.3)] touch-none cursor-grab"
        >
           <img src="/ps5.png" alt="PlayStation 5" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] pointer-events-none select-none" draggable={false} />
        </motion.div>`
);

content = content.replace(
  `        <motion.div 
          initial={{ opacity: 0, x: 20, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] z-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] pointer-events-none"
        >
           <img src="/xbox.png" alt="Xbox Series S" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
        </motion.div>`,
  `        <motion.div 
          initial={{ opacity: 0, x: 20, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
          drag
          dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
          dragElastic={0.4}
          whileDrag={{ scale: 1.15, rotate: -10, cursor: "grabbing" }}
          whileHover={{ scale: 1.05, cursor: "grab" }}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] z-20 drop-shadow-[0_10px_30px_rgba(34,197,94,0.3)] touch-none cursor-grab"
        >
           <img src="/xbox.png" alt="Xbox Series S" className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] pointer-events-none select-none" draggable={false} />
        </motion.div>`
);

fs.writeFileSync('src/components/HeaderProfile.tsx', content);
