import { Component, input, output } from "@angular/core";
import { Store } from "../models";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-store-filter",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./store-filter.component.html",
})
export class StoreFilterComponent {
  readonly stores = input.required<Store[]>();
  readonly selected = input("");
  readonly changed = output<string>();
}
