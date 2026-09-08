const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  `                title="Ver avaliações no Google"
                subtitle="Confira o que nossos clientes dizem sobre nós ⭐⭐⭐⭐⭐"`,
  `                title="Avalie Nossa Loja no Google"
                subtitle="Sua opinião é muito importante para nós ⭐⭐⭐⭐⭐"`
);

appContent = appContent.replace(
  `                url="https://www.google.com/search?q=hi+tech+eletronicos"
                iconType="google"`,
  `                url={googleReviewUrl}
                iconType="google"`
);

fs.writeFileSync('src/App.tsx', appContent);
