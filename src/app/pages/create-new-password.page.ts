import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { PasswordRecoveryService } from "../services/password-recovery.service";
import { AppIconComponent } from "../shared/app-icon.component";
import { AuthFeedbackMessageComponent } from "../shared/auth-feedback-message.component";

@Component({
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AppIconComponent,
    AuthFeedbackMessageComponent,
  ],
  templateUrl: "./create-new-password.page.html",
})
export class CreateNewPasswordPage {
  private readonly recovery = inject(PasswordRecoveryService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly feedback = signal("");
  readonly success = signal(false);
  password = "";
  confirmation = "";

  constructor() {
    if (!this.recovery.resetEmail())
      void this.router.navigateByUrl("/forgot-password");
  }

  async submit(): Promise<void> {
    const validationError = this.validationError();
    if (validationError) {
      this.feedback.set(validationError);
      return;
    }

    this.feedback.set("");
    this.loading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    this.loading.set(false);

    if (!this.recovery.updatePassword(this.password)) {
      await this.router.navigateByUrl("/forgot-password");
      return;
    }

    this.success.set(true);
    setTimeout(() => void this.router.navigateByUrl("/login"), 1_800);
  }

  private validationError(): string {
    if (this.password.length < 8)
      return "A senha deve possuir pelo menos 8 caracteres.";
    if (!/[A-Za-z]/.test(this.password))
      return "A senha deve possuir pelo menos uma letra.";
    if (!/\d/.test(this.password))
      return "A senha deve possuir pelo menos um número.";
    if (this.password !== this.confirmation)
      return "A confirmação deve ser igual à nova senha.";
    return "";
  }
}
