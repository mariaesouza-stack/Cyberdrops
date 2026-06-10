import { Component, input, output } from "@angular/core";
import { AppNotificationCategory } from "../models";

export type NotificationFilter = "all" | AppNotificationCategory;

@Component({
  selector: "app-notification-filter",
  standalone: true,
  templateUrl: "./notification-filter.component.html",
})
export class NotificationFilterComponent {
  readonly selected = input<NotificationFilter>("all");
  readonly changed = output<NotificationFilter>();
  readonly options: { id: NotificationFilter; label: string }[] = [
    { id: "all", label: "Todas" },
    { id: "offers", label: "Ofertas" },
    { id: "coupons", label: "Cupons" },
    { id: "favorites", label: "Favoritos" },
    { id: "community", label: "Comunidade" },
    { id: "system", label: "Sistema" },
  ];
}
