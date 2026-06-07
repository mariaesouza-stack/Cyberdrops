export interface User {
  id: number; name: string; username: string; email: string; phone: string; avatar: string; password?: string;
}
export interface Store { id: string; name: string; icon: string; color: string; }
export interface Coupon { code: string; description: string; store: string; }
export interface Comment {
  id: number; user: User; text: string; likes: number; time: string; replies?: Comment[];
}
export interface Offer {
  id: number; author: User; store: string; time: string; image: string; gallery: string[];
  discount: number; category: string; title: string; description: string; oldPrice: number;
  price: number; likes: number; dislikes: number; comments: Comment[]; coupon?: Coupon;
  url: string; createdAt: string; saved?: boolean;
}
export interface NotificationPreference { id: string; label: string; enabled: boolean; }
