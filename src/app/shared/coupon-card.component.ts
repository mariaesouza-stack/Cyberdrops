import { Component, input, signal } from '@angular/core';
import { Coupon } from '../models';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-coupon-card', standalone: true, imports: [AppIconComponent],
  template: `<div class="coupon-card">
    <div><small>CUPOM ATIVO</small><strong>{{ coupon().code }}</strong><span>{{ coupon().description }}</span></div>
    <button class="button secondary" (click)="copy()"><app-icon [name]="copied() ? 'check' : 'copy'" [size]="16"/>{{ copied() ? 'Copiado!' : 'Copiar' }}</button>
  </div>`
})
export class CouponCardComponent {
  readonly coupon = input.required<Coupon>();
  readonly copied = signal(false);
  copy(): void {
    navigator.clipboard?.writeText(this.coupon().code);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
}
