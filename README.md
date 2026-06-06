# CyberDrops

MVP mobile-first de uma comunidade de promoções gamer, construído com Angular, TypeScript e SCSS.

## Rodar localmente

```bash
npm install
npm start
```

Abra `http://localhost:4200`.

## Funcionalidades

- Splash, login e cadastro
- Feed com filtros por categoria e loja
- Busca local sobre dados mockados
- Detalhes da promoção, cupom copiável e discussão
- Perfil editável, preferências de notificação e seletor de avatar
- Votos em promoções e alternância entre tema claro e escuro

## Estrutura

- `src/app/core`: constantes e infraestrutura global
- `src/app/models`: interfaces TypeScript
- `src/app/services`: estado e dados mockados
- `src/app/shared`: componentes reutilizáveis
- `src/app/pages`: páginas navegáveis
- `src/assets`: recursos estáticos locais
