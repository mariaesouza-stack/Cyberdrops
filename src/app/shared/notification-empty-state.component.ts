import { Component } from "@angular/core";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-notification-empty-state",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./notification-empty-state.component.html",
})
export class NotificationEmptyStateComponent {}
