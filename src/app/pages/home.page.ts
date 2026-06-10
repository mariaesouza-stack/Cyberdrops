import { Component, computed, inject, signal } from '@angular/core';
import { OfferService } from '../services/offer.service';
import { UserService } from '../services/user.service';
import { PublicationDraft } from '../models';
import { AppIconComponent } from '../shared/app-icon.component';
import { CouponOfferCardComponent } from '../shared/coupon-offer-card.component';
import { OfferCardComponent } from '../shared/offer-card.component';
import { StoreFilterComponent } from '../shared/store-filter.component';
import { CreatePublicationModalComponent } from '../shared/create-publication-modal.component';
import { FloatingActionButtonComponent } from '../shared/floating-action-button.component';

@Component({
  standalone: true, imports: [CouponOfferCardComponent, OfferCardComponent, StoreFilterComponent, AppIconComponent, CreatePublicationModalComponent, FloatingActionButtonComponent],
  template: `<section class="page feed-page">
    <div class="hero"><div><p class="eyebrow">DROPS EM ALTA</p><h1>Boa noite, player.</h1><p>Encontramos <b>{{ offers().length }} ofertas</b> no seu radar.</p></div><div class="radar"><app-icon name="radar" [size]="34"/></div></div>
    <app-store-filter [stores]="service.stores" [selected]="store()" (changed)="changeStore($event)"/>
    <div class="home-feed-filter-row"><div class="tabs category-tabs home-feed-tabs">@for (option of feedOptions; track option) { <button [class.active]="feedType() === option" (click)="feedType.set(option)">{{ option }}</button> }</div><span class="home-filter-divider"></span><div class="home-category-filter"><button class="category-filter-trigger" [class.active]="categories().length" (click)="filterOpen.set(!filterOpen())" aria-label="Filtrar por categoria" [attr.aria-expanded]="filterOpen()"><app-icon name="filter" [size]="17"/>@if (categories().length) { <span>{{ categories().length }}</span> }</button>@if (filterOpen()) { <div class="category-filter-dropdown"><button [class.active]="!categories().length" (click)="clearCategories()">Todas as categorias</button>@for (option of categoryOptions; track option.value) { <button [class.active]="hasCategory(option.value)" (click)="toggleCategory(option.value)">{{ option.label }}@if (hasCategory(option.value)) { <app-icon name="check" [size]="14"/> }</button> }</div> }</div></div>
    @if (categories().length) { <div class="applied-category-filters" aria-label="Filtros aplicados">@for (option of selectedCategoryOptions(); track option.value) { <span>{{ option.label }}<button aria-label="Remover filtro {{ option.label }}" (click)="removeCategory(option.value)"><app-icon name="x" [size]="13"/></button></span> }</div> }
    <div class="feed">
      @if (service.loading()) { @for (item of [1,2,3]; track item) { <div class="offer-skeleton"><i></i><span></span><b></b></div> } }
      @else {
        @if (feedType() === 'Todos') {
          @for (offer of chronologicalOffers(); track offer.id) {
            @if (offer.coupon) { <app-coupon-offer-card class="home-coupon-card" [offer]="offer"/> }
            @else { <app-offer-card [offer]="offer"/> }
          }
        } @else if (feedType() === 'Cupons') {
          @for (coupon of couponOffers(); track coupon.id) { <app-coupon-offer-card class="home-coupon-card" [offer]="coupon"/> }
        } @else {
          @for (offer of productOffers(); track offer.id) { <app-offer-card [offer]="offer"/> }
        }
        @if (!visibleOffersCount()) { <div class="empty"><app-icon name="search" [size]="36"/><b>Sem drops por aqui.</b><span>Tente outro filtro.</span></div> }
      }
    </div>
    <app-floating-action-button (pressed)="publicationOpen.set(true)"/>
    @if (publicationOpen()) { <app-create-publication-modal (closed)="publicationOpen.set(false)" (submitted)="publish($event)"/> }
    @if (publicationSuccess()) { <div class="publication-success" role="status"><app-icon name="check" [size]="18"/><span><b>Publicação enviada com sucesso.</b><small>Seu conteúdo está em análise e já aparece no feed.</small></span></div> }
  </section>`
})
export class HomePage {
  readonly service = inject(OfferService);
  readonly user = inject(UserService);
  readonly publicationOpen = signal(false);
  readonly publicationSuccess = signal(false);
  readonly filterOpen = signal(false);
  readonly feedOptions = ['Todos', 'Produtos', 'Cupons'] as const;
  readonly categoryOptions = [
    { label: 'Games', value: 'Games' }, { label: 'Consoles', value: 'Consoles' },
    { label: 'Hardwares', value: 'Hardware' }, { label: 'Periféricos', value: 'Periféricos' }
  ] as const;
  readonly feedType = signal<(typeof this.feedOptions)[number]>('Todos');
  readonly categories = signal<string[]>([]);
  readonly selectedCategoryOptions = computed(() => this.categoryOptions.filter(option => this.categories().includes(option.value)));
  readonly store = signal('');
  readonly offers = computed(() => this.service.offers().filter(offer =>
    (!this.store() || offer.store === this.store()) &&
    (!this.categories().length || this.categories().some(category => offer.category.toLocaleLowerCase('pt-BR') === category.toLocaleLowerCase('pt-BR')))
  ));
  readonly couponOffers = computed(() => {
    const coupons = this.sortByNewest(this.offers().filter(offer => offer.coupon));
    if (coupons.length) return coupons;
    if (this.categories().length) return [];
    const offer = this.offers()[0];
    return offer ? [{ ...offer, coupon: { code: 'CYBERDROP', description: `${offer.discount || 10}% OFF em ${offer.store}`, store: offer.store } }] : [];
  });
  readonly productOffers = computed(() => this.sortByNewest(this.offers().filter(offer => !offer.coupon)));
  readonly chronologicalOffers = computed(() => this.sortByNewest(this.offers()));
  readonly visibleOffersCount = computed(() => {
    if (this.feedType() === 'Produtos') return this.productOffers().length;
    if (this.feedType() === 'Cupons') return this.couponOffers().length;
    return this.productOffers().length + this.couponOffers().length;
  });
  constructor() { void this.service.getOffers(); }
  async changeStore(store: string): Promise<void> { this.store.set(store); await this.service.filterByStore(store); }
  hasCategory(category: string): boolean { return this.categories().includes(category); }
  toggleCategory(category: string): void { this.categories.update(items => items.includes(category) ? items.filter(item => item !== category) : [...items, category]); }
  removeCategory(category: string): void { this.categories.update(items => items.filter(item => item !== category)); }
  clearCategories(): void { this.categories.set([]); }
  private sortByNewest<T extends { id: number; createdAt: string }>(offers: T[]): T[] {
    return [...offers].sort((a, b) => this.postedAt(b.createdAt) - this.postedAt(a.createdAt) || b.id - a.id);
  }
  private postedAt(value: string): number {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
  publish(draft: PublicationDraft): void {
    this.service.createPublication(draft, this.user.user());
    this.store.set('');
    this.feedType.set('Todos');
    this.categories.set([]);
    this.publicationOpen.set(false);
    this.publicationSuccess.set(true);
    setTimeout(() => this.publicationSuccess.set(false), 3500);
  }
}
