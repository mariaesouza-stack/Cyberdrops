import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '../models';

@Component({
  selector: 'app-coupon-offer-card',
  standalone: true,
  template: `<article class="coupon-offer-card" role="link" tabindex="0" (click)="open()" (keydown.enter)="open()" (keydown.space)="open($event)">
    <header><span class="avatar mini">{{ offer().author.avatar }}</span><div><strong>{{ offer().store }}</strong><small>{{ offer().time }}</small></div><span class="coupon-discount">-{{ offer().discount }}%</span></header>
    <div class="coupon-offer-main"><div class="coupon-code-row"><b>{{ offer().coupon?.code }}</b><button class="coupon-copy-button" (click)="copy($event)">{{ copied() ? 'Copiado ✓' : 'Copiar cupom' }}</button></div><p>{{ offer().coupon?.description || offer().description }}</p></div>
  </article>`
})
export class CouponOfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly copied = signal(false);
  private readonly router = inject(Router);

  open(event?: Event): void { event?.preventDefault(); void this.router.navigate(['/product', this.offer().id]); }
  copy(event: Event): void {
    event.stopPropagation();
    navigator.clipboard?.writeText(this.offer().coupon?.code || '');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
}
