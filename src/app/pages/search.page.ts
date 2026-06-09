import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { AppIconComponent } from '../shared/app-icon.component';
import { CouponOfferCardComponent } from '../shared/coupon-offer-card.component';
import { OfferCardComponent } from '../shared/offer-card.component';

@Component({
  standalone: true, imports: [FormsModule, CouponOfferCardComponent, OfferCardComponent, RouterLink, AppIconComponent],
  template: `<section class="page search-page"><p class="eyebrow">SCAN GLOBAL</p><h1>O que você procura?</h1>
    <label class="search-box"><span class="search-icon"><app-icon name="search" [size]="24"/></span><input [ngModel]="query()" (ngModelChange)="search($event)" (focus)="focused.set(true)" (blur)="focused.set(false)" placeholder="Busque por produtos, cupons e lojas">@if (focused() && query().length > 0) { <button type="button" aria-label="Limpar busca" (mousedown)="$event.preventDefault()" (click)="clear()"><app-icon name="x" [size]="20"/></button> }</label>
    @if (service.message()) { <p class="api-message">{{ service.message() }}</p> }
    @if (service.loading()) { <div class="offer-skeleton"><i></i><span></span><b></b></div> }
    @if (query()) { <div class="search-results"><h2>Resultados para “{{ query() }}”</h2>@for (offer of results(); track offer.id) { <app-offer-card [offer]="offer"/> } @empty { <div class="empty"><app-icon name="search" [size]="36"/><b>Nenhum drop encontrado.</b><span>Tente buscar por Steam, games ou hardware.</span></div> }</div>
    } @else { <div class="discover"><section><div class="section-heading"><h2>Lojas populares</h2></div><div class="popular-stores">@for (store of service.stores.slice(0, 3); track store.id) { <button><i [style.background]="store.color"><app-icon [name]="store.icon" [size]="16"/></i><b>{{ store.name }}</b></button> }</div></section>
      <section><div class="section-heading"><h2>Cupons populares</h2></div><div class="coupon-scroll">@for (offer of couponOffers(); track offer.id) { <app-coupon-offer-card [offer]="offer"/> }</div></section>
      <section><div class="section-heading"><h2>Produtos populares</h2></div><div class="game-carousel">@for (game of service.offers(); track game.id) { <a [routerLink]="['/product', game.id]"><img [src]="game.image" [alt]="game.title"><b>{{ game.title }}</b><span>{{ game.store }}</span></a> }</div></section></div> }
  </section>`
})
export class SearchPage {
  readonly service = inject(OfferService); readonly query = signal(''); readonly focused = signal(false); private timer?: ReturnType<typeof setTimeout>;
  readonly results = computed(() => this.service.offers());
  readonly couponOffers = computed(() => {
    const coupons = this.service.offers().filter(offer => offer.coupon).slice(0, 3);
    if (coupons.length) return coupons;
    const codes = ['PLAYER20', 'CYBER15', 'DROP10'];
    return this.service.offers().slice(0, 3).map((offer, index) => ({ ...offer, coupon: { code: codes[index], description: `${offer.discount || 10}% OFF em ${offer.store}`, store: offer.store } }));
  });
  search(query: string): void { this.query.set(query); clearTimeout(this.timer); this.timer = setTimeout(() => query.trim() ? void this.service.searchOffers(query.trim()) : void this.service.getOffers(), 300); }
  clear(): void { this.query.set(''); void this.service.getOffers(); }
}
