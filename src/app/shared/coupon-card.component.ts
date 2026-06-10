import { Component, input, signal } from "@angular/core";
import { Coupon } from "../models";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-coupon-card",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./coupon-card.component.html",
})
export class CouponCardComponent {
  readonly coupon = input.required<Coupon>();
  readonly copied = signal(false);
  copy(): void {
    navigator.clipboard?.writeText(this.coupon().code);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
}
