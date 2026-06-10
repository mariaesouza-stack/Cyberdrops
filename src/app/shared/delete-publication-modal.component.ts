import { Component, input, output } from "@angular/core";
import { Offer } from "../models";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-delete-publication-modal",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./delete-publication-modal.component.html",
})
export class DeletePublicationModalComponent {
  readonly publication = input.required<Offer>();
  readonly cancelled = output<void>();
  readonly confirmed = output<number>();
}
