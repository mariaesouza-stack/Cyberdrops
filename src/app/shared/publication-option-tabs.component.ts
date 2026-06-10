import { Component, input, output } from "@angular/core";

export interface PublicationOption {
  label: string;
  value: string;
}

@Component({
  selector: "app-publication-option-tabs",
  standalone: true,
  templateUrl: "./publication-option-tabs.component.html",
})
export class PublicationOptionTabsComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly options = input.required<readonly PublicationOption[]>();
  readonly changed = output<string>();
}
