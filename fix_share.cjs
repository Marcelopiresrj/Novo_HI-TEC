const fs = require('fs');
let content = fs.readFileSync('src/components/InstagramMediaModal.tsx', 'utf-8');

const oldHandleShare = /const handleShare = \(\) => \{\s*if \(navigator\.clipboard\) \{\s*navigator\.clipboard\.writeText\(post\.instagramUrl\);\s*onShowToast\('Link do Instagram copiado com sucesso!'\);\s*\}\s*\};/;

const newHandleShare = `const handleShare = async () => {
    const shareUrl = \`\${window.location.origin}?post=\${post.id}\`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: \`Confira: \${post.title} na Hi-Tech Eletrônicos!\`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or failed
      }
    }
    
    // Fallback to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      onShowToast('Link do post copiado com sucesso!');
    }
  };`;

content = content.replace(oldHandleShare, newHandleShare);

fs.writeFileSync('src/components/InstagramMediaModal.tsx', content);
