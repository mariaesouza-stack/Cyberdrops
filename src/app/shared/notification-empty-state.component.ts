import { Component } from '@angular/core';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-notification-empty-state',
  standalone: true,
  imports: [AppIconComponent],
  template: `<div class="notification-empty"><span><app-icon name="bell" [size]="38"/></span><h2>Nenhuma notificação por enquanto</h2><p>Quando surgirem novas promoções, cupons ou atualizações, elas aparecerão aqui.</p></div>`
})
export class NotificationEmptyStateComponent {}
