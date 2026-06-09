import { Component, input, output } from '@angular/core';
import { Offer } from '../models';
import { AppIconComponent } from './app-icon.component';
import { BrlCurrencyPipe } from './brl-format.pipe';
import { PublicationStatusBadgeComponent } from './publication-status-badge.component';
import { PublicationTypeBadgeComponent } from './publication-type-badge.component';

@Component({
  selector: 'app-user-publication-card',
  standalone: true,
  imports: [AppIconComponent, BrlCurrencyPipe, PublicationStatusBadgeComponent, PublicationTypeBadgeComponent],
  template: `<article class="user-publication-card">
    <img [src]="publication().image" [alt]="publication().title">
    <div class="user-publication-content"><div class="user-publication-badges"><app-publication-type-badge [type]="publication().publicationType"/><app-publication-status-badge [status]="publication().publicationStatus"/></div><h3>{{ publication().title }}</h3><p>{{ publication().store }} · Enviado em {{ dateLabel() }}</p>@if (publication().publicationType === 'deal') { <strong>{{ publication().price | brlCurrency }}</strong> }<small>{{ publication().moderationMessage }}</small></div>
    <div class="user-publication-actions"><button (click)="edited.emit(publication())"><app-icon name="pencil" [size]="15"/>Editar</button><button class="danger" (click)="deleted.emit(publication())"><app-icon name="trash" [size]="15"/>Excluir</button></div>
  </article>`
})
export class UserPublicationCardComponent {
  readonly publication = input.required<Offer>();
  readonly edited = output<Offer>();
  readonly deleted = output<Offer>();
  dateLabel(): string { return new Intl.DateTimeFormat('pt-BR').format(new Date(this.publication().createdAt)); }
}
