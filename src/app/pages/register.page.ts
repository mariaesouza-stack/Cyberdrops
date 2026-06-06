import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true, imports: [FormsModule, RouterLink],
  template: `<main class="auth-page"><a class="back" routerLink="/login">←</a><section class="auth-card">
    <div><p class="eyebrow">NOVO PLAYER</p><h1>Crie sua conta</h1><p class="muted">Entre para a comunidade que paga menos.</p></div>
    <form><label>Nome completo<input placeholder="Como podemos te chamar?"></label><label>Nome de usuário<input placeholder="@seuusername"></label><label>E-mail<input type="email" placeholder="voce@email.com"></label><label>Telefone<input type="tel" placeholder="(00) 00000-0000"></label><label>Senha<input type="password" placeholder="Crie uma senha forte"></label>
      <label class="check"><input type="checkbox"> Li e aceito os termos de uso</label><a class="button primary wide" routerLink="/home">Finalizar cadastro</a></form>
    <div class="divider"><span>cadastro rápido</span></div><div class="social"><button>Steam</button><button>Epic</button><button>Google</button></div>
  </section></main>`
})
export class RegisterPage {}
