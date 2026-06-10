import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AppIconComponent } from "../shared/app-icon.component";

@Component({
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: "./splash.page.html",
})
export class SplashPage {}
