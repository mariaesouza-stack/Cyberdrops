import { Injectable, signal } from '@angular/core';
import { DEFAULT_AVATAR } from '../core/community-users';
import { NotificationPreference, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly defaultNotifications: NotificationPreference[] = [
    { id: 'discounts', label: 'Alertas de desconto', enabled: true },
    { id: 'coupons', label: 'Alertas de cupons', enabled: true },
    { id: 'priceDrops', label: 'Queda de preço', enabled: true },
    { id: 'flash', label: 'Promoções relâmpago', enabled: true },
    { id: 'community', label: 'Notificações da comunidade', enabled: false },
    { id: 'platform', label: 'Novidades da plataforma', enabled: true }
  ];
  private readonly defaultUser: User = { id: 1, name: 'NeonHunter', username: '@neonhunter', email: 'player@cyberdrops.gg', phone: '(11) 99999-2049', avatar: DEFAULT_AVATAR, bio: 'Rastreia os menores preços da Steam' };
  readonly user = signal<User>(this.normalizeUser(this.read('cyberdrops.user', this.defaultUser)));
  readonly session = signal(this.read<boolean>('cyberdrops.session', false));
  readonly notifications = signal<NotificationPreference[]>(this.normalizeNotifications(this.read('cyberdrops.notifications', this.defaultNotifications)));
  login(email: string): void { this.user.update(user => ({ ...user, email: email || user.email })); this.session.set(true); this.persist(); }
  register(user: User): void { this.user.set(this.normalizeUser(user)); this.session.set(true); this.persist(); }
  logout(): void { this.session.set(false); localStorage.setItem('cyberdrops.session', 'false'); }
  update(user: User): void { this.user.set(this.normalizeUser(user)); this.persist(); }
  setAvatar(avatar: string): void { this.user.update(user => ({ ...user, avatar })); this.persist(); }
  toggleNotification(id: string): void {
    this.notifications.update(items => items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
    this.persist();
  }
  private read<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; } }
  private normalizeUser(user: User): User {
    return { ...user, avatar: user.avatar?.startsWith('assets/avatars/') ? user.avatar : DEFAULT_AVATAR };
  }
  private normalizeNotifications(saved: NotificationPreference[]): NotificationPreference[] {
    return this.defaultNotifications.map(item => ({ ...item, enabled: saved.find(savedItem => savedItem.id === item.id)?.enabled ?? item.enabled }));
  }
  private persist(): void {
    localStorage.setItem('cyberdrops.user', JSON.stringify(this.user()));
    localStorage.setItem('cyberdrops.session', JSON.stringify(this.session()));
    localStorage.setItem('cyberdrops.notifications', JSON.stringify(this.notifications()));
  }
}
