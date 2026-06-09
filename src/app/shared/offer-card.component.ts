import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '../models';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-offer-card', standalone: true, imports: [CurrencyPipe],
  template: `<article class="offer-card" role="link" tabindex="0" (click)="open()" (keydown.enter)="open()" (keydown.space)="open($event)">
    <header class="offer-user"><span class="avatar mini">{{ offer().author.avatar }}</span><div><strong>{{ offer().author.name }}</strong><small>{{ offer().store }} · {{ offer().time }}</small></div><button aria-label="Compartilhar" (click)="$event.stopPropagation()">↗</button></header>
    <div class="offer-main">
      <div class="offer-image"><img [src]="offer().image" [alt]="offer().title"><span class="discount">-{{ offer().discount }}%</span></div>
      <div class="offer-body"><h2>{{ offer().title }}</h2><p>{{ offer().description }}</p>
        <div class="offer-price-row"><div class="price"><small>{{ offer().oldPrice | currency:'BRL' }}</small><strong>{{ offer().price | currency:'BRL' }}</strong></div><button class="fire-button" (click)="vote($event, 'like')" aria-label="Curtir oferta">🔥 {{ offer().likes }}</button></div>
      </div>
    </div>
  </article>`
})
export class OfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly service = inject(OfferService);
  private readonly router = inject(Router);
  open(event?: Event): void { event?.preventDefault(); void this.router.navigate(['/product', this.offer().id]); }
  vote(event: Event, kind: 'like' | 'dislike'): void { event.stopPropagation(); this.service.vote(this.offer().id, kind); }
}
