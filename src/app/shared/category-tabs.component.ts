import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-category-tabs",
  standalone: true,
  templateUrl: "./category-tabs.component.html",
})
export class CategoryTabsComponent {
  readonly tabs = ["Todos", "Cupons", "Games", "Hardware"];
  readonly selected = input("Todos");
  readonly changed = output<string>();
}
