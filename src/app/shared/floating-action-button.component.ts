import { Component, output } from "@angular/core";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-floating-action-button",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./floating-action-button.component.html",
})
export class FloatingActionButtonComponent {
  readonly pressed = output<void>();
}
