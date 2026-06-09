import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OfferService } from '../services/offer.service';
import { UserService } from '../services/user.service';
import { AppAvatarComponent } from '../shared/app-avatar.component';
import { AppIconComponent } from '../shared/app-icon.component';
import { OfferCardComponent } from '../shared/offer-card.component';
import { UserPublicationsTabComponent } from '../shared/user-publications-tab.component';

@Component({
  standalone: true, imports: [FormsModule, RouterLink, OfferCardComponent, AppIconComponent, AppAvatarComponent, UserPublicationsTabComponent],
  template: `<section class="page profile-page"><div class="profile-hero"><a class="avatar profile-avatar" routerLink="/avatars" aria-label="Selecionar avatar cyber"><app-avatar [src]="service.user().avatar" [alt]="'Avatar de ' + service.user().name"/><span><app-icon name="pencil" [size]="14"/></span></a><h1>{{ service.user().name }}</h1><p>{{ service.user().username }}</p><div><b>18</b><span>Drops</span><b>2.4k</b><span>Fogo recebido</span></div></div>
    <div class="tabs pill-tabs"><button [class.active]="tab() === 'edit'" (click)="tab.set('edit')">Editar informações</button><button [class.active]="tab() === 'notifications'" (click)="tab.set('notifications')">Notificações</button><button [class.active]="tab() === 'publications'" (click)="tab.set('publications')">Minhas publicações <span>{{ offers.getUserPublications(service.user().id).length }}</span></button><button [class.active]="tab() === 'saved'" (click)="tab.set('saved')">Salvos <span>{{ offers.savedOffers().length }}</span></button></div>
    @if (tab() === 'edit') { <form class="profile-form"><label>Nome<input [(ngModel)]="draft.name" name="name"></label><label>Username<input [(ngModel)]="draft.username" name="username"></label><label>E-mail<input [(ngModel)]="draft.email" name="email"></label><label>Telefone<input [(ngModel)]="draft.phone" name="phone"></label><label>Senha<input [(ngModel)]="draft.password" name="password" type="password" placeholder="Altere sua senha"></label><button type="button" class="button primary wide" (click)="save()">@if (saved()) { <app-icon name="check" [size]="16"/>Alterações salvas } @else { Salvar alterações }</button>@if (saved()) { <p class="save-feedback" role="status">Seu perfil foi atualizado com sucesso.</p> }</form>
    } @else if (tab() === 'notifications') { <div class="notification-list">@for (item of service.notifications(); track item.id) { <button (click)="service.toggleNotification(item.id)"><span><b>{{ item.label }}</b><small>Receber alerta no aplicativo</small></span><i [class.on]="item.enabled"></i></button> }</div>
    } @else if (tab() === 'publications') { <app-user-publications-tab/>
    } @else { <div class="saved-offers">@for (offer of offers.savedOffers(); track offer.id) { <app-offer-card [offer]="offer"/> } @empty { <div class="empty"><app-icon name="bookmark" [size]="36"/><b>Nenhuma oferta salva</b><span>Salve ofertas para encontrá-las rapidamente aqui.</span></div> }</div> }
    <div class="logout-divider"></div><button class="button secondary logout-button" (click)="logout()"><app-icon name="log-out" [size]="16"/>Sair da conta</button>
  </section>`
})
export class ProfilePage {
  readonly service = inject(UserService); readonly offers = inject(OfferService); readonly router = inject(Router); readonly tab = signal<'edit'|'notifications'|'publications'|'saved'>('edit'); readonly saved = signal(false); draft = { ...this.service.user() };
  constructor() { void this.offers.getOffers(); }
  save(): void { this.service.update(this.draft); this.saved.set(true); setTimeout(() => this.saved.set(false), 2500); }
  logout(): void { this.service.logout(); void this.router.navigateByUrl('/login'); }
}
