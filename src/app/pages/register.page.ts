import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { DEFAULT_AVATAR } from "../core/community-users";
import { UserService } from "../services/user.service";
import { AppIconComponent } from "../shared/app-icon.component";

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AppIconComponent],
  templateUrl: "./register.page.html",
})
export class RegisterPage {
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  name = "";
  username = "";
  email = "";
  phone = "";
  password = "";
  register(): void {
    this.users.register({
      id: Date.now(),
      name: this.name || "Novo Player",
      username: this.username || "@player",
      email: this.email,
      phone: this.phone,
      avatar: DEFAULT_AVATAR,
      password: this.password,
    });
    void this.router.navigateByUrl("/home");
  }
}
