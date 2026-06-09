import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DealPublicationDraft } from '../models';
import { AppIconComponent } from './app-icon.component';

@Component({
  selector: 'app-create-deal-item-form',
  standalone: true,
  imports: [FormsModule, AppIconComponent],
  template: `<form class="publication-form" (ngSubmit)="submit()">
    <label>Nome do produto<input required name="title" [(ngModel)]="draft.title" placeholder="Ex.: Monitor Gamer 144Hz"></label>
    <label>Loja<input required name="store" [(ngModel)]="draft.store" placeholder="Ex.: Kabum"></label>
    <label>Link da oferta<input required type="url" name="url" [(ngModel)]="draft.url" placeholder="https://"></label>
    <div class="publication-form-row"><label>Preço atual (R$)<input required min="0" step="0.01" type="number" name="price" [(ngModel)]="draft.price" placeholder="899,90"></label><label>Preço anterior (R$)<input required min="0" step="0.01" type="number" name="oldPrice" [(ngModel)]="draft.oldPrice" placeholder="1299,90"></label></div>
    <label>Categoria<select name="category" [(ngModel)]="draft.category"><option>Games</option><option>Hardware</option><option>Periféricos</option><option>Consoles</option></select></label>
    <div class="publication-upload-field"><span>Imagem do produto</span><label class="publication-upload" [class.has-image]="draft.image">
      <input required type="file" accept="image/jpeg,image/png,image/webp" (change)="selectImage($event)">
      @if (draft.image) { <img [src]="draft.image" alt="Prévia da imagem do produto"><span class="publication-upload-action"><app-icon name="image-up" [size]="18"/>Trocar imagem</span>
      } @else { <app-icon name="image-up" [size]="28"/><b>Selecione uma imagem</b><small>JPEG, PNG ou WebP de até 1 MB</small> }
    </label>@if (imageError()) { <small class="publication-upload-error">{{ imageError() }}</small> }</div>
    <label>Descrição curta<textarea required maxlength="160" name="description" [(ngModel)]="draft.description" placeholder="Destaque os principais detalhes da oferta"></textarea></label>
    <button class="button primary wide" type="submit"><app-icon name="send" [size]="17"/>Enviar item em promoção</button>
  </form>`
})
export class CreateDealItemFormComponent {
  readonly submitted = output<DealPublicationDraft>();
  readonly imageError = signal('');
  draft: DealPublicationDraft = { type: 'deal', title: '', store: '', url: '', price: 0, oldPrice: 0, category: 'Games', image: '', description: '' };
  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.imageError.set('Selecione uma imagem JPEG, PNG ou WebP.');
      input.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      this.imageError.set('A imagem deve ter no máximo 1 MB.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { this.draft.image = String(reader.result || ''); this.imageError.set(''); };
    reader.onerror = () => this.imageError.set('Não foi possível carregar esta imagem.');
    reader.readAsDataURL(file);
  }
  submit(): void {
    if (!this.draft.title.trim() || !this.draft.store.trim() || !this.draft.url.trim() || !this.draft.image.trim() || !this.draft.description.trim() || this.draft.oldPrice <= this.draft.price) return;
    this.submitted.emit({ ...this.draft, title: this.draft.title.trim(), store: this.draft.store.trim(), url: this.draft.url.trim(), image: this.draft.image.trim(), description: this.draft.description.trim() });
  }
}
