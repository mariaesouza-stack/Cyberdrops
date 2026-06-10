import { PublicationStatus } from "../models";

export const PUBLICATION_MESSAGES: Record<PublicationStatus, string> = {
  "Em análise": "Sua publicação está sendo revisada pelos moderadores.",
  Publicado: "Sua publicação já está visível para a comunidade.",
  Rejeitado: "Esta publicação foi recusada por informações incompletas.",
};
