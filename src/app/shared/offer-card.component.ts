import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '../models';
import { OfferService } from '../services/offer.service';
import { ShareService } from '../services/share.service';
import { AppAvatarComponent } from './app-avatar.component';
import { AppIconComponent } from './app-icon.component';
import { BrlCurrencyPipe, DiscountLabelPipe } from './brl-format.pipe';
import { ContentCategoryBadgeComponent } from './content-category-badge.component';

@Component({
  selector: 'app-offer-card', standalone: true, imports: [BrlCurrencyPipe, DiscountLabelPipe, AppIconComponent, AppAvatarComponent, ContentCategoryBadgeComponent],
  template: `<article class="offer-card" role="link" tabindex="0" (click)="open()" (keydown.enter)="open()" (keydown.space)="open($event)">
    <header class="offer-user"><span class="avatar mini"><app-avatar [src]="offer().author.avatar" [alt]="'Avatar de ' + offer().author.name"/></span><div><strong>{{ offer().author.name }}</strong><small>{{ offer().store }} · {{ offer().time }}</small></div><app-content-category-badge [category]="offer().category"/><button class="coupon-share-button" aria-label="Compartilhar oferta" (click)="share($event)"><app-icon [name]="shared() ? 'check' : 'share'" [size]="16"/></button></header>
    <div class="offer-main">
      <div class="offer-image"><img [src]="offer().image" [alt]="offer().title"><span class="discount">{{ offer().discount | discountLabel }}</span></div>
      <div class="offer-body"><h2>{{ offer().title }}</h2><p>{{ offer().description }}</p>
        <div class="offer-price-row"><div class="price"><small>{{ offer().oldPrice | brlCurrency }}</small><strong>{{ offer().price | brlCurrency }}</strong></div><button class="fire-button" [class.active]="service.isVoted(offer().id, 'like')" (click)="vote($event, 'like')" aria-label="Curtir oferta"><app-icon name="flame" [size]="16"/> {{ offer().likes }}</button></div>
      </div>
    </div>
  </article>`
})
export class OfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly service = inject(OfferService);
  readonly shareService = inject(ShareService);
  readonly shared = signal(false);
  private readonly router = inject(Router);
  open(event?: Event): void { event?.preventDefault(); void this.router.navigate(['/product', this.offer().id]); }
  vote(event: Event, kind: 'like' | 'dislike'): void { event.stopPropagation(); this.service.vote(this.offer().id, kind); }
  async share(event: Event): Promise<void> {
    event.stopPropagation();
    const url = `${window.location.origin}/product/${this.offer().id}`;
    const result = await this.shareService.share({ title: this.offer().title, text: this.offer().description, url });
    if (result === 'copied' || result === 'native') { this.shared.set(true); setTimeout(() => this.shared.set(false), 1600); }
  }
}
