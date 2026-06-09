import { Component, effect, input, output, signal } from '@angular/core';
import { CouponPublicationDraft, DealPublicationDraft, Offer, PublicationDraft, PublicationType } from '../models';
import { AppIconComponent } from './app-icon.component';
import { CreateCouponFormComponent } from './create-coupon-form.component';
import { CreateDealItemFormComponent } from './create-deal-item-form.component';

@Component({
  selector: 'app-create-publication-modal',
  standalone: true,
  imports: [AppIconComponent, CreateCouponFormComponent, CreateDealItemFormComponent],
  template: `<div class="publication-overlay" (click)="closed.emit()"><section class="publication-sheet" role="dialog" aria-modal="true" aria-label="Criar publicação" (click)="$event.stopPropagation()">
    <header><div><p class="eyebrow">{{ publication() ? 'EDITAR PUBLICAÇÃO' : 'COMPARTILHE UM DROP' }}</p><h2>{{ type() ? (type() === 'coupon' ? (publication() ? 'Editar cupom' : 'Publicar cupom') : (publication() ? 'Editar item em promoção' : 'Publicar item em promoção')) : 'O que você quer publicar?' }}</h2></div><button aria-label="Fechar" (click)="closed.emit()"><app-icon name="x" [size]="20"/></button></header>
    @if (!type()) { <div class="publication-options"><button (click)="type.set('coupon')"><span><app-icon name="ticket-percent" [size]="24"/></span><b>Publicar cupom</b><small>Compartilhe um código de desconto válido.</small><app-icon name="arrow-right" [size]="18"/></button><button (click)="type.set('deal')"><span><app-icon name="badge-percent" [size]="24"/></span><b>Publicar item em promoção</b><small>Envie um produto com preço reduzido.</small><app-icon name="arrow-right" [size]="18"/></button></div>
    } @else { @if (!publication()) { <button class="publication-back" (click)="type.set(undefined)"><app-icon name="arrow-left" [size]="16"/>Voltar às opções</button> }@if (type() === 'coupon') { <app-create-coupon-form [initial]="couponDraft()" (submitted)="submitted.emit($event)"/> } @else { <app-create-deal-item-form [initial]="dealDraft()" (submitted)="submitted.emit($event)"/> } }
  </section></div>`
})
export class CreatePublicationModalComponent {
  readonly closed = output<void>();
  readonly submitted = output<PublicationDraft>();
  readonly publication = input<Offer>();
  readonly type = signal<PublicationType | undefined>(undefined);
  constructor() { effect(() => { const publication = this.publication(); if (publication?.publicationType) this.type.set(publication.publicationType); }); }
  couponDraft(): CouponPublicationDraft | undefined { const draft = this.publication()?.publicationDraft; return draft?.type === 'coupon' ? draft : undefined; }
  dealDraft(): DealPublicationDraft | undefined { const draft = this.publication()?.publicationDraft; return draft?.type === 'deal' ? draft : undefined; }
}
