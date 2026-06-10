import { Component, input, output } from "@angular/core";
import { AppNotification } from "../models";
import { AppIconComponent } from "./app-icon.component";

@Component({
  selector: "app-notification-card",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./notification-card.component.html",
})
export class NotificationCardComponent {
  readonly notification = input.required<AppNotification>();
  readonly opened = output<AppNotification>();
  readonly read = output<string>();
  actionLabel(): string {
    const action = this.notification().action;
    if (action === "coupon") return "Abrir cupom";
    if (action === "profile") return "Abrir perfil";
    return action === "product" ? "Abrir produto" : "Abrir oferta";
  }
}
