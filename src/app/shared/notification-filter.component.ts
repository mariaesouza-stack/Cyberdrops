import { Component, input, output } from '@angular/core';
import { AppNotificationCategory } from '../models';

export type NotificationFilter = 'all' | AppNotificationCategory;

@Component({
  selector: 'app-notification-filter',
  standalone: true,
  template: `<div class="notification-filter" aria-label="Filtros de notificações">
    @for (option of options; track option.id) {
      <button [class.active]="selected() === option.id" (click)="changed.emit(option.id)">{{ option.label }}</button>
    }
  </div>`
})
export class NotificationFilterComponent {
  readonly selected = input<NotificationFilter>('all');
  readonly changed = output<NotificationFilter>();
  readonly options: { id: NotificationFilter; label: string }[] = [
    { id: 'all', label: 'Todas' }, { id: 'offers', label: 'Ofertas' }, { id: 'coupons', label: 'Cupons' },
    { id: 'favorites', label: 'Favoritos' }, { id: 'community', label: 'Comunidade' }, { id: 'system', label: 'Sistema' }
  ];
}
