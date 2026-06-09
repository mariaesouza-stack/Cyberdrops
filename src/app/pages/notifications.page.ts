import { Component, computed, inject, signal } from '@angular/core';
import { AppNotification } from '../models';
import { NotificationService } from '../services/notification.service';
import { AppIconComponent } from '../shared/app-icon.component';
import { NotificationCardComponent } from '../shared/notification-card.component';
import { NotificationEmptyStateComponent } from '../shared/notification-empty-state.component';
import { NotificationFilter, NotificationFilterComponent } from '../shared/notification-filter.component';

@Component({
  standalone: true,
  imports: [AppIconComponent, NotificationCardComponent, NotificationEmptyStateComponent, NotificationFilterComponent],
  template: `<section class="page notifications-page">
    <header class="notifications-heading"><div><p class="eyebrow">SEU RADAR</p><h1>Notificações</h1><p>{{ unreadLabel() }}</p></div>@if (service.unreadCount()) { <button (click)="service.markAllAsRead()"><app-icon name="check-check" [size]="17"/>Marcar todas como lidas</button> }</header>
    <app-notification-filter [selected]="filter()" (changed)="filter.set($event)"/>
    <div class="notifications-list">
      @for (notification of filteredNotifications(); track notification.id) {
        <app-notification-card [notification]="notification" (read)="service.markAsRead($event)" (opened)="open($event)"/>
      } @empty { <app-notification-empty-state/> }
    </div>
  </section>`
})
export class NotificationsPage {
  readonly service = inject(NotificationService);
  readonly filter = signal<NotificationFilter>('all');
  readonly filteredNotifications = computed(() => this.filter() === 'all' ? this.service.notifications() : this.service.notifications().filter(item => item.category === this.filter()));
  readonly unreadLabel = computed(() => this.service.unreadCount() ? `${this.service.unreadCount()} alertas não lidos no seu radar.` : 'Você está em dia com todos os alertas.');
  open(notification: AppNotification): void { void this.service.open(notification); }
}
