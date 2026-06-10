import { ViewportScroller } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { Offer } from "../models";
import { BrlCurrencyPipe } from "./brl-format.pipe";

@Component({
  selector: "app-related-product-card",
  standalone: true,
  imports: [BrlCurrencyPipe],
  templateUrl: "./related-product-card.component.html",
})
export class RelatedProductCardComponent {
  readonly product = input.required<Offer>();
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  async open(event?: Event): Promise<void> {
    event?.preventDefault();
    const navigated = await this.router.navigate([
      "/product",
      this.product().id,
    ]);
    if (navigated)
      requestAnimationFrame(() =>
        this.viewportScroller.scrollToPosition([0, 0]),
      );
  }
}
