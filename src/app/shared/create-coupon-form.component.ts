import { Component, effect, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CouponPublicationDraft } from "../models";
import { AppIconComponent } from "./app-icon.component";
import {
  PublicationOption,
  PublicationOptionTabsComponent,
} from "./publication-option-tabs.component";

@Component({
  selector: "app-create-coupon-form",
  standalone: true,
  imports: [FormsModule, AppIconComponent, PublicationOptionTabsComponent],
  templateUrl: "./create-coupon-form.component.html",
})
export class CreateCouponFormComponent {
  readonly discountOptions: readonly PublicationOption[] = [
    { label: "Percentual", value: "percent" },
    { label: "Valor em reais", value: "value" },
  ];
  readonly submitted = output<CouponPublicationDraft>();
  readonly initial = input<CouponPublicationDraft>();
  draft: CouponPublicationDraft = {
    type: "coupon",
    store: "",
    code: "",
    discountKind: "percent",
    discountValue: 10,
    expiresAt: "",
    description: "",
    url: "",
  };
  constructor() {
    effect(() => {
      const initial = this.initial();
      if (initial) this.draft = { ...initial };
    });
  }
  setDiscountKind(value: string): void {
    this.draft.discountKind = value as CouponPublicationDraft["discountKind"];
  }

  submit(): void {
    if (
      !this.draft.store.trim() ||
      !this.draft.code.trim() ||
      !this.draft.expiresAt ||
      !this.draft.description.trim() ||
      !this.draft.url.trim()
    )
      return;
    this.submitted.emit({
      ...this.draft,
      store: this.draft.store.trim(),
      code: this.draft.code.trim().toUpperCase(),
      description: this.draft.description.trim(),
      url: this.draft.url.trim(),
    });
  }
}
