import { Component, input, output } from '@angular/core';
import { PublicationStatus } from '../models';

export type PublicationStatusFilter = 'Todos' | PublicationStatus;

@Component({
  selector: 'app-publication-status-filter',
  standalone: true,
  template: `<div class="publication-status-filter">@for (option of options; track option) { <button [class.active]="selected() === option" (click)="changed.emit(option)">{{ option }}</button> }</div>`
})
export class PublicationStatusFilterComponent {
  readonly selected = input<PublicationStatusFilter>('Todos');
  readonly changed = output<PublicationStatusFilter>();
  readonly options: PublicationStatusFilter[] = ['Todos', 'Em análise', 'Publicado', 'Rejeitado'];
}
