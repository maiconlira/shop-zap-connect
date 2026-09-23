# Roadmap

- [ ] Backend PHP + MySQL (Hostinger) para produtos do admin — em andamento
  - [x] API PHP (config, login, products, upload) em public/api
  - [x] Cliente de API no frontend (src/lib/api.ts)
  - [x] useProducts com sincronização ao banco + fallback local
  - [x] Login admin via API com fallback local
  - [ ] Status do banco + botão "sincronizar catálogo" no Admin
- [ ] Remover limite de 1,5 MB no upload de fotos (ilimitado no modo servidor)
  - [x] Limites PHP elevados (.htaccess / .user.ini)
  - [ ] Remover trava de tamanho no formulário quando API conectada
- [ ] Typecheck + instruções de configuração do banco na Hostinger
