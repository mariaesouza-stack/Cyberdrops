import { Component, input, output } from "@angular/core";
import { PublicationStatus } from "../models";

export type PublicationStatusFilter = "Todos" | PublicationStatus;

@Component({
  selector: "app-publication-status-filter",
  standalone: true,
  templateUrl: "./publication-status-filter.component.html",
})
export class PublicationStatusFilterComponent {
  readonly selected = input<PublicationStatusFilter>("Todos");
  readonly changed = output<PublicationStatusFilter>();
  readonly options: PublicationStatusFilter[] = [
    "Todos",
    "Em análise",
    "Publicado",
    "Rejeitado",
  ];
}
