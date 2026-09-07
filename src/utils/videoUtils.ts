export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const url = URL.createObjectURL(file);
    video.src = url;
    
    video.onloadeddata = () => {
      // Seek to 1 second or half duration
      video.currentTime = Math.min(1, video.duration / 2 || 0);
    };
    
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      // Scale down to max 600px width/height for thumbnail
      const maxSize = 600;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      if (width > height) {
        if (width > maxSize) {
          height = Math.round(height * (maxSize / width));
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round(width * (maxSize / height));
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      } else {
        resolve(''); // Fallback
      }
      URL.revokeObjectURL(url);
    };
    
    video.onerror = () => {
      resolve('');
      URL.revokeObjectURL(url);
    };
  });
};
