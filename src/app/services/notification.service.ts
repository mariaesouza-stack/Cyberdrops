import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotification } from '../models';

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'flash-g502', category: 'offers', icon: 'zap', title: 'Oferta relâmpago', description: 'Mouse Logitech G502 com 42% OFF.', time: 'Agora mesmo', createdAt: '2026-06-09T18:30:00-03:00', read: false, action: 'offer', offerId: 2 },
  { id: 'coupon-kabum', category: 'coupons', icon: 'ticket-percent', title: 'Novo cupom da Kabum', description: 'Cupom CYBER10 garante 10% OFF em periféricos.', time: 'Há 5 minutos', createdAt: '2026-06-09T18:25:00-03:00', read: false, action: 'coupon', offerId: 2, couponCode: 'CYBER10' },
  { id: 'price-monitor', category: 'offers', icon: 'trending-down', title: 'Preço caiu', description: 'Monitor Gamer LG UltraGear 144Hz caiu para R$ 899,90.', time: 'Há 2 horas', createdAt: '2026-06-09T16:30:00-03:00', read: false, action: 'product', offerId: 2 },
  { id: 'favorite-cyberpunk', category: 'favorites', icon: 'heart', title: 'Favorito com desconto', description: 'Cyberpunk 2077: Ultimate Edition recebeu 67% OFF.', time: 'Há 3 horas', createdAt: '2026-06-09T15:30:00-03:00', read: false, action: 'product', offerId: 1 },
  { id: 'coupon-terabyte', category: 'coupons', icon: 'clock', title: 'Cupom expirando', description: 'Seu cupom da Terabyte expira em 2 horas.', time: 'Há 4 horas', createdAt: '2026-06-09T14:30:00-03:00', read: false, action: 'coupon', offerId: 2, couponCode: 'SETUP15' },
  { id: 'reply-community', category: 'community', icon: 'message-circle', title: 'Nova resposta no seu comentário', description: 'PixelStorm respondeu sua análise sobre o monitor gamer.', time: 'Há 6 horas', createdAt: '2026-06-09T12:30:00-03:00', read: false, action: 'offer', offerId: 2 },
  { id: 'stock-favorite', category: 'favorites', icon: 'package-check', title: 'Favorito voltou ao estoque', description: 'O monitor gamer que você salvou está disponível novamente.', time: 'Ontem', createdAt: '2026-06-08T20:00:00-03:00', read: true, action: 'product', offerId: 2 },
  { id: 'system-update', category: 'system', icon: 'bell', title: 'Novidade no CyberDrops', description: 'Agora você pode acompanhar quedas de preço na Central de Notificações.', time: 'Há 2 dias', createdAt: '2026-06-07T15:00:00-03:00', read: true, action: 'profile' }
];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly router = inject(Router);
  private readonly storageKey = 'cyberdrops.notification-center';
  readonly notifications = signal<AppNotification[]>(this.read());
  readonly unreadCount = computed(() => this.notifications().filter(item => !item.read).length);

  markAsRead(id: string): void {
    this.notifications.update(items => items.map(item => item.id === id ? { ...item, read: true } : item));
    this.persist();
  }

  markAllAsRead(): void {
    this.notifications.update(items => items.map(item => ({ ...item, read: true })));
    this.persist();
  }

  async open(item: AppNotification): Promise<void> {
    this.markAsRead(item.id);
    await this.router.navigate(item.offerId ? ['/product', item.offerId] : ['/profile']);
  }

  // Future push adapters (FCM, OneSignal) can feed normalized events through this method.
  receive(item: AppNotification): void {
    this.notifications.update(items => [item, ...items.filter(current => current.id !== item.id)]);
    this.persist();
  }

  private read(): AppNotification[] {
    try { return JSON.parse(localStorage.getItem(this.storageKey) || '') as AppNotification[]; }
    catch { return MOCK_NOTIFICATIONS; }
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications()));
  }
}
