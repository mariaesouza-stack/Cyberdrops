import { Component, input } from "@angular/core";
import { AppIconComponent, AppIconName } from "./app-icon.component";

@Component({
  selector: "app-auth-feedback-message",
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: "./auth-feedback-message.component.html",
})
export class AuthFeedbackMessageComponent {
  readonly message = input.required<string>();
  readonly type = input<"error" | "success" | "info">("info");

  icon(): AppIconName {
    if (this.type() === "error") return "circle-alert";
    if (this.type() === "success") return "shield-check";
    return "mail";
  }
}
