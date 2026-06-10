import { Injectable, inject } from "@angular/core";
import { DEFAULT_USER } from "../core/user.defaults";
import { UserService } from "./user.service";

export type PasswordResetResult = "success" | "not-found" | "cooldown";

@Injectable({ providedIn: "root" })
export class PasswordRecoveryService {
  private readonly userService = inject(UserService);
  private readonly emailKey = "cyberdrops.password-reset.email";
  private readonly cooldownKey = "cyberdrops.password-reset.cooldown";
  private readonly cooldownDuration = 30_000;
  private readonly mockDelay = 1_400;

  async mockSendPasswordResetEmail(
    email: string,
  ): Promise<PasswordResetResult> {
    await this.wait(this.mockDelay);

    if (!this.emailExists(email)) return "not-found";
    if (this.cooldownRemaining() > 0) return "cooldown";

    localStorage.setItem(this.emailKey, this.normalizeEmail(email));
    localStorage.setItem(
      this.cooldownKey,
      String(Date.now() + this.cooldownDuration),
    );
    return "success";
  }

  resetEmail(): string {
    return localStorage.getItem(this.emailKey) || "";
  }

  cooldownRemaining(): number {
    const cooldownUntil = Number(localStorage.getItem(this.cooldownKey) || 0);
    return Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
  }

  updatePassword(password: string): boolean {
    const email = this.resetEmail();
    if (!email) return false;

    this.userService.updatePassword(email, password);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.cooldownKey);
    return true;
  }

  private emailExists(email: string): boolean {
    const normalizedEmail = this.normalizeEmail(email);
    return [DEFAULT_USER.email, this.userService.user().email].some(
      (registeredEmail) =>
        this.normalizeEmail(registeredEmail) === normalizedEmail,
    );
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLocaleLowerCase("pt-BR");
  }

  private wait(duration: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
}
