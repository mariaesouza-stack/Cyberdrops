import { Injectable, signal } from "@angular/core";
import { DEFAULT_AVATAR } from "../core/community-users";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_USER,
} from "../core/user.defaults";
import { NotificationPreference, User } from "../models";

@Injectable({ providedIn: "root" })
export class UserService {
  readonly user = signal<User>(
    this.normalizeUser(this.read("cyberdrops.user", DEFAULT_USER)),
  );
  readonly session = signal(this.read<boolean>("cyberdrops.session", false));
  readonly notifications = signal<NotificationPreference[]>(
    this.normalizeNotifications(
      this.read("cyberdrops.notifications", DEFAULT_NOTIFICATION_PREFERENCES),
    ),
  );
  login(email: string): void {
    this.user.update((user) => ({ ...user, email: email || user.email }));
    this.session.set(true);
    this.persist();
  }
  register(user: User): void {
    this.user.set(this.normalizeUser(user));
    this.session.set(true);
    this.persist();
  }
  logout(): void {
    this.session.set(false);
    localStorage.setItem("cyberdrops.session", "false");
  }
  update(user: User): void {
    this.user.set(this.normalizeUser(user));
    this.persist();
  }
  setAvatar(avatar: string): void {
    this.user.update((user) => ({ ...user, avatar }));
    this.persist();
  }
  toggleNotification(id: string): void {
    this.notifications.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
    this.persist();
  }
  private read<T>(key: string, fallback: T): T {
    try {
      return JSON.parse(localStorage.getItem(key) || "") as T;
    } catch {
      return fallback;
    }
  }
  private normalizeUser(user: User): User {
    return {
      ...user,
      avatar: user.avatar?.startsWith("assets/avatars/")
        ? user.avatar
        : DEFAULT_AVATAR,
    };
  }
  private normalizeNotifications(
    saved: NotificationPreference[],
  ): NotificationPreference[] {
    return DEFAULT_NOTIFICATION_PREFERENCES.map((item) => ({
      ...item,
      enabled:
        saved.find((savedItem) => savedItem.id === item.id)?.enabled ??
        item.enabled,
    }));
  }
  private persist(): void {
    localStorage.setItem("cyberdrops.user", JSON.stringify(this.user()));
    localStorage.setItem("cyberdrops.session", JSON.stringify(this.session()));
    localStorage.setItem(
      "cyberdrops.notifications",
      JSON.stringify(this.notifications()),
    );
  }
}
