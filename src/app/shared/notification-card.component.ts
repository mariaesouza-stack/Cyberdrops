import { Component, input, output } from '@angular/core';
import { AppNotification } from '../models';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [AppIconComponent],
  template: `<article class="notification-card" [class.unread]="!notification().read">
    <button class="notification-main" (click)="opened.emit(notification())">
      <span class="notification-event-icon"><app-icon [name]="notification().icon" [size]="22"/></span>
      <span class="notification-copy"><span class="notification-title-row"><b>{{ notification().title }}</b>@if (!notification().read) { <i aria-label="Não lida"></i> }</span><span>{{ notification().description }}</span><small>{{ notification().time }}</small></span>
    </button>
    <div class="notification-quick-actions">
      @if (!notification().read) { <button (click)="read.emit(notification().id)"><app-icon name="check" [size]="15"/>Marcar como lida</button> }
      <button class="open-notification" (click)="opened.emit(notification())"><app-icon name="arrow-right" [size]="15"/>{{ actionLabel() }}</button>
    </div>
  </article>`
})
export class NotificationCardComponent {
  readonly notification = input.required<AppNotification>();
  readonly opened = output<AppNotification>();
  readonly read = output<string>();
  actionLabel(): string {
    const action = this.notification().action;
    if (action === 'coupon') return 'Abrir cupom';
    if (action === 'profile') return 'Abrir perfil';
    return action === 'product' ? 'Abrir produto' : 'Abrir oferta';
  }
}
