import { Component, inject, input, signal } from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";
import { COPY_FEEDBACK_DURATION_MS } from "../core/app.constants";
import { copyText } from "../core/clipboard.utils";
import { Offer } from "../models";
import { OfferService } from "../services/offer.service";
import { ShareService } from "../services/share.service";
import { AppIconComponent } from "./app-icon.component";
import { DiscountLabelPipe } from "./brl-format.pipe";
import { ContentCategoryBadgeComponent } from "./content-category-badge.component";
import { AppAvatarComponent } from "./app-avatar.component";

@Component({
  selector: "app-coupon-offer-card",
  standalone: true,
  imports: [
    AppIconComponent,
    AppAvatarComponent,
    DiscountLabelPipe,
    ContentCategoryBadgeComponent,
  ],
  templateUrl: "./coupon-offer-card.component.html",
})
export class CouponOfferCardComponent {
  readonly offer = input.required<Offer>();
  readonly showLike = input(true);
  readonly showShare = input(true);
  readonly compactCopy = input(false);
  readonly navigationFrom = input("");
  readonly copied = signal(false);
  readonly shared = signal(false);
  private readonly shareService = inject(ShareService);
  readonly offerService = inject(OfferService);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private copyFeedbackTimer?: ReturnType<typeof setTimeout>;

  async open(event?: Event): Promise<void> {
    event?.preventDefault();
    const navigated = await this.router.navigate(["/product", this.offer().id], {
      queryParams: this.navigationFrom()
        ? { from: this.navigationFrom() }
        : undefined,
    });
    if (navigated)
      requestAnimationFrame(() =>
        this.viewportScroller.scrollToPosition([0, 0]),
      );
  }
  like(event: Event): void {
    event.stopPropagation();
    this.offerService.vote(this.offer().id, "like");
  }
  async copy(event: Event): Promise<void> {
    event.stopPropagation();
    const button = event.currentTarget as HTMLButtonElement;
    if (!(await copyText(this.offer().coupon?.code || ""))) return;
    this.copied.set(true);
    clearTimeout(this.copyFeedbackTimer);
    this.copyFeedbackTimer = setTimeout(() => {
      this.copied.set(false);
      button.blur();
    }, COPY_FEEDBACK_DURATION_MS);
  }
  async share(event: Event): Promise<void> {
    event.stopPropagation();
    const url = `${window.location.origin}/product/${this.offer().id}`;
    const text = `${this.offer().coupon?.code}: ${this.offer().coupon?.description || this.offer().description}`;
    const result = await this.shareService.share({
      title: `Cupom ${this.offer().store}`,
      text,
      url,
    });
    if (result === "copied" || result === "native") {
      this.shared.set(true);
      setTimeout(() => this.shared.set(false), 1600);
    }
  }
}
