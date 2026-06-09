import { Component, computed, inject, signal } from '@angular/core';
import { Offer, PublicationDraft } from '../models';
import { OfferService } from '../services/offer.service';
import { UserService } from '../services/user.service';
import { AppIconComponent } from './app-icon.component';
import { CreatePublicationModalComponent } from './create-publication-modal.component';
import { DeletePublicationModalComponent } from './delete-publication-modal.component';
import { PublicationStatusFilter, PublicationStatusFilterComponent } from './publication-status-filter.component';
import { UserPublicationCardComponent } from './user-publication-card.component';

@Component({
  selector: 'app-user-publications-tab',
  standalone: true,
  imports: [AppIconComponent, CreatePublicationModalComponent, DeletePublicationModalComponent, PublicationStatusFilterComponent, UserPublicationCardComponent],
  template: `<section class="user-publications-tab"><div class="user-publications-heading"><div><h2>Minhas publicações</h2><p>Acompanhe o ciclo dos seus cupons e itens em promoção.</p></div><button (click)="createOpen.set(true)"><app-icon name="plus" [size]="17"/>Publicar agora</button></div>
    <app-publication-status-filter [selected]="filter()" (changed)="filter.set($event)"/>
    <div class="user-publications-list">@for (publication of filtered(); track publication.id) { <app-user-publication-card [publication]="publication" (edited)="editing.set($event)" (deleted)="deleting.set($event)"/> } @empty { <div class="user-publications-empty"><app-icon name="badge-percent" [size]="38"/><h3>Nenhuma publicação ainda</h3><p>Quando você compartilhar cupons ou itens em promoção, eles aparecerão aqui.</p><button class="button primary" (click)="createOpen.set(true)"><app-icon name="plus" [size]="17"/>Publicar agora</button></div> }</div>
    @if (createOpen()) { <app-create-publication-modal (closed)="createOpen.set(false)" (submitted)="create($event)"/> }
    @if (editing(); as publication) { <app-create-publication-modal [publication]="publication" (closed)="editing.set(undefined)" (submitted)="update(publication, $event)"/> }
    @if (deleting(); as publication) { <app-delete-publication-modal [publication]="publication" (cancelled)="deleting.set(undefined)" (confirmed)="remove($event)"/> }
    @if (feedback()) { <div class="publication-success" role="status"><app-icon name="check" [size]="18"/><span><b>{{ feedback() }}</b><small>As alterações já foram aplicadas às suas publicações.</small></span></div> }
  </section>`
})
export class UserPublicationsTabComponent {
  readonly offers = inject(OfferService);
  readonly user = inject(UserService);
  readonly filter = signal<PublicationStatusFilter>('Todos');
  readonly createOpen = signal(false);
  readonly editing = signal<Offer | undefined>(undefined);
  readonly deleting = signal<Offer | undefined>(undefined);
  readonly feedback = signal('');
  readonly publications = computed(() => this.offers.offers().filter(item => item.publicationType && item.author.id === this.user.user().id));
  readonly filtered = computed(() => this.filter() === 'Todos' ? this.publications() : this.publications().filter(item => item.publicationStatus === this.filter()));
  create(draft: PublicationDraft): void { this.offers.createPublication(draft, this.user.user()); this.createOpen.set(false); this.showFeedback('Publicação enviada com sucesso.'); }
  update(publication: Offer, draft: PublicationDraft): void { this.offers.updatePublication(publication.id, draft, this.user.user()); this.editing.set(undefined); this.filter.set('Todos'); this.showFeedback('Publicação atualizada e reenviada para análise.'); }
  remove(id: number): void { this.offers.deletePublication(id, this.user.user().id); this.deleting.set(undefined); this.showFeedback('Publicação excluída com sucesso.'); }
  private showFeedback(message: string): void { this.feedback.set(message); setTimeout(() => this.feedback.set(''), 3500); }
}
