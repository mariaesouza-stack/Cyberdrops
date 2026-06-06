import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-category-tabs', standalone: true,
  template: `<div class="tabs category-tabs">
    @for (tab of tabs; track tab) {
      <button [class.active]="selected() === tab" (click)="changed.emit(tab)">{{ tab }}</button>
    }
  </div>`
})
export class CategoryTabsComponent {
  readonly tabs = ['Todos', 'Cupons', 'Games', 'Hardware'];
  readonly selected = input('Todos');
  readonly changed = output<string>();
}
