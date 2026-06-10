# CyberDrops

MVP acadêmico mobile-first de uma comunidade de promoções gamer. O frontend Angular consome uma API Node.js que coleta ofertas públicas com scraping controlado, cache e fallback.

## Rodar o backend

```bash
cd backend
npm install
npm start
```

A API ficará disponível em `http://localhost:3000/api`.

## Rodar o frontend

Em outro terminal:

```bash
npm install
npm start
```

Abra `http://localhost:4200`.

Se o servidor ficar aberto por muito tempo e deixar de refletir alterações
recentes, reinicie-o limpando o cache do Angular:

```bash
npm run start:clean
```

## Endpoints

- `GET /api/health`
- `GET /api/offers`
- `GET /api/offers/search?q=termo`
- `GET /api/offers/store/:store`
- `GET /api/offers/category/:category`
- `GET /api/offers/:id`
- `POST /api/offers/refresh`

## Scraping e cache

O backend consulta somente páginas públicas de Steam, Epic Games, Kabum, Amazon e AliExpress. Cada fonte usa timeout e User-Agent simples. As fontes são processadas independentemente: se uma delas bloquear a requisição ou alterar seu HTML, as demais ainda podem retornar resultados.

O resultado fica em `backend/data/offers-cache.json` por no mínimo 30 minutos. Nenhuma área privada, login, captcha, paywall ou mecanismo de proteção é burlado.

## Fallback

Quando o scraping falha, o backend retorna o último cache válido. Se o cache ainda estiver vazio, usa `backend/data/mock-offers.json`. Se a API estiver offline, o Angular usa sua base mockada interna e exibe uma mensagem amigável.

Sessão, perfil, tema, notificações, curtidas, descurtidas, comentários, respostas e ofertas salvas ficam no `localStorage`.

## Recuperação de senha simulada

O fluxo de recuperação funciona integralmente no frontend, com validação de
e-mail, loading simulado, confirmação, cooldown de reenvio e atualização da
senha local.

Para testar, utilize o e-mail mockado:

```text
player@cyberdrops.gg
```

Na tela de confirmação, o botão **Criar nova senha** representa o acesso pelo
link recebido no e-mail durante a demonstração.

## Limitações do MVP

- Seletores de páginas públicas podem mudar sem aviso.
- Marketplaces podem bloquear requisições automatizadas legítimas.
- Não há banco de dados, autenticação real ou sincronização das interações sociais entre dispositivos.
