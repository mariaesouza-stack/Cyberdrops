interface MockEngagement {
  likes: number;
  dislikes: number;
}

const ENGAGEMENT_BY_OFFER_ID: Record<number, MockEngagement> = {
  1: { likes: 1384, dislikes: 28 },
  2: { likes: 1511, dislikes: 27 },
  3: { likes: 726, dislikes: 34 },
  4: { likes: 1016, dislikes: 19 },
  5: { likes: 1826, dislikes: 23 },
  6: { likes: 1294, dislikes: 21 },
  7: { likes: 1668, dislikes: 31 },
  8: { likes: 1589, dislikes: 16 },
  9: { likes: 1127, dislikes: 43 },
  10: { likes: 1074, dislikes: 27 },
  11: { likes: 886, dislikes: 47 },
  12: { likes: 934, dislikes: 28 },
  13: { likes: 341, dislikes: 18 },
  14: { likes: 813, dislikes: 12 },
  15: { likes: 674, dislikes: 14 },
  16: { likes: 902, dislikes: 18 },
  17: { likes: 721, dislikes: 11 },
  18: { likes: 286, dislikes: 13 },
  19: { likes: 1418, dislikes: 24 },
  20: { likes: 318, dislikes: 7 },
  21: { likes: 1183, dislikes: 36 },
  22: { likes: 842, dislikes: 15 },
  101: { likes: 1642, dislikes: 37 },
  102: { likes: 1081, dislikes: 46 },
  103: { likes: 1337, dislikes: 52 },
  104: { likes: 892, dislikes: 33 },
  105: { likes: 1879, dislikes: 61 },
  106: { likes: 743, dislikes: 29 },
  107: { likes: 1268, dislikes: 24 },
  108: { likes: 917, dislikes: 18 },
  109: { likes: 1104, dislikes: 31 },
  110: { likes: 1219, dislikes: 22 },
  111: { likes: 1456, dislikes: 44 },
  112: { likes: 638, dislikes: 16 },
  113: { likes: 784, dislikes: 20 },
  114: { likes: 1713, dislikes: 35 },
  115: { likes: 965, dislikes: 27 },
  116: { likes: 1026, dislikes: 39 },
  117: { likes: 1568, dislikes: 73 },
  118: { likes: 1481, dislikes: 68 },
};

export function mockEngagement(
  id: number,
  discount: number,
  isCoupon: boolean,
): MockEngagement {
  const saved = ENGAGEMENT_BY_OFFER_ID[id];
  if (saved) return saved;

  const likes = Math.max(
    18,
    Math.round((isCoupon ? 180 : 75) + discount * (isCoupon ? 13 : 8)),
  );
  return {
    likes,
    dislikes: Math.max(2, Math.round(likes * (isCoupon ? 0.035 : 0.025))),
  };
}
