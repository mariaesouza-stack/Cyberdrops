import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-notification-badge',
  standalone: true,
  template: `@if (count() > 0) { <span class="notification-badge" [attr.aria-label]="count() + ' notificações não lidas'">{{ label() }}</span> }`
})
export class NotificationBadgeComponent {
  readonly count = input(0);
  readonly label = computed(() => this.count() > 99 ? '99+' : String(this.count()));
}
