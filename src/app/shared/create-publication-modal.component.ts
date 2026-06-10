import { Component, effect, input, output, signal } from "@angular/core";
import {
  CouponPublicationDraft,
  DealPublicationDraft,
  Offer,
  PublicationDraft,
  PublicationType,
} from "../models";
import { AppIconComponent } from "./app-icon.component";
import { CreateCouponFormComponent } from "./create-coupon-form.component";
import { CreateDealItemFormComponent } from "./create-deal-item-form.component";

@Component({
  selector: "app-create-publication-modal",
  standalone: true,
  imports: [
    AppIconComponent,
    CreateCouponFormComponent,
    CreateDealItemFormComponent,
  ],
  templateUrl: "./create-publication-modal.component.html",
})
export class CreatePublicationModalComponent {
  readonly closed = output<void>();
  readonly submitted = output<PublicationDraft>();
  readonly publication = input<Offer>();
  readonly type = signal<PublicationType | undefined>(undefined);
  constructor() {
    effect(() => {
      const publication = this.publication();
      if (publication?.publicationType)
        this.type.set(publication.publicationType);
    });
  }
  couponDraft(): CouponPublicationDraft | undefined {
    const draft = this.publication()?.publicationDraft;
    return draft?.type === "coupon" ? draft : undefined;
  }
  dealDraft(): DealPublicationDraft | undefined {
    const draft = this.publication()?.publicationDraft;
    return draft?.type === "deal" ? draft : undefined;
  }
}
