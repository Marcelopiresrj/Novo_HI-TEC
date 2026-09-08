const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Update the bottom Google Badge section where "Ver avaliações" is
appContent = appContent.replace(
  `              <a
                id="google-review-badge-link"
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00F2FE] hover:text-cyan-300 font-semibold underline underline-offset-2"
              >
                Ver avaliações
              </a>`,
  `              <a
                id="google-review-badge-link"
                href="https://www.google.com/search?q=hi+tech+eletronicos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00F2FE] hover:text-cyan-300 font-semibold underline underline-offset-2"
              >
                Ver avaliações
              </a>`
);

// Also update the large Google review card to "Ver avaliações no Google" instead of "Avalie Nossa Loja"
appContent = appContent.replace(
  `                title="Avalie Nossa Loja no Google"
                subtitle="Sua opinião é muito importante para nós ⭐⭐⭐⭐⭐"`,
  `                title="Ver avaliações no Google"
                subtitle="Confira o que nossos clientes dizem sobre nós ⭐⭐⭐⭐⭐"`
);
// And also change the URL of the large card to the search link instead of the review write link
appContent = appContent.replace(
  `                url={googleReviewUrl}`,
  `                url="https://www.google.com/search?q=hi+tech+eletronicos"`
);

fs.writeFileSync('src/App.tsx', appContent);
