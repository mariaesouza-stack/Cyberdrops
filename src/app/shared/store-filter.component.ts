import { Component, input, output } from '@angular/core';
import { Store } from '../models';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-store-filter', standalone: true, imports: [AppIconComponent],
  template: `<div class="store-scroll">
    @for (store of stores(); track store.id) {
      <button class="store-chip" [class.active]="selected() === store.id" (click)="changed.emit(selected() === store.id ? '' : store.id)">
        <i [style.background]="store.color"><app-icon [name]="store.icon" [size]="16"/></i>{{ store.name }}
      </button>
    }
  </div>`
})
export class StoreFilterComponent {
  readonly stores = input.required<Store[]>();
  readonly selected = input('');
  readonly changed = output<string>();
}
