import { Comment } from "../models";
import { COMMUNITY_USERS } from "./community-users";

export const COMMUNITY_COMMENTS: Comment[] = [
  {
    id: 101,
    user: COMMUNITY_USERS[3],
    text: "Preço digno de upgrade no setup. O histórico está excelente e ficou abaixo da média dos últimos meses.",
    likes: 18,
    time: "há 12 min",
    replies: [
      {
        id: 1001,
        user: COMMUNITY_USERS[5],
        text: "Também acompanhei o histórico. Nesse valor, vale bastante a pena.",
        likes: 7,
        time: "há 8 min",
      },
    ],
  },
  {
    id: 102,
    user: COMMUNITY_USERS[5],
    text:
      "Drop confirmado. Já entrou no meu radar de promoções e a loja está " +
      "com entrega rápida para minha região.",
    likes: 11,
    time: "há 28 min",
    replies: [
      {
        id: 1002,
        user: COMMUNITY_USERS[1],
        text: "Aqui também apareceu entrega antecipada. Ótimo sinal.",
        likes: 4,
        time: "há 20 min",
      },
    ],
  },
  {
    id: 103,
    user: COMMUNITY_USERS[1],
    text:
      "Alguém já testou esse modelo por algumas semanas? Quero saber " +
      "principalmente sobre acabamento e durabilidade.",
    likes: 9,
    time: "há 43 min",
    replies: [
      {
        id: 1003,
        user: COMMUNITY_USERS[3],
        text: "Uso uma versão parecida no setup. A construção é sólida e não apresentou folgas.",
        likes: 6,
        time: "há 31 min",
      },
      {
        id: 1004,
        user: COMMUNITY_USERS[6],
        text: "Vale conferir as avaliações recentes da loja antes de fechar.",
        likes: 3,
        time: "há 25 min",
      },
    ],
  },
  {
    id: 104,
    user: COMMUNITY_USERS[6],
    text:
      "Comparei com outras ofertas de hoje e esta continua sendo uma das " +
      "melhores considerando preço e especificações.",
    likes: 14,
    time: "há 1 h",
    replies: [
      {
        id: 1005,
        user: COMMUNITY_USERS[4],
        text: "Concordo. Produtos equivalentes estão custando bem mais.",
        likes: 5,
        time: "há 52 min",
      },
    ],
  },
  {
    id: 105,
    user: COMMUNITY_USERS[4],
    text: "Oferta salva. Vou acompanhar até o fim do dia para decidir se faço o upgrade.",
    likes: 8,
    time: "há 2 h",
  },
  {
    id: 106,
    user: COMMUNITY_USERS[7],
    text: "O preço está competitivo, mas vale confirmar se a garantia é nacional antes de fechar.",
    likes: 22,
    time: "há 2 h",
    replies: [
      {
        id: 1006,
        user: COMMUNITY_USERS[2],
        text: "Boa observação. A página da loja informa garantia de doze meses.",
        likes: 9,
        time: "há 1 h",
      },
    ],
  },
  {
    id: 107,
    user: COMMUNITY_USERS[2],
    text: "Usei o cupom no checkout e o desconto apareceu corretamente para mim.",
    likes: 16,
    time: "há 3 h",
  },
  {
    id: 108,
    user: COMMUNITY_USERS[0],
    text: "Para quem está montando o primeiro setup, parece uma opção bem equilibrada pelo valor.",
    likes: 13,
    time: "há 3 h",
    replies: [
      {
        id: 1007,
        user: COMMUNITY_USERS[6],
        text: "Concordo, principalmente considerando os recursos incluídos.",
        likes: 6,
        time: "há 2 h",
      },
    ],
  },
  {
    id: 109,
    user: COMMUNITY_USERS[6],
    text: "A entrega da loja foi rápida na minha última compra e o produto chegou bem protegido.",
    likes: 7,
    time: "há 4 h",
  },
  {
    id: 110,
    user: COMMUNITY_USERS[1],
    text: "Alguém encontrou uma condição melhor pagando no Pix?",
    likes: 5,
    time: "há 5 h",
  },
  {
    id: 111,
    user: COMMUNITY_USERS[5],
    text: "As especificações atendem bem ao uso diário e também deixam margem para jogos competitivos.",
    likes: 10,
    time: "há 6 h",
  },
  {
    id: 112,
    user: COMMUNITY_USERS[3],
    text: "Já estava acompanhando este item e esta foi a primeira queda relevante de preço na semana.",
    likes: 19,
    time: "há 7 h",
  },
];
