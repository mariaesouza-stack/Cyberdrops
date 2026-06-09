import { Component, computed, inject, signal } from '@angular/core';
import { OfferService } from '../services/offer.service';
import { OfferCardComponent } from '../shared/offer-card.component';
import { StoreFilterComponent } from '../shared/store-filter.component';

@Component({
  standalone: true, imports: [OfferCardComponent, StoreFilterComponent],
  template: `<section class="page feed-page">
    <div class="hero"><div><p class="eyebrow">DROPS EM ALTA</p><h1>Boa noite, player.</h1><p>Encontramos <b>{{ offers().length }} ofertas</b> no seu radar.</p></div><div class="radar">⌾</div></div>
    @if (service.message()) { <p class="api-message">{{ service.message() }}</p> }
    <app-store-filter [stores]="service.stores" [selected]="store()" (changed)="changeStore($event)"/>
    <div class="feed">
      @if (service.loading()) { @for (item of [1,2,3]; track item) { <div class="offer-skeleton"><i></i><span></span><b></b></div> } }
      @else { @for (offer of offers(); track offer.id) { <app-offer-card [offer]="offer"/> }
        @empty { <div class="empty"><b>Sem drops por aqui.</b><span>Tente outro filtro.</span></div> }
      }
    </div>
  </section>`
})
export class HomePage {
  readonly service = inject(OfferService);
  readonly store = signal('');
  readonly offers = computed(() => this.service.offers().filter(offer => !this.store() || offer.store === this.store()));
  constructor() { void this.service.getOffers(); }
  async changeStore(store: string): Promise<void> { this.store.set(store); await this.service.filterByStore(store); }
}
