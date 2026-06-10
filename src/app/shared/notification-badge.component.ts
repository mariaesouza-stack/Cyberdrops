import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-notification-badge",
  standalone: true,
  templateUrl: "./notification-badge.component.html",
})
export class NotificationBadgeComponent {
  readonly count = input(0);
  readonly label = computed(() =>
    this.count() > 99 ? "99+" : String(this.count()),
  );
}
