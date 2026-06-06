import { Injectable, signal } from '@angular/core';
import { NotificationPreference, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly user = signal<User>({ id: 1, name: 'Madison Souza', username: '@madbyte', email: 'madi@cyberdrops.gg', phone: '(11) 99999-2049', avatar: '👾' });
  readonly notifications = signal<NotificationPreference[]>([
    { id: 'flash', label: 'Promoções relâmpago', enabled: true },
    { id: 'free', label: 'Jogos grátis disponíveis', enabled: true },
    { id: 'coupons', label: 'Novos cupons disponíveis', enabled: true },
    { id: 'interactions', label: 'Interações nas minhas publicações', enabled: false },
    { id: 'recommendations', label: 'Recomendações personalizadas', enabled: true }
  ]);
  update(user: User): void { this.user.set({ ...user }); }
  setAvatar(avatar: string): void { this.user.update(user => ({ ...user, avatar })); }
  toggleNotification(id: string): void {
    this.notifications.update(items => items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  }
}
