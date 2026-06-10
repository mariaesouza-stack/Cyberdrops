import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ThemeService {
  readonly isLight = signal(
    localStorage.getItem("cyberdrops.theme") === "light",
  );
  constructor() {
    document.body.classList.toggle("light-theme", this.isLight());
  }
  toggle(): void {
    this.isLight.update((value) => !value);
    document.body.classList.toggle("light-theme", this.isLight());
    localStorage.setItem("cyberdrops.theme", this.isLight() ? "light" : "dark");
  }
}
