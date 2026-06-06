import { Component, computed, inject, signal } from '@angular/core';
import { OfferService } from '../services/offer.service';
import { CategoryTabsComponent } from '../shared/category-tabs.component';
import { OfferCardComponent } from '../shared/offer-card.component';
import { StoreFilterComponent } from '../shared/store-filter.component';

@Component({
  standalone: true, imports: [CategoryTabsComponent, OfferCardComponent, StoreFilterComponent],
  template: `<section class="page feed-page">
    <div class="hero"><div><p class="eyebrow">DROPS EM ALTA</p><h1>Boa noite, player.</h1><p>Encontramos <b>{{ offers().length }} ofertas</b> no seu radar.</p></div><div class="radar">⌾</div></div>
    <app-store-filter [stores]="service.stores" [selected]="store()" (changed)="store.set($event)"/>
    <app-category-tabs [selected]="category()" (changed)="category.set($event)"/>
    <div class="feed"><div class="section-title"><h2>Feed da comunidade</h2><button>Mais quentes⌄</button></div>
      @if (loading()) { @for (item of [1,2,3]; track item) { <div class="offer-skeleton"><i></i><span></span><b></b></div> } }
      @else { @for (offer of offers(); track offer.id) { <app-offer-card [offer]="offer"/> }
        @empty { <div class="empty"><b>Sem drops por aqui.</b><span>Tente outro filtro.</span></div> }
      }
    </div>
  </section>`
})
export class HomePage {
  readonly service = inject(OfferService);
  readonly loading = signal(true);
  readonly store = signal('');
  readonly category = signal('Todos');
  readonly offers = computed(() => this.service.offers().filter(offer =>
    (!this.store() || offer.store === this.store()) && (this.category() === 'Todos' || offer.category === this.category())
  ));
  constructor() { setTimeout(() => this.loading.set(false), 550); }
}
