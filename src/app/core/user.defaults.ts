import { NotificationPreference, User } from "../models";
import { DEFAULT_AVATAR } from "./community-users";

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  { id: "discounts", label: "Alertas de desconto", enabled: true },
  { id: "coupons", label: "Alertas de cupons", enabled: true },
  { id: "priceDrops", label: "Queda de preço", enabled: true },
  { id: "flash", label: "Promoções relâmpago", enabled: true },
  { id: "community", label: "Notificações da comunidade", enabled: false },
  { id: "platform", label: "Novidades da plataforma", enabled: true },
];

export const DEFAULT_USER: User = {
  id: 1,
  name: "NeonHunter",
  username: "@neonhunter",
  email: "player@cyberdrops.gg",
  phone: "(11) 99999-2049",
  avatar: DEFAULT_AVATAR,
  bio: "Rastreia os menores preços da Steam",
};
