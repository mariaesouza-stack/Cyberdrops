import { Component, inject, input, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { Offer } from '../models';
import { ShareService } from '../services/share.service';
import { AppIconComponent } from './app-icon.component';
import { DiscountLabelPipe } from './brl-format.pipe';
import { ContentCategoryBadgeComponent } from './content-category-badge.component';
import { AppAvatarComponent } from './app-avatar.component';

@Component({
  selector: 'app-coupon-offer-card',
  standalone: true,
  imports: [AppIconComponent, AppAvatarComponent, DiscountLabelPipe, ContentCategoryBadgeComponent],
  template: `<article class="coupon-offer-card" role="link" tabindex="0" (click)="open()" (keydown.enter)="open()" (keydown.space)="open($event)">
    <header><span class="coupon-publisher-avatar"><app-avatar [src]="offer().author.avatar" [alt]="'Avatar de ' + offer().author.name"/></span><div><strong>{{ offer().author.name }}</strong><small>{{ offer().store }} · {{ offer().time }}</small></div><app-content-category-badge [category]="offer().category" [coupon]="true"/><span class="coupon-discount">{{ offer().publicationDiscountLabel || (offer().discount | discountLabel) }}</span><button class="coupon-share-button" aria-label="Compartilhar cupom" (click)="share($event)"><app-icon [name]="shared() ? 'check' : 'share'" [size]="16"/></button></header>
    <div class="coupon-offer-main"><div class="coupon-info"><b>{{ offer().coupon?.code }}</b><p>{{ offer().coupon?.description || offer().description }}</p></div><button class="coupon-copy-button" [attr.aria-label]="copied() ? 'Cupom copiado' : 'Copiar cupom'" (click)="copy($event)"><app-icon [name]="copied() ? 'check' : 'copy'" [size]="16"/><span>{{ copied() ? 'Copiado' : 'Copiar cupom' }}</span></button></div>
  </article>`
})
export class CouponOfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly copied = signal(false);
  readonly shared = signal(false);
  private readonly shareService = inject(ShareService);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  async open(event?: Event): Promise<void> {
    event?.preventDefault();
    const navigated = await this.router.navigate(['/product', this.offer().id]);
    if (navigated) requestAnimationFrame(() => this.viewportScroller.scrollToPosition([0, 0]));
  }
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
    const result = await this.shareService.share({ title: `Cupom ${this.offer().store}`, text, url });
    if (result === 'copied' || result === 'native') { this.shared.set(true); setTimeout(() => this.shared.set(false), 1600); }
  }
}
