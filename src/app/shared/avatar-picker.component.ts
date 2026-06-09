import { Component, input, output } from '@angular/core';
import { CYBER_AVATARS } from '../core/community-users';
import { AppAvatarComponent } from './app-avatar.component';

@Component({
  selector: 'app-avatar-picker', standalone: true, imports: [AppAvatarComponent],
  template: `<div class="avatar-grid">
    @for (avatar of avatars; track avatar) {
      <button class="avatar choice" [class.selected]="selected() === avatar" (click)="picked.emit(avatar)" aria-label="Selecionar avatar cyber"><app-avatar [src]="avatar"/></button>
    }
  </div>`
})
export class AvatarPickerComponent {
  readonly avatars = CYBER_AVATARS;
  readonly selected = input('');
  readonly picked = output<string>();
}
