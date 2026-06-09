import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CouponPublicationDraft } from '../models';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-create-coupon-form',
  standalone: true,
  imports: [FormsModule, AppIconComponent],
  template: `<form class="publication-form" (ngSubmit)="submit()">
    <label>Nome da loja<input required name="store" [(ngModel)]="draft.store" placeholder="Ex.: Kabum"></label>
    <label>Código do cupom<input required name="code" [(ngModel)]="draft.code" placeholder="Ex.: CYBER10"></label>
    <div class="publication-form-row"><label>Tipo de desconto<select name="discountKind" [(ngModel)]="draft.discountKind"><option value="percent">Percentual</option><option value="value">Valor em reais</option></select></label><label>{{ draft.discountKind === 'percent' ? 'Desconto (%)' : 'Desconto (R$)' }}<input required min="0" step="0.01" type="number" name="discountValue" [(ngModel)]="draft.discountValue" placeholder="10"></label></div>
    <label>Data de validade<input required type="date" name="expiresAt" [(ngModel)]="draft.expiresAt"></label>
    <label>Descrição curta<textarea required maxlength="160" name="description" [(ngModel)]="draft.description" placeholder="Informe onde o cupom pode ser utilizado"></textarea></label>
    <label>Link da loja<input required type="url" name="url" [(ngModel)]="draft.url" placeholder="https://"></label>
    <button class="button primary wide" type="submit"><app-icon name="send" [size]="17"/>Enviar cupom</button>
  </form>`
})
export class CreateCouponFormComponent {
  readonly submitted = output<CouponPublicationDraft>();
  draft: CouponPublicationDraft = { type: 'coupon', store: '', code: '', discountKind: 'percent', discountValue: 10, expiresAt: '', description: '', url: '' };
  submit(): void {
    if (!this.draft.store.trim() || !this.draft.code.trim() || !this.draft.expiresAt || !this.draft.description.trim() || !this.draft.url.trim()) return;
    this.submitted.emit({ ...this.draft, store: this.draft.store.trim(), code: this.draft.code.trim().toUpperCase(), description: this.draft.description.trim(), url: this.draft.url.trim() });
  }
}
