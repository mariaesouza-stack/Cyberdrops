import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { OfferService } from "../services/offer.service";
import { AppIconComponent } from "../shared/app-icon.component";
import { CouponOfferCardComponent } from "../shared/coupon-offer-card.component";
import { OfferCardComponent } from "../shared/offer-card.component";
import { RelatedProductCardComponent } from "../shared/related-product-card.component";

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CouponOfferCardComponent,
    OfferCardComponent,
    RelatedProductCardComponent,
    AppIconComponent,
  ],
  templateUrl: "./search.page.html",
})
export class SearchPage {
  readonly service = inject(OfferService);
  readonly query = signal("");
  readonly focused = signal(false);
  private timer?: ReturnType<typeof setTimeout>;
  readonly results = computed(() => this.service.offers());
  readonly couponOffers = computed(() => {
    const coupons = this.service
      .offers()
      .filter((offer) => offer.coupon)
      .slice(0, 3);
    if (coupons.length) return coupons;
    const codes = ["PLAYER20", "CYBER15", "DROP10"];
    return this.service
      .offers()
      .slice(0, 3)
      .map((offer, index) => ({
        ...offer,
        coupon: {
          code: codes[index],
          description: `${offer.discount || 10}% OFF em ${offer.store}`,
          store: offer.store,
        },
      }));
  });
  readonly popularProducts = computed(() =>
    this.service
      .offers()
      .filter((offer) => !offer.coupon)
      .slice(0, 3),
  );
  search(query: string): void {
    this.query.set(query);
    clearTimeout(this.timer);
    this.timer = setTimeout(
      () =>
        query.trim()
          ? void this.service.searchOffers(query.trim())
          : void this.service.getOffers(),
      300,
    );
  }
  clear(): void {
    this.query.set("");
    void this.service.getOffers();
  }
}
