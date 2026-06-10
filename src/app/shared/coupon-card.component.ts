import { Component, input, signal } from "@angular/core";
import { COPY_FEEDBACK_DURATION_MS } from "../core/app.constants";
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
  private copyFeedbackTimer?: ReturnType<typeof setTimeout>;

  copy(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    navigator.clipboard?.writeText(this.coupon().code);
    this.copied.set(true);
    clearTimeout(this.copyFeedbackTimer);
    this.copyFeedbackTimer = setTimeout(
      () => {
        this.copied.set(false);
        button.blur();
      },
      COPY_FEEDBACK_DURATION_MS,
    );
  }
}
