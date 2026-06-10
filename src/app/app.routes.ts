import { Routes } from "@angular/router";
import { AvatarPage } from "./pages/avatar.page";
import { CreateNewPasswordPage } from "./pages/create-new-password.page";
import { ForgotPasswordPage } from "./pages/forgot-password.page";
import { HomePage } from "./pages/home.page";
import { LoginPage } from "./pages/login.page";
import { NotificationsPage } from "./pages/notifications.page";
import { ProductPage } from "./pages/product.page";
import { ProfilePage } from "./pages/profile.page";
import { RegisterPage } from "./pages/register.page";
import { ResetPasswordConfirmationPage } from "./pages/reset-password-confirmation.page";
import { SearchPage } from "./pages/search.page";
import { SplashPage } from "./pages/splash.page";

export const routes: Routes = [
  { path: "", component: SplashPage },
  { path: "login", component: LoginPage },
  { path: "register", component: RegisterPage },
  { path: "forgot-password", component: ForgotPasswordPage },
  {
    path: "reset-password-confirmation",
    component: ResetPasswordConfirmationPage,
  },
  { path: "create-new-password", component: CreateNewPasswordPage },
  { path: "home", component: HomePage },
  { path: "product/:id", component: ProductPage },
  { path: "search", component: SearchPage },
  { path: "notifications", component: NotificationsPage },
  { path: "profile", component: ProfilePage },
  { path: "avatars", component: AvatarPage },
  { path: "**", redirectTo: "" },
];
