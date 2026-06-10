import { Injectable, computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { MOCK_NOTIFICATIONS } from "../core/mock-notifications";
import { AppNotification } from "../models";
import { UserService } from "./user.service";

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly router = inject(Router);
  private readonly user = inject(UserService);
  private readonly storageKey = "cyberdrops.notification-center";
  readonly notifications = signal<AppNotification[]>(this.read());
  readonly visibleNotifications = computed(() =>
    this.notifications().filter((item) => this.isEnabled(item)),
  );
  readonly unreadCount = computed(
    () => this.visibleNotifications().filter((item) => !item.read).length,
  );

  markAsRead(id: string): void {
    this.notifications.update((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    this.persist();
  }

  markAllAsRead(): void {
    const visibleIds = new Set(
      this.visibleNotifications().map((item) => item.id),
    );
    this.notifications.update((items) =>
      items.map((item) =>
        visibleIds.has(item.id) ? { ...item, read: true } : item,
      ),
    );
    this.persist();
  }

  async open(item: AppNotification): Promise<void> {
    this.markAsRead(item.id);
    await this.router.navigate(
      item.offerId ? ["/product", item.offerId] : ["/profile"],
    );
  }

  // Future push adapters (FCM, OneSignal) can feed normalized events through this method.
  receive(item: AppNotification): void {
    this.notifications.update((items) => [
      item,
      ...items.filter((current) => current.id !== item.id),
    ]);
    this.persist();
  }

  private read(): AppNotification[] {
    try {
      return JSON.parse(
        localStorage.getItem(this.storageKey) || "",
      ) as AppNotification[];
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications()));
  }

  private isEnabled(item: AppNotification): boolean {
    const preferenceId = item.preferenceId || this.preferenceFor(item);
    return (
      this.user
        .notifications()
        .find((preference) => preference.id === preferenceId)?.enabled ?? true
    );
  }

  private preferenceFor(item: AppNotification): string {
    if (item.category === "coupons") return "coupons";
    if (item.category === "community") return "community";
    if (item.category === "system") return "platform";
    if (item.category === "favorites") return "discounts";
    if (item.icon === "zap") return "flash";
    if (item.icon === "trending-down") return "priceDrops";
    return "discounts";
  }
}
