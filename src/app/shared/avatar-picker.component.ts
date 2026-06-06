import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-avatar-picker', standalone: true,
  template: `<div class="avatar-grid">
    @for (avatar of avatars; track avatar) {
      <button class="avatar choice" [class.selected]="selected() === avatar" (click)="picked.emit(avatar)">{{ avatar }}</button>
    }
  </div>`
})
export class AvatarPickerComponent {
  readonly avatars = ['👾','🤖','🧙','🦾','🥷','👽','🧛','🦹','🧑‍🚀','🧠','💀','⚡'];
  readonly selected = input('');
  readonly picked = output<string>();
}
