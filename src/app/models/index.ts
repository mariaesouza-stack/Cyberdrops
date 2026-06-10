export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  password?: string;
  bio?: string;
}
export interface Store {
  id: string;
  name: string;
  icon: string;
  color: string;
}
export interface Coupon {
  code: string;
  description: string;
  store: string;
}
export interface Comment {
  id: number;
  user: User;
  text: string;
  likes: number;
  time: string;
  replies?: Comment[];
}
export interface Offer {
  id: number;
  author: User;
  store: string;
  time: string;
  image: string;
  gallery: string[];
  discount: number;
  category: string;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  likes: number;
  dislikes: number;
  comments: Comment[];
  coupon?: Coupon;
  url: string;
  createdAt: string;
  saved?: boolean;
  publicationType?: PublicationType;
  publicationStatus?: PublicationStatus;
  publicationDiscountLabel?: string;
  publicationDraft?: PublicationDraft;
  moderationMessage?: string;
  publisherType?: "bot" | "user";
}
export type PublicationType = "coupon" | "deal";
export type PublicationStatus = "Em análise" | "Publicado" | "Rejeitado";
export interface CouponPublicationDraft {
  type: "coupon";
  store: string;
  code: string;
  discountKind: "percent" | "value";
  discountValue: number;
  expiresAt: string;
  description: string;
  url: string;
}
export interface DealPublicationDraft {
  type: "deal";
  title: string;
  store: string;
  url: string;
  price: number;
  oldPrice: number;
  category: string;
  image: string;
  description: string;
}
export type PublicationDraft = CouponPublicationDraft | DealPublicationDraft;
export interface NotificationPreference {
  id: string;
  label: string;
  enabled: boolean;
}
export type AppNotificationCategory =
  | "offers"
  | "coupons"
  | "favorites"
  | "community"
  | "system";
export type AppNotificationAction = "offer" | "product" | "coupon" | "profile";
export interface AppNotification {
  id: string;
  category: AppNotificationCategory;
  icon: string;
  title: string;
  description: string;
  time: string;
  createdAt: string;
  read: boolean;
  action: AppNotificationAction;
  preferenceId?: string;
  offerId?: number;
  couponCode?: string;
}
