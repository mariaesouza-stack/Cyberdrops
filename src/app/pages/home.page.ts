import { Component, computed, inject, signal } from "@angular/core";
import { OfferService } from "../services/offer.service";
import { UserService } from "../services/user.service";
import { PublicationDraft } from "../models";
import { AppIconComponent } from "../shared/app-icon.component";
import { CouponOfferCardComponent } from "../shared/coupon-offer-card.component";
import { OfferCardComponent } from "../shared/offer-card.component";
import { StoreFilterComponent } from "../shared/store-filter.component";
import { CreatePublicationModalComponent } from "../shared/create-publication-modal.component";
import { FloatingActionButtonComponent } from "../shared/floating-action-button.component";

@Component({
  standalone: true,
  imports: [
    CouponOfferCardComponent,
    OfferCardComponent,
    StoreFilterComponent,
    AppIconComponent,
    CreatePublicationModalComponent,
    FloatingActionButtonComponent,
  ],
  templateUrl: "./home.page.html",
})
export class HomePage {
  readonly service = inject(OfferService);
  readonly user = inject(UserService);
  readonly publicationOpen = signal(false);
  readonly publicationSuccess = signal(false);
  readonly filterOpen = signal(false);
  readonly feedOptions = ["Todos", "Produtos", "Cupons"] as const;
  readonly categoryOptions = [
    { label: "Games", value: "Games" },
    { label: "Consoles", value: "Consoles" },
    { label: "Hardwares", value: "Hardware" },
    { label: "Periféricos", value: "Periféricos" },
  ] as const;
  readonly feedType = signal<(typeof this.feedOptions)[number]>("Todos");
  readonly categories = signal<string[]>([]);
  readonly selectedCategoryOptions = computed(() =>
    this.categoryOptions.filter((option) =>
      this.categories().includes(option.value),
    ),
  );
  readonly store = signal("");
  readonly offers = computed(() =>
    this.service
      .offers()
      .filter(
        (offer) =>
          (!this.store() || offer.store === this.store()) &&
          (!this.categories().length ||
            this.categories().some(
              (category) =>
                offer.category.toLocaleLowerCase("pt-BR") ===
                category.toLocaleLowerCase("pt-BR"),
            )),
      ),
  );
  readonly couponOffers = computed(() => {
    const coupons = this.sortByNewest(
      this.offers().filter((offer) => offer.coupon),
    );
    if (coupons.length) return coupons;
    if (this.categories().length) return [];
    const offer = this.offers()[0];
    return offer
      ? [
          {
            ...offer,
            coupon: {
              code: "CYBERDROP",
              description: `${offer.discount || 10}% OFF em ${offer.store}`,
              store: offer.store,
            },
          },
        ]
      : [];
  });
  readonly productOffers = computed(() =>
    this.sortByNewest(this.offers().filter((offer) => !offer.coupon)),
  );
  readonly chronologicalOffers = computed(() =>
    this.sortByNewest(this.offers()),
  );
  readonly visibleOffersCount = computed(() => {
    if (this.feedType() === "Produtos") return this.productOffers().length;
    if (this.feedType() === "Cupons") return this.couponOffers().length;
    return this.productOffers().length + this.couponOffers().length;
  });
  constructor() {
    void this.service.getOffers();
  }
  async changeStore(store: string): Promise<void> {
    this.store.set(store);
    await this.service.filterByStore(store);
  }
  hasCategory(category: string): boolean {
    return this.categories().includes(category);
  }
  toggleCategory(category: string): void {
    this.categories.update((items) =>
      items.includes(category)
        ? items.filter((item) => item !== category)
        : [...items, category],
    );
  }
  removeCategory(category: string): void {
    this.categories.update((items) =>
      items.filter((item) => item !== category),
    );
  }
  clearCategories(): void {
    this.categories.set([]);
  }
  private sortByNewest<T extends { id: number; createdAt: string }>(
    offers: T[],
  ): T[] {
    return [...offers].sort(
      (a, b) =>
        this.postedAt(b.createdAt) - this.postedAt(a.createdAt) || b.id - a.id,
    );
  }
  private postedAt(value: string): number {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
  publish(draft: PublicationDraft): void {
    this.service.createPublication(draft, this.user.user());
    this.store.set("");
    this.feedType.set("Todos");
    this.categories.set([]);
    this.publicationOpen.set(false);
    this.publicationSuccess.set(true);
    setTimeout(() => this.publicationSuccess.set(false), 3500);
  }
}
