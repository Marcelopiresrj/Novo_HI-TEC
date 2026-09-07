const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Change the initial state
content = content.replace(/const \[posts, setPosts\] = useState<InstagramPost\[\]>\(INSTAGRAM_POSTS\);/, "const [posts, setPosts] = useState<InstagramPost[]>([]);");

// Change the merge logic
const regex = /\/\/ Mesclar posts do Firebase com posts originais predefinidos\n\s*const allPosts = \[\.\.\.resolvedPosts, \.\.\.INSTAGRAM_POSTS\];\n\s*const uniquePosts = Array\.from\(new Map\(allPosts\.map\(p => \[p\.id, p\]\)\)\.values\(\)\);/;
content = content.replace(regex, `
      // Apenas os posts salvos no banco de dados
      const allPosts = [...resolvedPosts];
      const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());`);

fs.writeFileSync('src/App.tsx', content);
