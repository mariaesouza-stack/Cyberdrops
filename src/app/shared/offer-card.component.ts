import { Component, inject, input, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Offer } from "../models";
import { OfferService } from "../services/offer.service";
import { ShareService } from "../services/share.service";
import { AppAvatarComponent } from "./app-avatar.component";
import { AppIconComponent } from "./app-icon.component";
import { BrlCurrencyPipe, DiscountLabelPipe } from "./brl-format.pipe";
import { ContentCategoryBadgeComponent } from "./content-category-badge.component";

@Component({
  selector: "app-offer-card",
  standalone: true,
  imports: [
    BrlCurrencyPipe,
    DiscountLabelPipe,
    AppIconComponent,
    AppAvatarComponent,
    ContentCategoryBadgeComponent,
  ],
  templateUrl: "./offer-card.component.html",
})
export class OfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly navigationFrom = input("");
  readonly service = inject(OfferService);
  readonly shareService = inject(ShareService);
  readonly shared = signal(false);
  private readonly router = inject(Router);
  open(event?: Event): void {
    event?.preventDefault();
    void this.router.navigate(["/product", this.offer().id], {
      queryParams: this.navigationFrom()
        ? { from: this.navigationFrom() }
        : undefined,
    });
  }
  vote(event: Event, kind: "like" | "dislike"): void {
    event.stopPropagation();
    this.service.vote(this.offer().id, kind);
  }
  async share(event: Event): Promise<void> {
    event.stopPropagation();
    const url = `${window.location.origin}/product/${this.offer().id}`;
    const result = await this.shareService.share({
      title: this.offer().title,
      text: this.offer().description,
      url,
    });
    if (result === "copied" || result === "native") {
      this.shared.set(true);
      setTimeout(() => this.shared.set(false), 1600);
    }
  }
}
