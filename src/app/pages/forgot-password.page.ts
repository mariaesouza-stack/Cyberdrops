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
  templateUrl: "./forgot-password.page.html",
})
export class ForgotPasswordPage {
  private readonly recovery = inject(PasswordRecoveryService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly feedback = signal("");
  email = "";

  async submit(): Promise<void> {
    this.feedback.set("");

    if (!this.isValidEmail(this.email)) {
      this.feedback.set("Digite um e-mail válido.");
      return;
    }

    this.loading.set(true);
    const result = await this.recovery.mockSendPasswordResetEmail(this.email);
    this.loading.set(false);

    if (result === "not-found") {
      this.feedback.set("Não encontramos uma conta vinculada a este e-mail.");
      return;
    }

    await this.router.navigateByUrl("/reset-password-confirmation");
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
}
