import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DEFAULT_AVATAR } from '../core/community-users';
import { UserService } from '../services/user.service';
import { AppIconComponent } from '../shared/app-icon.component';

@Component({
  standalone: true, imports: [FormsModule, RouterLink, AppIconComponent],
  template: `<main class="auth-page"><a class="back" routerLink="/login" aria-label="Voltar"><app-icon name="arrow-left" [size]="20"/></a><section class="auth-card">
    <div><p class="eyebrow">NOVO PLAYER</p><h1>Crie sua conta</h1><p class="muted">Entre para a comunidade que paga menos.</p></div>
    <form (ngSubmit)="register()"><label>Nome completo<input [(ngModel)]="name" name="name" placeholder="Como podemos te chamar?"></label><label>Nome de usuário<input [(ngModel)]="username" name="username" placeholder="@seuusername"></label><label>E-mail<input [(ngModel)]="email" name="email" type="email" placeholder="voce@email.com"></label><label>Telefone<input [(ngModel)]="phone" name="phone" type="tel" placeholder="(00) 00000-0000"></label><label>Senha<input [(ngModel)]="password" name="password" type="password" placeholder="Crie uma senha forte"></label>
      <label class="check"><input type="checkbox" required> Li e aceito os termos de uso</label><button class="button primary wide">Finalizar cadastro</button></form>
    <div class="divider"><span>cadastro rápido</span></div><div class="social"><button>Steam</button><button>Epic</button><button>Google</button></div>
  </section></main>`
})
export class RegisterPage {
  private readonly users = inject(UserService); private readonly router = inject(Router);
  name = ''; username = ''; email = ''; phone = ''; password = '';
  register(): void { this.users.register({ id: Date.now(), name: this.name || 'Novo Player', username: this.username || '@player', email: this.email, phone: this.phone, avatar: DEFAULT_AVATAR, password: this.password }); void this.router.navigateByUrl('/home'); }
}
