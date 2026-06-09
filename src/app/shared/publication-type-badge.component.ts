import { Component, input } from '@angular/core';
import { PublicationType } from '../models';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-publication-type-badge',
  standalone: true,
  imports: [AppIconComponent],
  template: `@if (type(); as value) { <span class="publication-type"><app-icon [name]="value === 'coupon' ? 'ticket-percent' : 'badge-percent'" [size]="13"/>{{ value === 'coupon' ? 'Cupom' : 'Item em promoção' }}</span> }`
})
export class PublicationTypeBadgeComponent {
  readonly type = input<PublicationType>();
}
