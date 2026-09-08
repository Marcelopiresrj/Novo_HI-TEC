const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove activeFilter state and filteredPosts logic
content = content.replace(
  `  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [activeFilter, setActiveFilter] = useState("todos");

  const filteredPosts = posts.filter(post => {
    if (activeFilter === "todos") return true;
    if (activeFilter === "videos") return post.type === "video" || post.category === "reels";
    if (activeFilter === "smartphones") return post.category === "smartphones";
    if (activeFilter === "acessorios") return post.category === "acessorios";
    return true;
  });`,
  `  const [posts, setPosts] = useState<InstagramPost[]>([]);`
);

// Remove <InstagramFilterBar /> component
content = content.replace(
  `            {/* Instagram Filters */}
            <InstagramFilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />`,
  ``
);

// Change filteredPosts to posts
content = content.replace(/posts=\{filteredPosts\}/g, `posts={posts}`);

fs.writeFileSync('src/App.tsx', content);
