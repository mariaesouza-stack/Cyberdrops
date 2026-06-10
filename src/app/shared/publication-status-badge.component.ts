import { Component, input } from "@angular/core";
import { PublicationStatus } from "../models";

@Component({
  selector: "app-publication-status-badge",
  standalone: true,
  templateUrl: "./publication-status-badge.component.html",
})
export class PublicationStatusBadgeComponent {
  readonly status = input<PublicationStatus>();
}
