import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { OfferService } from "../services/offer.service";
import { UserService } from "../services/user.service";
import { AppAvatarComponent } from "../shared/app-avatar.component";
import { AppIconComponent } from "../shared/app-icon.component";
import { OfferCardComponent } from "../shared/offer-card.component";
import { UserPublicationsTabComponent } from "../shared/user-publications-tab.component";

@Component({
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    OfferCardComponent,
    AppIconComponent,
    AppAvatarComponent,
    UserPublicationsTabComponent,
  ],
  templateUrl: "./profile.page.html",
})
export class ProfilePage {
  readonly service = inject(UserService);
  readonly offers = inject(OfferService);
  readonly router = inject(Router);
  readonly tab = signal<"edit" | "notifications" | "publications" | "saved">(
    "edit",
  );
  readonly saved = signal(false);
  draft = { ...this.service.user() };
  constructor() {
    void this.offers.getOffers();
  }
  save(): void {
    this.service.update(this.draft);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
  logout(): void {
    this.service.logout();
    void this.router.navigateByUrl("/login");
  }
}
