import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '../models';
import { AppIconComponent } from './app-icon.component';
import { DiscountLabelPipe } from './brl-format.pipe';

@Component({
  selector: 'app-coupon-offer-card',
  standalone: true,
  imports: [AppIconComponent, DiscountLabelPipe],
  template: `<article class="coupon-offer-card" role="link" tabindex="0" (click)="open()" (keydown.enter)="open()" (keydown.space)="open($event)">
    <header><img class="coupon-bot-avatar" src="assets/coupon-bot.svg" alt="Bot de cupons"><div><strong>{{ offer().publicationType ? offer().author.name : offer().store }}</strong><small>{{ offer().publicationType ? offer().store + ' · ' + offer().time : offer().time }}</small></div><span class="coupon-discount">{{ offer().publicationDiscountLabel || (offer().discount | discountLabel) }}</span><button class="coupon-share-button" aria-label="Compartilhar cupom" (click)="share($event)"><app-icon [name]="shared() ? 'check' : 'share'" [size]="16"/></button></header>
    <div class="coupon-offer-main"><div class="coupon-info"><b>{{ offer().coupon?.code }}</b><p>{{ offer().coupon?.description || offer().description }}</p></div><button class="coupon-copy-button" (click)="copy($event)"><app-icon [name]="copied() ? 'check' : 'copy'" [size]="16"/>{{ copied() ? 'Copiado' : 'Copiar cupom' }}</button></div>
  </article>`
})
export class CouponOfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly copied = signal(false);
  readonly shared = signal(false);
  private readonly router = inject(Router);

  open(event?: Event): void { event?.preventDefault(); void this.router.navigate(['/product', this.offer().id]); }
  copy(event: Event): void {
    event.stopPropagation();
    navigator.clipboard?.writeText(this.offer().coupon?.code || '');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
  async share(event: Event): Promise<void> {
    event.stopPropagation();
    const url = `${window.location.origin}/product/${this.offer().id}`;
    const text = `${this.offer().coupon?.code}: ${this.offer().coupon?.description || this.offer().description}`;
    if (navigator.share) {
      try { await navigator.share({ title: `Cupom ${this.offer().store}`, text, url }); } catch { return; }
    } else {
      await navigator.clipboard?.writeText(url); this.shared.set(true); setTimeout(() => this.shared.set(false), 1600);
    }
  }
}
