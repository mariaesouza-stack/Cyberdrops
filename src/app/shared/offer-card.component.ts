import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from '../models';
import { OfferService } from '../services/offer.service';

@Component({
  selector: 'app-offer-card', standalone: true, imports: [CurrencyPipe, RouterLink],
  template: `<article class="offer-card">
    <div class="offer-user"><span class="avatar mini">{{ offer().author.avatar }}</span><div><strong>{{ offer().author.name }}</strong><small>{{ offer().store }} · {{ offer().time }}</small></div><button>•••</button></div>
    <a [routerLink]="['/product', offer().id]" class="offer-image"><img [src]="offer().image" [alt]="offer().title"><span class="discount">-{{ offer().discount }}%</span><span class="category">{{ offer().category }}</span></a>
    <div class="offer-body"><a [routerLink]="['/product', offer().id]"><h2>{{ offer().title }}</h2></a><p>{{ offer().description }}</p>
      <div class="price"><small>{{ offer().oldPrice | currency:'BRL' }}</small><strong>{{ offer().price | currency:'BRL' }}</strong></div>
      <div class="offer-actions"><button (click)="service.vote(offer().id, 'like')">🔥 {{ offer().likes }}</button><button (click)="service.vote(offer().id, 'dislike')">❄ {{ offer().dislikes }}</button><button>◌ {{ offer().comments.length }}</button><button>↗</button></div>
    </div>
  </article>`
})
export class OfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly service = inject(OfferService);
}
