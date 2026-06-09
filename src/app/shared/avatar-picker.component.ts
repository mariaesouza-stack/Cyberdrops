import { Component, input, output } from '@angular/core';
import { AppIconComponent, AppIconName } from './app-icon.component';

@Component({
  selector: 'app-avatar-picker', standalone: true, imports: [AppIconComponent],
  template: `<div class="avatar-grid">
    @for (avatar of avatars; track avatar) {
      <button class="avatar choice" [class.selected]="selected() === avatar" (click)="picked.emit(avatar)" [attr.aria-label]="'Selecionar avatar ' + avatar"><app-icon [name]="avatar" [size]="28"/></button>
    }
  </div>`
})
export class AvatarPickerComponent {
  readonly avatars: AppIconName[] = ['gamepad', 'bot', 'wand-sparkles', 'cpu', 'venetian-mask', 'ghost', 'rocket', 'swords', 'brain-circuit', 'skull', 'zap', 'user'];
  readonly selected = input('');
  readonly picked = output<string>();
}
