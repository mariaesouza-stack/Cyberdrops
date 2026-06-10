import { Component, input, output } from "@angular/core";
import { CYBER_AVATARS } from "../core/community-users";
import { AppAvatarComponent } from "./app-avatar.component";

@Component({
  selector: "app-avatar-picker",
  standalone: true,
  imports: [AppAvatarComponent],
  templateUrl: "./avatar-picker.component.html",
})
export class AvatarPickerComponent {
  readonly avatars = CYBER_AVATARS;
  readonly selected = input("");
  readonly picked = output<string>();
}
