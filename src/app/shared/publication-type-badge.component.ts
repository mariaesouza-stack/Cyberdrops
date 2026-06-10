import { Component, input } from "@angular/core";
import { PublicationType } from "../models";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-publication-type-badge",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./publication-type-badge.component.html",
})
export class PublicationTypeBadgeComponent {
  readonly type = input<PublicationType>();
}
