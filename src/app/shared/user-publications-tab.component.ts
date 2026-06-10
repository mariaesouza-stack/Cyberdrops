import { Component, computed, inject, signal } from "@angular/core";
import { Offer, PublicationDraft } from "../models";
import { OfferService } from "../services/offer.service";
import { UserService } from "../services/user.service";
import { AppIconComponent } from "./app-icon.component";
import { CreatePublicationModalComponent } from "./create-publication-modal.component";
import { DeletePublicationModalComponent } from "./delete-publication-modal.component";
import {
  PublicationStatusFilter,
  PublicationStatusFilterComponent,
} from "./publication-status-filter.component";
import { UserPublicationCardComponent } from "./user-publication-card.component";

@Component({
  selector: "app-user-publications-tab",
  standalone: true,
  imports: [
    AppIconComponent,
    CreatePublicationModalComponent,
    DeletePublicationModalComponent,
    PublicationStatusFilterComponent,
    UserPublicationCardComponent,
  ],
  templateUrl: "./user-publications-tab.component.html",
})
export class UserPublicationsTabComponent {
  readonly offers = inject(OfferService);
  readonly user = inject(UserService);
  readonly filter = signal<PublicationStatusFilter>("Todos");
  readonly createOpen = signal(false);
  readonly editing = signal<Offer | undefined>(undefined);
  readonly deleting = signal<Offer | undefined>(undefined);
  readonly feedback = signal("");
  readonly publications = computed(() =>
    this.offers
      .offers()
      .filter(
        (item) =>
          item.publicationType && item.author.id === this.user.user().id,
      ),
  );
  readonly filtered = computed(() =>
    this.filter() === "Todos"
      ? this.publications()
      : this.publications().filter(
          (item) => item.publicationStatus === this.filter(),
        ),
  );
  create(draft: PublicationDraft): void {
    this.offers.createPublication(draft, this.user.user());
    this.createOpen.set(false);
    this.showFeedback("Publicação enviada com sucesso.");
  }
  update(publication: Offer, draft: PublicationDraft): void {
    this.offers.updatePublication(publication.id, draft, this.user.user());
    this.editing.set(undefined);
    this.filter.set("Todos");
    this.showFeedback("Publicação atualizada e reenviada para análise.");
  }
  remove(id: number): void {
    this.offers.deletePublication(id, this.user.user().id);
    this.deleting.set(undefined);
    this.showFeedback("Publicação excluída com sucesso.");
  }
  private showFeedback(message: string): void {
    this.feedback.set(message);
    setTimeout(() => this.feedback.set(""), 3500);
  }
}
