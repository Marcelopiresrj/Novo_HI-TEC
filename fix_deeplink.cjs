const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Insert a new useEffect to check URL parameters for a post ID after posts are loaded
const newUseEffect = `
  // Check for deep link to a specific post
  React.useEffect(() => {
    if (posts.length > 0 && !selectedInstagramPost) {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      if (postId) {
        const postToOpen = posts.find(p => p.id === postId);
        if (postToOpen) {
          setSelectedInstagramPost(postToOpen);
          // Optional: Clean up URL after opening
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [posts]);
`;

content = content.replace("React.useEffect(() => {", newUseEffect + "\n  React.useEffect(() => {");

fs.writeFileSync('src/App.tsx', content);
