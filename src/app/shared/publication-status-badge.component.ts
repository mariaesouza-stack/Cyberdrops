import { Component, input } from '@angular/core';
import { PublicationStatus } from '../models';

@Component({
  selector: 'app-publication-status-badge',
  standalone: true,
  template: `@if (status(); as value) { <span class="publication-status" [class.pending]="value === 'Em análise'" [class.published]="value === 'Publicado'" [class.rejected]="value === 'Rejeitado'">{{ value }}</span> }`
})
export class PublicationStatusBadgeComponent {
  readonly status = input<PublicationStatus>();
}
