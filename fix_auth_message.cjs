const fs = require('fs');
let content = fs.readFileSync('src/utils/adminAuthentication.ts', 'utf-8');

content = content.replace(
  'if (!data.user) throw new Error("Erro desconhecido ao criar usuário");',
  `if (!data.user) throw new Error("Erro desconhecido ao criar usuário");
    if (!data.session) throw new Error("Por favor, desative a opção 'Confirm email' nas configurações do Supabase (Authentication -> Providers -> Email) para permitir o login automático, ou confirme o seu email.");`
);

fs.writeFileSync('src/utils/adminAuthentication.ts', content);
