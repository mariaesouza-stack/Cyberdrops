import { User } from "../models";

export const CYBER_AVATARS = [
  "assets/avatars/neon-hunter.png",
  "assets/avatars/pixel-storm.png",
  "assets/avatars/cyber-loot.png",
  "assets/avatars/rtx-queen.png",
  "assets/avatars/game-dropper.png",
  "assets/avatars/bit-ninja.png",
  "assets/avatars/loot-master.png",
  "assets/avatars/glitch-core.png",
  "assets/avatars/rgb-pilot.png",
  "assets/avatars/pc-titan.png",
  "assets/avatars/chip-spark.png",
  "assets/avatars/headset-zero.png",
] as const;

export const DEFAULT_AVATAR = CYBER_AVATARS[0];
export const FALLBACK_AVATAR = "assets/avatars/cyber-fallback.png";
export const BOT_AVATAR = "assets/coupon-bot.svg";
export const CYBERDROPS_BOT: User = {
  id: 0,
  name: "CyberDrops Bot",
  username: "@cyberdropsbot",
  email: "",
  phone: "",
  avatar: BOT_AVATAR,
  bio: "Radar automatizado de ofertas e cupons",
};

export const COMMUNITY_USERS: User[] = [
  {
    id: 2,
    name: "NeonHunter",
    username: "@neonhunter",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[0],
    bio: "Rastreia os menores preços da Steam",
  },
  {
    id: 3,
    name: "PixelStorm",
    username: "@pixelstorm",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[1],
    bio: "Drops rápidos e jogos indie",
  },
  {
    id: 4,
    name: "CyberLoot",
    username: "@cyberloot",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[2],
    bio: "Cupons e recompensas digitais",
  },
  {
    id: 5,
    name: "RTXQueen",
    username: "@rtxqueen",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[3],
    bio: "Hardware, GPUs e setups RGB",
  },
  {
    id: 6,
    name: "GameDropper",
    username: "@gamedropper",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[4],
    bio: "Ofertas multiplayer para o squad",
  },
  {
    id: 7,
    name: "BitNinja",
    username: "@bitninja",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[5],
    bio: "Caçador silencioso de promoções",
  },
  {
    id: 8,
    name: "LootMaster",
    username: "@lootmaster",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[6],
    bio: "Especialista em bundles e DLCs",
  },
  {
    id: 9,
    name: "GlitchCore",
    username: "@glitchcore",
    email: "",
    phone: "",
    avatar: CYBER_AVATARS[7],
    bio: "Radar de descontos fora da curva",
  },
];
