import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  standalone: true, imports: [FormsModule, RouterLink],
  template: `<section class="page profile-page"><div class="profile-hero"><a class="avatar profile-avatar" routerLink="/avatars">{{ service.user().avatar }}<span>✎</span></a><h1>{{ service.user().name }}</h1><p>{{ service.user().username }}</p><div><b>18</b><span>Drops</span><b>2.4k</b><span>Fogo recebido</span></div></div>
    <div class="tabs pill-tabs"><button [class.active]="tab() === 'edit'" (click)="tab.set('edit')">Editar informações</button><button [class.active]="tab() === 'notifications'" (click)="tab.set('notifications')">Notificações</button></div>
    @if (tab() === 'edit') { <form class="profile-form"><label>Nome<input [(ngModel)]="draft.name" name="name"></label><label>Username<input [(ngModel)]="draft.username" name="username"></label><label>E-mail<input [(ngModel)]="draft.email" name="email"></label><label>Telefone<input [(ngModel)]="draft.phone" name="phone"></label><label>Senha<input [(ngModel)]="draft.password" name="password" type="password" placeholder="Altere sua senha"></label><button type="button" class="button primary wide" (click)="save()">Salvar alterações</button></form>
    } @else { <div class="notification-list">@for (item of service.notifications(); track item.id) { <button (click)="service.toggleNotification(item.id)"><span><b>{{ item.label }}</b><small>Receber alerta no aplicativo</small></span><i [class.on]="item.enabled"></i></button> }</div> }
    <button class="button secondary logout-button" (click)="logout()">Sair da conta</button>
  </section>`
})
export class ProfilePage {
  readonly service = inject(UserService); readonly router = inject(Router); readonly tab = signal<'edit'|'notifications'>('edit'); draft = { ...this.service.user() };
  save(): void { this.service.update(this.draft); }
  logout(): void { this.service.logout(); void this.router.navigateByUrl('/login'); }
}
