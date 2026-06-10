import { Component, input, output } from "@angular/core";
import { Offer } from "../models";
import { AppIconComponent } from "./app-icon.component";
import { BrlCurrencyPipe } from "./brl-format.pipe";
import { PublicationStatusBadgeComponent } from "./publication-status-badge.component";
import { PublicationTypeBadgeComponent } from "./publication-type-badge.component";

@Component({
  selector: "app-user-publication-card",
  standalone: true,
  imports: [
    AppIconComponent,
    BrlCurrencyPipe,
    PublicationStatusBadgeComponent,
    PublicationTypeBadgeComponent,
  ],
  templateUrl: "./user-publication-card.component.html",
})
export class UserPublicationCardComponent {
  readonly publication = input.required<Offer>();
  readonly edited = output<Offer>();
  readonly deleted = output<Offer>();
  dateLabel(): string {
    return new Intl.DateTimeFormat("pt-BR").format(
      new Date(this.publication().createdAt),
    );
  }
}
