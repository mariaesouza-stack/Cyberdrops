import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { UserService } from "../services/user.service";
import { AppIconComponent } from "../shared/app-icon.component";

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AppIconComponent],
  templateUrl: "./login.page.html",
})
export class LoginPage {
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  email = "";
  password = "";
  login(): void {
    this.users.login(this.email);
    void this.router.navigateByUrl("/home");
  }
}
