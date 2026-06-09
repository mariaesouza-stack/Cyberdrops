import { Component, input, signal } from '@angular/core';
import { FALLBACK_AVATAR } from '../core/community-users';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `<img [src]="failed() ? fallback : src()" [alt]="alt()" loading="lazy" (error)="failed.set(true)">`
})
export class AppAvatarComponent {
  readonly src = input('');
  readonly alt = input('Avatar cyber');
  readonly failed = signal(false);
  readonly fallback = FALLBACK_AVATAR;
}
