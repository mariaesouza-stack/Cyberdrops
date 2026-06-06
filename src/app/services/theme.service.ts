import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isLight = signal(false);
  toggle(): void {
    this.isLight.update(value => !value);
    document.body.classList.toggle('light-theme', this.isLight());
  }
}
