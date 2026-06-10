import { Component, input, signal } from "@angular/core";
import { FALLBACK_AVATAR } from "../core/community-users";

@Component({
  selector: "app-avatar",
  standalone: true,
  templateUrl: "./app-avatar.component.html",
})
export class AppAvatarComponent {
  readonly src = input("");
  readonly alt = input("Avatar cyber");
  readonly failed = signal(false);
  readonly fallback = FALLBACK_AVATAR;
}
