import { Component, output } from '@angular/core';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-floating-action-button',
  standalone: true,
  imports: [AppIconComponent],
  template: `<button class="publication-fab" aria-label="Criar publicação" (click)="pressed.emit()"><app-icon name="plus" [size]="24"/><span>Publicar</span></button>`
})
export class FloatingActionButtonComponent {
  readonly pressed = output<void>();
}
