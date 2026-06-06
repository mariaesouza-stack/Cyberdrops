import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  standalone: true,
  template: `<section class="page notifications-page">
    <div class="page-heading"><div><p class="eyebrow">CENTRAL DE ALERTAS</p><h1>Notificações</h1></div><button>Marcar como lidas</button></div>
    <div class="notification-feed">
      @for (item of service.notifications(); track item.id) {
        <article><i [class.active]="item.enabled"></i><div><b>{{ item.label }}</b><p>Novidades selecionadas para o seu perfil gamer.</p><small>Agora</small></div><button>›</button></article>
      }
    </div>
  </section>`
})
export class NotificationsPage { readonly service = inject(UserService); }
