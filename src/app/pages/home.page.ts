import { Component, computed, inject, signal } from '@angular/core';
import { OfferService } from '../services/offer.service';
import { AppIconComponent } from '../shared/app-icon.component';
import { CouponOfferCardComponent } from '../shared/coupon-offer-card.component';
import { OfferCardComponent } from '../shared/offer-card.component';
import { StoreFilterComponent } from '../shared/store-filter.component';

@Component({
  standalone: true, imports: [CouponOfferCardComponent, OfferCardComponent, StoreFilterComponent, AppIconComponent],
  template: `<section class="page feed-page">
    <div class="hero"><div><p class="eyebrow">DROPS EM ALTA</p><h1>Boa noite, player.</h1><p>Encontramos <b>{{ offers().length }} ofertas</b> no seu radar.</p></div><div class="radar"><app-icon name="radar" [size]="34"/></div></div>
    @if (service.message()) { <p class="api-message">{{ service.message() }}</p> }
    <app-store-filter [stores]="service.stores" [selected]="store()" (changed)="changeStore($event)"/>
    <div class="tabs category-tabs home-feed-tabs">@for (option of feedOptions; track option) { <button [class.active]="feedType() === option" (click)="feedType.set(option)">{{ option }}</button> }</div>
    <div class="feed">
      @if (service.loading()) { @for (item of [1,2,3]; track item) { <div class="offer-skeleton"><i></i><span></span><b></b></div> } }
      @else {
        @if (feedType() !== 'Produtos') { @for (coupon of couponOffers(); track coupon.id) { <app-coupon-offer-card class="home-coupon-card" [offer]="coupon"/> } }
        @if (feedType() !== 'Cupons') { @for (offer of productOffers(); track offer.id) { <app-offer-card [offer]="offer"/> } }
        @if (!visibleOffersCount()) { <div class="empty"><app-icon name="search" [size]="36"/><b>Sem drops por aqui.</b><span>Tente outro filtro.</span></div> }
      }
    </div>
  </section>`
})
export class HomePage {
  readonly service = inject(OfferService);
  readonly feedOptions = ['Todos', 'Produtos', 'Cupons'] as const;
  readonly feedType = signal<(typeof this.feedOptions)[number]>('Todos');
  readonly store = signal('');
  readonly offers = computed(() => this.service.offers().filter(offer => !this.store() || offer.store === this.store()));
  readonly couponOffers = computed(() => {
    const coupons = this.offers().filter(offer => offer.coupon);
    if (coupons.length) return coupons;
    const offer = this.offers()[0];
    return offer ? [{ ...offer, coupon: { code: 'CYBERDROP', description: `${offer.discount || 10}% OFF em ${offer.store}`, store: offer.store } }] : [];
  });
  readonly productOffers = computed(() => this.offers().filter(offer => !offer.coupon));
  readonly visibleOffersCount = computed(() => {
    if (this.feedType() === 'Produtos') return this.productOffers().length;
    if (this.feedType() === 'Cupons') return this.couponOffers().length;
    return this.productOffers().length + this.couponOffers().length;
  });
  constructor() { void this.service.getOffers(); }
  async changeStore(store: string): Promise<void> { this.store.set(store); await this.service.filterByStore(store); }
}
