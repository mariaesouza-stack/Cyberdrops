import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { UserService } from "../services/user.service";
import { AppAvatarComponent } from "../shared/app-avatar.component";
import { AppIconComponent } from "../shared/app-icon.component";
import { AvatarPickerComponent } from "../shared/avatar-picker.component";

@Component({
  standalone: true,
  imports: [
    RouterLink,
    AvatarPickerComponent,
    AppIconComponent,
    AppAvatarComponent,
  ],
  templateUrl: "./avatar.page.html",
})
export class AvatarPage {
  readonly service = inject(UserService);
  readonly router = inject(Router);
  readonly selected = signal(this.service.user().avatar);
  save(): void {
    this.service.setAvatar(this.selected());
    this.router.navigateByUrl("/profile");
  }
}
