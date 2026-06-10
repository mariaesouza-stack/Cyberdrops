import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ThemeService } from "../services/theme.service";
import { NotificationService } from "../services/notification.service";
import { UserService } from "../services/user.service";
import { AppAvatarComponent } from "./app-avatar.component";
import { AppIconComponent } from "./app-icon.component";
import { NotificationBadgeComponent } from "./notification-badge.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    RouterLink,
    AppIconComponent,
    AppAvatarComponent,
    NotificationBadgeComponent,
  ],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  readonly user = inject(UserService);
  readonly notifications = inject(NotificationService);
}
