import { Component, input, output } from '@angular/core';
import { Store } from '../models';

@Component({
  selector: 'app-store-filter', standalone: true,
  template: `<div class="store-scroll">
    <button class="store-chip" [class.active]="selected() === ''" (click)="changed.emit('')">✦ Todas</button>
    @for (store of stores(); track store.id) {
      <button class="store-chip" [class.active]="selected() === store.id" (click)="changed.emit(store.id)">
        <i [style.background]="store.color">{{ store.icon }}</i>{{ store.name }}
      </button>
    }
  </div>`
})
export class StoreFilterComponent {
  readonly stores = input.required<Store[]>();
  readonly selected = input('');
  readonly changed = output<string>();
}
