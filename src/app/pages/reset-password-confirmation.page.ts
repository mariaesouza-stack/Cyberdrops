import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { PasswordRecoveryService } from "../services/password-recovery.service";
import { AppIconComponent } from "../shared/app-icon.component";
import { AuthFeedbackMessageComponent } from "../shared/auth-feedback-message.component";

@Component({
  standalone: true,
  imports: [RouterLink, AppIconComponent, AuthFeedbackMessageComponent],
  templateUrl: "./reset-password-confirmation.page.html",
})
export class ResetPasswordConfirmationPage implements OnInit, OnDestroy {
  private readonly recovery = inject(PasswordRecoveryService);
  private readonly router = inject(Router);
  private timer?: ReturnType<typeof setInterval>;
  readonly loading = signal(false);
  readonly cooldown = signal(0);
  readonly feedback = signal("");
  readonly email = this.recovery.resetEmail();

  ngOnInit(): void {
    if (!this.email) {
      void this.router.navigateByUrl("/forgot-password");
      return;
    }

    this.updateCooldown();
    this.timer = setInterval(() => this.updateCooldown(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  async resend(): Promise<void> {
    if (this.loading() || this.cooldown() > 0) return;

    this.loading.set(true);
    const result = await this.recovery.mockSendPasswordResetEmail(this.email);
    this.loading.set(false);
    this.updateCooldown();

    this.feedback.set(
      result === "success"
        ? "As instruções foram enviadas novamente."
        : "Aguarde o tempo indicado antes de tentar novamente.",
    );
  }

  private updateCooldown(): void {
    this.cooldown.set(this.recovery.cooldownRemaining());
  }
}
