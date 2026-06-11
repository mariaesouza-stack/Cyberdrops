import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { DEFAULT_AVATAR } from "../core/community-users";
import { UserService } from "../services/user.service";
import { AppIconComponent } from "../shared/app-icon.component";

interface RegisterDraft {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  termsAccepted: boolean;
}

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AppIconComponent],
  templateUrl: "./register.page.html",
})
export class RegisterPage {
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  private readonly draftKey = "cyberdrops.register-draft";
  name = "";
  username = "";
  email = "";
  phone = "";
  password = "";
  termsAccepted = false;

  constructor() {
    this.restoreDraft();
  }

  saveDraft(): void {
    const draft: RegisterDraft = {
      name: this.name,
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
      termsAccepted: this.termsAccepted,
    };
    sessionStorage.setItem(this.draftKey, JSON.stringify(draft));
  }

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
    sessionStorage.removeItem(this.draftKey);
    void this.router.navigateByUrl("/home");
  }

  private restoreDraft(): void {
    try {
      const draft = JSON.parse(
        sessionStorage.getItem(this.draftKey) || "",
      ) as RegisterDraft;
      this.name = draft.name || "";
      this.username = draft.username || "";
      this.email = draft.email || "";
      this.phone = draft.phone || "";
      this.password = draft.password || "";
      this.termsAccepted = !!draft.termsAccepted;
    } catch {
      sessionStorage.removeItem(this.draftKey);
    }
  }
}
