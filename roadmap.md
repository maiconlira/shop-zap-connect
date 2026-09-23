# Roadmap

- [x] Backend PHP + MySQL (Hostinger) para produtos do admin
  - [x] API PHP (config, login, products, upload) em public/api
  - [x] Cliente de API no frontend (src/lib/api.ts)
  - [x] useProducts com sincronização ao banco + fallback local
  - [x] Login admin via API com fallback local
  - [x] Status do banco + botão "sincronizar catálogo" no Admin
- [x] Remover limite de 1,5 MB no upload de fotos (ilimitado no modo servidor)
- [x] Guia de configuração (public/api/LEIA-ME.txt)
- [ ] Usuário: criar banco MySQL no hPanel e preencher public/api/config.php na Hostinger — bloqueado: só o usuário tem acesso ao hPanel
