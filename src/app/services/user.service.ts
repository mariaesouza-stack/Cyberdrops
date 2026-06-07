import { Injectable, signal } from '@angular/core';
import { NotificationPreference, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly defaultUser: User = { id: 1, name: 'Madison Souza', username: '@madbyte', email: 'madi@cyberdrops.gg', phone: '(11) 99999-2049', avatar: '👾' };
  readonly user = signal<User>(this.read('cyberdrops.user', this.defaultUser));
  readonly session = signal(this.read<boolean>('cyberdrops.session', false));
  readonly notifications = signal<NotificationPreference[]>(this.read('cyberdrops.notifications', [
    { id: 'flash', label: 'Promoções relâmpago', enabled: true },
    { id: 'free', label: 'Jogos grátis disponíveis', enabled: true },
    { id: 'coupons', label: 'Novos cupons disponíveis', enabled: true },
    { id: 'interactions', label: 'Interações nas minhas publicações', enabled: false },
    { id: 'recommendations', label: 'Recomendações personalizadas', enabled: true }
  ]));
  login(email: string): void { this.user.update(user => ({ ...user, email: email || user.email })); this.session.set(true); this.persist(); }
  register(user: User): void { this.user.set(user); this.session.set(true); this.persist(); }
  logout(): void { this.session.set(false); localStorage.setItem('cyberdrops.session', 'false'); }
  update(user: User): void { this.user.set({ ...user }); this.persist(); }
  setAvatar(avatar: string): void { this.user.update(user => ({ ...user, avatar })); this.persist(); }
  toggleNotification(id: string): void {
    this.notifications.update(items => items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
    this.persist();
  }
  private read<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; } }
  private persist(): void {
    localStorage.setItem('cyberdrops.user', JSON.stringify(this.user()));
    localStorage.setItem('cyberdrops.session', JSON.stringify(this.session()));
    localStorage.setItem('cyberdrops.notifications', JSON.stringify(this.notifications()));
  }
}
